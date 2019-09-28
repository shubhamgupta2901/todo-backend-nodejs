const express = require('express');
const User = require('../models/user');
const router = new express.Router();


router.post('/users', async (request, response)=> {
    const user = new User(request.body);
    try {
        const userResponse = await user.save();
        response.status(201).send(userResponse);
    } catch (error) {
        response.status(400).send({error : error.message});
    } 
});

router.get('/users',async (request, response)=>{
    try {
        const users = await User.find({});
        response.status(200).send(users);
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