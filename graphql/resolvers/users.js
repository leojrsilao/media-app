const User = require('../../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secretKey} = require('../../db');
const {UserInputError} = require('apollo-server');
const {validateRegisterInputs, validateLoginInputs} = require('../../util/validators');

function createToken(user){
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    },secretKey, {expiresIn: '1h'});
}

module.exports = {
    Mutation:{
        async login(_, {username, password})
        {
            //validate of users logic
            const {errors, valid} = validateLoginInputs(username, password);
            const user = await User.findOne({username});
            
            if(!valid)
            {
                throw new UserInputError('Errors', {errors});
            }

            //doesn't exist 
            if(!user)            
            {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcrypt.compare(password, user.password)
            
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }
            const token = createToken(user);
            return {
                ...user._doc,
                id: user.id,
                token
            };
        },
        async register(
                _, 
                {registerInput: {username,email,password, confirmPw} }) 
                //args is register input, needs _ parent 
        {
            //**validate data of user such as empty fields

            const {valid, errors} = validateRegisterInputs(username, email, password, confirmPw);
            if(!valid)
            {
                throw new UserInputError('Errors', {errors});
            }

            //**validate email already exist / pw match / user doesnt exist / hash pw / create Auth token
            
            //checks if user's username to register exist in database already
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is taken.', {
                    errors:{
                        username: 'This username is taken.'

                    }
                })
            }
            

            //hashes the password of user and creates authtoken
            password = await bcrypt.hash(password, 12);
            
            const newUser = new User({
                email,
                username,
                password,
                created: new Date().toISOString() 

            });

            const result = await newUser.save();
            const token = createToken(result);
            return {
                ...result._doc,
                id: result.id,
                token
            };


        }
    }
};