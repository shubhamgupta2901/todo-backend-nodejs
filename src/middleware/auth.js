const jwt = require('jsonwebtoken');
const User = require('../models/user');


/**
 * Using express middleware to intercept requests before routing them.
 * Without middleware : new request -> run route handler
 * With middleware: new request -> do something -> run route handler
 * This needs be before all other app.use() calls
 */
const auth = async (request , response, next) => {
    try {
        const authToken = request.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(authToken,process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token':authToken});

        if(!user){
            throw new Error();
        }
        request.user = user;
        request.token = authToken;
        next();
    } catch (error) {
        response.status(401).send({error: 'Authentication failed'})
    }
}

module.exports = auth;