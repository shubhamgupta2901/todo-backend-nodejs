const jwt = require('jsonwebtoken');

/**
 * sign() function will generate a unique authentication token.
 * It takes two arguments, first is an object, second is a string,
 * the object contains the data that will be embedded in your token.
 * We store a unique identifier for the user : _id
 * the second argument is a secret, this is going to be used to sign the token.
 *  The token generated is made up of 3 different parts seperated by periods.Something like this:
 * iI1ZDhmNDBhNThmNjk4OWJjNjQzNzYwY2IiLCJpYXQiOjE1Njk2NzIxMDF9.ad4jboZyu7-AKi6WWNwbFsbIM6W2knoGdr2cFOMd1Bs
 * The first part is header it is a base 64 encoded string and contain meta information what kind of token it is, what algorithm was used to generate it etc.
 * The second part is payload/body. It is also a base 64 encoded string and this contains the data that we provided.
 * The third part is a signature and this is used to verify the token.
 * We can also customize the token with a third option with an object. 
 * Here we may want to change the algorithm to generate token or expire the token after certain number of days etc.
 * 
 * verify() takes two arguments: the token you are trying to verify, 
 * and the second is the secret used to sign the token.
 * verify returns the payload of the token
 */
const myFunction = async () => {
    const token = jwt.sign({_id: '5d8f40a58f6989bc643760cb' },'thisisplayground',{expiresIn: '0 seconds'});
    console.log(token);

    const data = jwt.verify(token, 'thisisplayground');
    console.log(data);

}

module.exports = myFunction;