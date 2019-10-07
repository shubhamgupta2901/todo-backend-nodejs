const path = require('path');
const express = require('express');
require('./db/mongoose'); // By using require, we ensure that the file db/mongoose.js runs which will ensure that mongoose connects to database.
const UserRouter = require('./routers/user');
const TaskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

/**
 * When we set up this line, node will automatically parse the incoming json to an object so we can access it in our request
 */
app.use(express.json());
const publicDirectoryPath = path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

/**
 * route requests to respective route handlers
 */
app.use(UserRouter);
app.use(TaskRouter);

app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);
})