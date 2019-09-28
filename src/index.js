const express = require('express');
require('./db/mongoose'); // By using require, we ensure that the file db/mongoose.js runs which will ensure that mongoose connects to database.
const UserRouter = require('./routers/user');
const TaskRouter = require('./routers/task');
const AuthRouter = require('./routers/auth');
const brcypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

//When we set up this line, node will automatically parse the 
//incoming json to an object so we can access it in our request
app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);
app.use(AuthRouter);

// app.get('/test/:plainPassword', async (request,response)=>{
//     const enteredPassword = request.params.plainPassword;
//     const saltRounds = 8;
//     const hashedPassword = await brcypt.hash(password,saltRounds);
//     response.send({hashedPassword});
// })
app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);
})

// const myFunction = async (password) => {
//     const storedHashPassword = '$2b$08$UekCDU4PkAMCdfGZcaw0k.guG6pKh5e3rth1EspeW5ZKb9SHYikwe';
//     const isSame = await brcypt.compare(password,storedHashPassword);
//     console.log(isSame);
// }
// myFunction('abcd123');

