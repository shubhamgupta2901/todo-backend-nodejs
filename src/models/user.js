const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcrypt');

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
    }   
})

userSchema.statics.findByCredentials = async (email, password) => {
    console.log(`findByCredentials : ${email} | ${password}`);
    const user = await User.findOne({email});
    if(!user){
        throw new Error(`User with email ${email} does not exist.`);
    }
    console.log(user);
    const isPasswordMatch = await brcypt.compare(password, user.password);
    if(!isPasswordMatch){
        throw new Error(`Unable to login.`)
    } 
    return user;
}

/**
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


const User = mongoose.model('users',userSchema);
module.exports = User;

