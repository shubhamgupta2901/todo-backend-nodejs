const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('users',{
    name: { 
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
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
});

module.exports = User;

/**
 * USE LIKE:
    const shubham = new User({
    name: 'ShubhamG',
    email: 'shubhg@gmail.com',
    password: 'abc   d',
    });
    shubham.save()
    .then(result=> console.log(result))
    .catch(error=> console.log(error));
 */

