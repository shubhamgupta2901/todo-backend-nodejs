const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
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
        response.status(200).send(request.user);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
})

router.patch('/users/me',auth,async (request, response)=>{
    const allowedUpdateFields = ['name', 'email', 'password', 'age'];
    const requestedUpdateFields = Object.keys(request.body);
    const isValidOperation = requestedUpdateFields.every(field=> allowedUpdateFields.includes(field));

    if(!isValidOperation)
        return response.status(400).send({error: 'Invalid updates'});

    //BUG: When validating operation this way, even after returning response, the execution of method continues and updates the user.
    // requestedUpdateFields.forEach(field => {
    //     if(!allowedUpdateFields.includes(field))
    //         return response.status(400).send({error: `Either Users do not have ${field} field or it can not be updated`});
    // })
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
});

router.delete('/users/me',auth, async (request, response)=>{
    try {
        await request.user.remove();
        response.status(200).send(request.user);
    } catch (error) {
        response.status(500).send({error: error.message});
    }
});

const acceptedExtensions = ['jpg', 'png', 'jpeg'];
const upload = multer({
    limits: {
        fileSize: 1*1024*1024, // takes size in byte. 1MB
    },
    fileFilter: (request, file,callback) =>{
        isValidExtenstion = acceptedExtensions.some(extension=> file.originalname.endsWith(`.${extension}`));
        if(isValidExtenstion)
            return callback(null, true);
        return callback(new Error(`Only ${acceptedExtensions.join(', ')} are allowed.`));
    }
});

/**
 * Note we are passing the auth middleware before the multer middleware. 
 * Auth middleware checks weather the auth token is valid. 
 * Only after that we worry about upload operation, so we use multer middleware after this.
 * Multer middleware checks weather the file size and file extension are valid.
 * argument passed to upload.single is the name of key that user uses to upload file
 * request.body.key
 * 
 * The last function written is to catch the error thrown by multer middleware functions and send response to user.
 * Its imperative that we specify all four arguments.
 */
router.post('/users/me/avatar',auth,upload.single('avatar'),async (request,response)=>{
    try {
        const buffer = await sharp(request.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
        const user = request.user;
        user.avatar = buffer;
        await user.save();
        response.status(200).send(user);
    } catch (error) {
        return response.status(400).send({error: error.message});
    }
},(error, request, response, next)=> {
    response.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async (request, response)=> {
    try {
        const user = request.user;
        user.avatar = undefined;
        await user.save();
        response.status(200).send({message: 'Successfully deleted image.'});
    } catch (error) {
        response.status(400).send({error: error.message});
    }
});

router.get('/users/:id/avatar',async (request, response)=>{
    try {
        const user = await User.findById(request.params.id);
        if(!user || !user.avatar){
            throw new Error('Either the avatar is not present or invalid user id.')
        }
        response.set('Content-Type','image/png');
        response.send(user.avatar);
    } catch (error) {
        response.status(404).send({error: error.message})
    }
});


module.exports = router;