const express = require('express');
// https://www.npmjs.com/package/joi
const Joi = require('joi');
const userRouter = express.Router();

const { User, UserJoiSchema } = require('./user.model.js');
const { HTTP_STATUS_CODES } = require('../config.js');

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
        // If validation errors are found, return server error and the error message
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // Step 2: Verify if the new user's email or username doesn't already exist in the database. 
    User.findOne({
        $or: [ // Mongoose $or operator: https://docs.mongodb.com/manual/reference/operator/query/or/ 
            { email: newUser.email },
            { username: newUser.username }
        ]
    }).then(user => {
        if (user) {
            // Step 3A: If user already exists, respond with an error.
            return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'A user with that username and/or email already exists.' });
        } else {
            // Step 3B: If the user doesn't exist, create the new user.
            User.create(newUser)
                .then(createdUser => {
                    // Step 4A: If created successfully, return the newly created user information 
                    return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
                })
                .catch(error => {
                    // Step 4B: if an error ocurred, respond with an error
                    return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
                });
        }
    });
});

// RETRIEVE USERS
userRouter.get('/', (request, response) => {
    User.find()
        .then(users => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                users.map(user => user.serialize())
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});
// RETRIEVE USERS
userRouter.get('/:userid', (request, response) => {
    User.find({ _id: request.params.userid })
        .then(users => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                users.map(user => user.serialize())
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { userRouter };