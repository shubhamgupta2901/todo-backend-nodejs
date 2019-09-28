const express = require('express');
const Task = require('../models/task');

const router = new express.Router();

router.post('/tasks', async (request, response)=>{
    const task = new Task(request.body);
    try {
        const taskResponse = await task.save();
        response.status(201).send(taskResponse);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

router.get('/tasks', async (request, response)=>{
    try {
        const tasks = await Task.find({});
        response.status(200).send(tasks);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.get('/tasks/:id',async (request, response)=>{
    const _id = request.params.id;
    try {
        const task = await Task.findById(_id);
        if(!task){
            return response.status(404).send({error: "Task does not exist."})
        }
        response.status(200).send(task);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

router.patch('/tasks/:id',async (request, response)=> {
    const _id = request.params.id;
    const allowedUpdateFields = ['description','completed'];
    const requestedUpdateFields = Object.keys(request.body);

    requestedUpdateFields.forEach(field => {
        if(!allowedUpdateFields.includes(field)){
            return response.status(400).send({error: `Either Tasks does not have ${field} field or it can not be updated.`});
        }
    });
    try {   
        const task = await Task.findById(_id);
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

router.delete('/tasks/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const deletedUser = await Task.findByIdAndDelete(id);
        if(!deletedUser){
            return response.status(404).send({error: `Task with id ${id} does not exist.`});
        }
        return response.status(200).send(deletedUser);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

module.exports = router;
