const express = require('express');
require('./db/mongoose'); // By using require, we ensure that the file db/mongoose.js runs which will ensure that mongoose connects to database.
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

//When we set up this line, node will automatically parse the 
//incoming json to an object so we can access it in our request
app.use(express.json());

app.post('/users',(req,res)=>{
    const user = new User(req.body);
    user.save()
    .then(response => res.send(user))
    .catch(error => {
        res.status(400).send(error.message);
    })
})

app.post('/tasks',(req,res)=>{
    const task = new Task(req.body);
    task.save()
    .then(response=> res.send(response))
    .catch(error=> res.status(400).send(error.message));
})


app.get('/users', (req,res)=>{
    User.find({})
    .then(queryResult=> res.send(queryResult))
    .catch(error=> {res.status(500).send(error)})
})

app.get('/tasks', (req, res)=>{
    Task.find({})
    .then(queryResult=> res.send(queryResult))
    .catch(error=>res.status(400).send(error));
})

app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);
})