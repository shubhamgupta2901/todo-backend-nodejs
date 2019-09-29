const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post('/users', async (request, response)=> {
    const user = new User(request.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        response.status(201).send({token, user});
    } catch (error) {
        response.status(400).send({error : error.message});
    } 
});


/**
 * Note that while the method findByCredentials() is written as a static function in the schema, and is accessible through the model: User.findByCredentials() 
 * But for generateAuthToken() we are trying to generate a token for a very specific user, so we set it up on the user instance. 
 * and is accessible via Model instance i.e. document: user.generateAuthToken()
 */
router.post('/users/login', async (request, response)=> {
    const {email, password} = request.body; 
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        response.status(200).send({token,user});
    } catch (error) {
        console.log(error);
        response.status(400).send({error: error});
    }
})

/** 
 * To add express middleware to an individual route, we pass it in to the method (get in this case)
 * before passing in the route handler.
 * Now when someone makes a get request to /users, it is first going to run our middleware function, 
 * then when next() is called in the middleware, our route handler will run.
 */
router.get('/users',auth,async (request, response)=>{
    try {
        const users = await User.find({});
        const trimmedUsers = users.map(user=> ({
            name: user.name, 
            age: user.age
        }));
        response.status(200).send(trimmedUsers);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.get('/users/:id', async (request, response)=> {
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

router.patch('/users/:id',async (request, response)=>{
    const allowedUpdateFields = ['name', 'email', 'password', 'age'];
    const requestedUpdateFields = Object.keys(request.body);

    requestedUpdateFields.forEach(field => {
        if(!allowedUpdateFields.includes(field))
            response.status(400).send({error: `Either Users do not have ${field} field or it can not be updated`});
    })

    const _id = request.params.id;
    try {
        //the findByIdAndUpdate bypasses mongoose and performs operation directly on mongodb database, because of this our middleware for hashing password does not run
        //const user = await User.findByIdAndUpdate(_id,request.body,{new: true, runValidators: true});
        const user = await User.findById(_id);
        if(!user){
            return response.status(404).send({error: 'User does not exist'})
        }
        requestedUpdateFields.forEach(field => {
            user[field] = request.body[field];
        })
        await user.save();
        response.status(200).send(user);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})

router.delete('/users/:id', async (request, response)=>{
    const _id = request.params.id;
    try {
        const res = await User.deleteOne({_id});
        if(res.ok === 0)
            return response.status(400).send({error: "Could not perform delete."})
        else if(res.deletedCount === 0)
            return response.status(400).send({error: `User with id: ${_id} does not exist.`})
        response.status(200).send(res);
    } catch (error) {
        response.status(400).send({error: error.message});
    }
})


module.exports = router;