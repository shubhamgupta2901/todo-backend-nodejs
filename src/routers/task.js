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

router.post('/tasks/many',auth, async(request,response)=>{
    const tasks = request.body.map(task=> (
        new Task({
            ...task, 
            author: request.user._id
        })
    ));
    try {
        tasks.forEach(async (task)=> { await task.save()});
        response.status(200).send({message: 'Saved!'})
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

router.get('/tasks', auth,async (request, response)=>{
    const { search =undefined, completed = undefined,page = 1, size = 10} = request.query; 
    const queryFields = { author: request.user._id};
    search ? queryFields['$text'] = { $search : search } : null,
    completed ? queryFields['completed'] = completed : null;
    
    try {
        const tasks = await Task.find({
           ...queryFields
        }).skip((page-1)*size)
        .limit(parseInt(size));
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
