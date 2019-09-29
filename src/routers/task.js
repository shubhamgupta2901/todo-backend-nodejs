const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')

const router = new express.Router();

router.post('/tasks',auth, async (request, response)=>{
    const task = new Task({
        ...request.body,
        author: request.user._id
    });
    try {
        const taskResponse = await task.save();
        response.status(201).send(taskResponse);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

router.get('/tasks', auth,async (request, response)=>{
    try {
        const tasks = await Task.find({author: request.user._id});
        response.status(200).send(tasks);   
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.get('/tasks/:id',auth, async (request, response)=>{
    const _id = request.params.id;
    try {
        const task = await Task.findOne({_id, author:request.user._id});
        if(!task){
            return response.status(404).send({error: "Task does not exist."})
        }
        response.status(200).send(task);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.patch('/tasks/:id',auth, async (request, response)=> {
    const _id = request.params.id;
    const allowedUpdateFields = ['description','completed'];
    const requestedUpdateFields = Object.keys(request.body);
    const isValidOperation = requestedUpdateFields.every(field=> allowedUpdateFields.includes(field));

    if(!isValidOperation)
        return response.status(400).send({error: 'Invalid updates!'});
    try {   
        const task = await Task.findOne({_id,author: request.user._id});
        if(!task){
            return response.status(404).send({error: 'Task does not exist'});
        }
        requestedUpdateFields.forEach(field => {
            task[field] = request.body[field];
        })
        await task.save();
        response.status(200).send(task);
    } catch (error) {
        response.status(400).status({error: error.message});
    }
})

router.delete('/tasks/:id',auth, async (request, response) => {
    const _id = request.params.id;
    try {
        const deletedTask = await Task.findOneAndDelete({_id, author: request.user._id});
        if(!deletedTask){
            return response.status(404).send({error: `Task does not exist.`});
        }
        return response.status(200).send(deletedTask);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

module.exports = router;
