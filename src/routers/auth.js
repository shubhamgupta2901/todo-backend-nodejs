const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = new express.Router();

router.post('/auth',async (request, response)=> {
    const {id, password} = request.body;
    if(!id || !password){
        response.status(401).send({error: "Missing id/ password."});
    }  
    try {
        const user = await User.findById(id);
        if(!user){
            return response.status(404).send({error: `User with id ${id} does not exist.`})
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return response.status(400).send({error: 'wrong password'});
        }
        response.status(200).send(user);

    } catch (error) {
        response.status(400).send({error: error.message});
    }
    
})

module.exports = router;