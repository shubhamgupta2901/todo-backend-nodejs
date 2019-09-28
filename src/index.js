const express = require('express');
require('./db/mongoose'); // By using require, we ensure that the file db/mongoose.js runs which will ensure that mongoose connects to database.
const UserRouter = require('./routers/user');
const TaskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

/**
 * Using express middleware to intercept requests before routing them.
 * Without middleware : new request -> run route handler
 * With middleware: new request -> do something -> run route handler
 * This needs be before all other app.use() calls
 */
app.use((request,response,next)=>{
    if(request.method === 'GET'){
        return response.status(401).send({error: 'Authentication failed.'})
    }
    next();
})

/**
 * When we set up this line, node will automatically parse the incoming json to an object so we can access it in our request
 */
app.use(express.json());

/**
 * route requests to respective route handlers
 */
app.use(UserRouter);
app.use(TaskRouter);

app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);
})
