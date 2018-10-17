const express = require('express');
// To learn more about the Joi NPM module, see official docs
// https://www.npmjs.com/package/joi
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config.js');
const { User, UserJoiSchema } = require('./user.model.js');

const userRouter = express.Router();

// CREATE NEW USER
userRouter.post('/', (request, response) => {
    // Remember, We can access the request body payload thanks to the express.json() middleware we used in server.js
    const newUser = {
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password
    };

    // Step 1: Validate new user information is correct.
    // Here, we use the Joi NPM library for easy validation
    // https://www.npmjs.com/package/joi
    const validation = Joi.validate(newUser, UserJoiSchema);
    if (validation.error) {
        // Step 2A: If validation error is found, end the the request with a server error and error message.
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // Step 2B: Verify if the new user's email or username doesn't already exist in the database using Mongoose.Model.findOne() 
    // https://mongoosejs.com/docs/api.html#model_Model.findOne
    User.findOne({
        // Mongoose $or operator: https://docs.mongodb.com/manual/reference/operator/query/or/ 
        $or: [
            { email: newUser.email },
            { username: newUser.username }
        ]
    }).then(user => {
        if (user) {
            // Step 3A: If user already exists, abruptly end the request with an error.
            return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Database Error: A user with that username and/or email already exists.' });
        }
        // Step 3B: We should NEVER store raw passwords, so instead we wait while we encrypt it into a hash. 
        return User.hashPassword(newUser.password);
    }).then(passwordHash => {
        newUser.password = passwordHash;
        // Step 4: Once password hash has replaced the raw password, we attempt to create the new user using Mongoose.Model.create()
        // https://mongoosejs.com/docs/api.html#model_Model.create
        User.create(newUser)
            .then(createdUser => {
                // Step 5A: If created successfully, return the newly created user information 
                return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
            })
            .catch(error => {
                // Step 5B: if an error ocurred, respond with an error
                console.error(error);
                return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error.message
                });
            });
    });
});

// RETRIEVE USERS
userRouter.get('/', (request, response) => {
    // Step 1: Attempt to retrieve all users from the database using Mongoose.Model.find()
    // https://mongoosejs.com/docs/api.html#model_Model.find
    User.find()
        .then(users => {
            // Step 2A: Return the correct HTTP status code, and the users correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(
                users.map(user => user.serialize())
            );
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});
// RETRIEVE ONE USER
userRouter.get('/:userid', (request, response) => {
    // Step 1: Attempt to retrieve a specific user using Mongoose.Model.findById()
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    User.findById(request.params.userid)
        .then(user => {
            // Step 2A: Return the correct HTTP status code, and the user correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(user.serialize());
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { userRouter };