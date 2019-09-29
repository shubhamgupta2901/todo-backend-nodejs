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
        response.status(400).send({error: error.message});
    }
})

/** 
 * To add express middleware to an individual route, we pass it in to the method (get in this case)
 * before passing in the route handler.
 * Now when someone makes a get request to /users, it is first going to run our middleware function, 
 * then when next() is called in the middleware, our route handler will run.
 */
router.post('/users/logout',auth, async (request, response)=>{
    try {
        const user = request.user;
        const updatedTokens = user.tokens.filter(token => token.token !== request.token);
        user.tokens = updatedTokens;
        await user.save();
        response.status(200).send({'message': 'successfully logged out!'})
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})
/**
 * Logout from all sesions. Wipes out the tokens array in User collection
 */
router.post('/users/logoutAll', auth, async (request, response)=> {
    try {
        const user = request.user;
        user.tokens = [];
        await user.save();
        response.status(200).send({'message': 'logged out from all sessions'});
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.get('/users/me',auth,async (request, response)=>{
    try {
        const{ name, age, email} = request.user;
        const loggedInUser = {name, age, email}
        response.status(200).send(loggedInUser);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.patch('/users/me',auth,async (request, response)=>{
    const allowedUpdateFields = ['name', 'email', 'password', 'age'];
    const requestedUpdateFields = Object.keys(request.body);

    requestedUpdateFields.forEach(field => {
        if(!allowedUpdateFields.includes(field))
            response.status(400).send({error: `Either Users do not have ${field} field or it can not be updated`});
    })
    try {
        const user = request.user;
        requestedUpdateFields.forEach(field => {
            user[field] = request.body[field];
        })
        await user.save();
        response.status(200).send(user);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.delete('/users/me',auth, async (request, response)=>{
    try {
        await request.user.remove();
        response.status(200).send(request.user);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})


module.exports = router;