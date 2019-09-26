const mongoose = require('mongoose');

const Task = mongoose.model('tasks',{
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
});

module.exports = Task;

