const express = require('express');
require('./db/mongoose'); // By using require, we ensure that the file db/mongoose.js runs which will ensure that mongoose connects to database.
const User = require('./models/user');
const Task = require('./models/task');


const app = express();
const port = process.env.PORT || 3000;

//When we set up this line, node will automatically parse the 
//incoming json to an object so we can access it in our request
app.use(express.json());


app.post('/users', async (request, response)=> {
    const user = new User(request.body);
    try {
        const userResponse = await user.save();
        response.status(201).send(userResponse);
    } catch (error) {
        response.status(400).send({error : error.message});
    } 
});

app.get('/users',async (request, response)=>{
    try {
        const users = await User.find({});
        response.status(200).send(users);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

app.get('/users/:id', async (request, response)=> {
    const _id = request.params.id;
    try {
        const user = await User.findById(_id);
        if(!user){
            return response.status(404).send({error: 'User does not exist'});    
        }
        response.status(200).send(user);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

app.patch('/users/:id',async (request, response)=>{
    const allowedUpdateFields = ['name', 'email', 'password', 'age'];
    const requestedUpdateFields = Object.keys(request.body);

    requestedUpdateFields.forEach(field => {
        if(!allowedUpdateFields.includes(field))
            response.status(400).send({error: `Either Users do not have ${field} field or it can not be updated`});
    })

    const _id = request.params.id;
    try {
        const user = await User.findByIdAndUpdate(_id,request.body,{new: true, runValidators: true});
        if(!user){
            return response.status(404).send({error: 'User does not exist'})
        }

        response.status(200).send(user);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})


app.post('/tasks', async (request, response)=>{
    const task = new Task(request.body);
    try {
        const taskResponse = await task.save();
        response.status(201).send(taskResponse);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

app.get('/tasks', async (request, response)=>{
    try {
        const tasks = await Task.find({});
        response.status(200).send(tasks);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

app.get('/tasks/:id',async (request, response)=>{
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

app.patch('/tasks/:id',async (request, response)=> {
    const _id = request.params.id;
    const allowedUpdateFields = ['description','completed'];
    const requestedUpdateFields = Object.keys(request.body);

    requestedUpdateFields.forEach(field => {
        if(!allowedUpdateFields.includes(field)){
            return response.status(400).send({error: `Either Tasks does not have ${field} field or it can not be updated.`});
        }
    });
    try {
        const task = await Task.findByIdAndUpdate(_id,request.body,{new: true, runValidators: true});
        if(!task){
            return response.status(404).send({error: 'Task does not exist'});
        }
        response.status(200).send(task);
    } catch (error) {
        response.status(400).status({error: error.message});
    }
})

app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);
})