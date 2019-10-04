const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

let Schema = mongoose.Schema;
let userSchema = new Schema({
    name: { 
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (value)=> validator.isEmail(value),
        lowercase: true,
    },
    age: { 
        type: Number,
        default: 0,
        validate: (value) => {
            //return value>=0;
            if(value<0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate: (value)=> {
            if(value.toLowerCase().includes('password'))
                throw new Error('Your password can not contain the word password!');
            return true;
        }
    }, 
    avatar: {
        type: Buffer //store the image in binary format 
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
},{
    timestamps: true
})

/**
 * Setting up a virtual property on User Model.
 * We would like to access all the tasks created by a user by calling user.tasks
 * The tasks live in a seperate collection, and we are not going to store an array of tasks created by a user in the user collection(like we did with tokens), that will be highly inefficient.
 * Thats where we need virtual property. A virtual property is not actual data stored in the collection, its a relationship between two entities, in this case between our user and our task.
 * The parameters passed to virtual() below says that user collection would like to have a virtual property called **tasks**. This property can be found on collection represented by **Tasks** model.
 * The association is such: the value of **_id** field of user document is same as the value of **author** field in task document.
 * 
 * Now we can call user.populate('tasks').execPopulate()
 * This will find all tasks created specifically by this user, and it will store them in a real array on user.tasks property.
 * Now we can call user.tasks to access tasks created by a user.
 * 
 */
userSchema.virtual('tasks',{
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'author',
})

/**
 * methods are available on instances of the Model i.e. documents. also called instance methods.
 */
userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() },process.env.JWT_SECRET,{});
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}   

/**
 * Its important that the method name is toJSON
 * When we pass an object to response.send() in route handlers, express calls JSON.Stringify() to convert objects to string.
 * Whenever we provide a toJSON method to an object, its going to get called whenever an object is going to get stringified by JSON.Stringify().
 * This allows us to manipulate what we want to send by returning an object from toJSON method call.
 * In our case we want to trim out tokens and password from user instances before sending them.
 */
userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password,
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

/**
 * statics methods are available on the models also called Model methods.
 * 
 */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error(`User with email ${email} does not exist.`);
    }
    const isPasswordMatch = await brcypt.compare(password, user.password);
    if(!isPasswordMatch){
        throw new Error(`Unable to login.`)
    } 
    return user;
}

/**
 * Middleware function 
 * Hash the plain password before saving a new user or when user updates the password.
 * Note that the callback function can not be an arrow function because we would need this binding inside it.
 * this variable points to the document which is being saved
 */
userSchema.pre('save', async function (next){
    console.log('user pre save middleware')
    let user = this;
    if (!user.isModified('password')) {
        console.log('password is not updated. not hashing');
        return next();
    }
    const saltRounds = 8;
    const hashedPassword = await brcypt.hash(user.password,saltRounds);
    user.password = hashedPassword;
    next();
})

userSchema.pre('remove', async function(next){
    console.log('pre remove middleware');
    const user = this;
    await Task.deleteMany({author: user._id})
    next();
})


const User = mongoose.model('users',userSchema);
module.exports = User;

