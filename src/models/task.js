const mongoose = require('mongoose');

/**
 * Notice the ref property in author. It allows us to associate a reference of an instance of another model, in this case the User Model.
 * We pass a string to ref property which should be the same as the name we provided to create User model.
 * With this ref in place, we can easily fetch the entire user profile whenever we have access to individual tasks.
 * Consider following code: 
 *    const task = await Task.findbyId(_id);
 *    await task.populate('author').execPopulate();
 * populate() enables us to take author and convert from being the _id of author to being the entire profile of that author.
 * This is just syntatical sugar provided by Mongoose which under the hood finds the author by _id, fetches the document and replaces the value of author key from _id to the user document 
 */

let Schema = mongoose.Schema;
let taskSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        required: false,
        default: false,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true 
});
taskSchema.index({description: 'text'});

const Task = mongoose.model('tasks',taskSchema)
module.exports = Task;

