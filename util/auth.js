const {AuthenticationError} = require('apollo-server');

const jwt = require('jsonwebtoken');
const {secretKey} = require('../db');

module.exports = (context) => {
    //context contains an object with header
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //Bearer...
        const token = authHeader.split('Bearer ')[1];
        if(token)
        {
            try{
                const user = jwt.verify(token, secretKey);
                return user;
            }
            catch(err){
                throw new AuthenticationError('Invalid or expired token.');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]');
    }
    throw new Error('Authorization header must be provided');
}