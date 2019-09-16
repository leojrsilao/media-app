const {model, Schema} = require('mongoose');

//mongoose layer
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    created: String,  
});

module.exports = model('users', userSchema);
