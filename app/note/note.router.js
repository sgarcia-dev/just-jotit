const express = require('express');
// https://www.npmjs.com/package/joi
const Joi = require('joi');
const noteRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Note, NoteJoiSchema } = require('./note.model.js');

// CREATE NEW NOTE
noteRouter.post('/', jwtPassportMiddleware, (request, response) => {
    // Remember, We can access the request body payload thanks to the express.json() middleware we used in server.js
    const newNote = {
        user: request.user.id,
        title: request.body.title,
        content: request.body.content,
        createDate: Date.now()
    };

    // Step 1: Validate new user information is correct.
    // Here, we use the Joi NPM library for easy validation
    // https://www.npmjs.com/package/joi
    const validation = Joi.validate(newNote, NoteJoiSchema);
    if (validation.error) {
        // Step 2A: If validation error is found, end the the request with a server error and error message.
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // Step 2B: Attempt to create a new note using Mongoose.Model.create
    // https://mongoosejs.com/docs/api.html#model_Model.create
    Note.create(newNote)
        .then(createdUser => {
            // Step 3A: Return the correct HTTP status code, and the note correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
        })
        .catch(error => {
            // Step 3B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE USER's NOTES
noteRouter.get('/', jwtPassportMiddleware, (request, response) => {
    // Step 1: Attempt to retrieve all notes using Mongoose.Model.find()
    // https://mongoosejs.com/docs/api.html#model_Model.find
    Note.find({ user: request.user.id })
        .populate('user')
        .then(notes => {
            // Step 2A: Return the correct HTTP status code, and the notes correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(
                notes.map(note => note.serialize())
            );
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE ALL NOTES
noteRouter.get('/all', (request, response) => {
    // Step 1: Attempt to retrieve all notes using Mongoose.Model.find()
    // https://mongoosejs.com/docs/api.html#model_Model.find
    Note.find()
        .populate('user')
        .then(notes => {
            // Step 2A: Return the correct HTTP status code, and the notes correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(
                notes.map(note => note.serialize())
            );
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});


// RETRIEVE ONE NOTE BY ID
noteRouter.get('/:noteid', (request, response) => {
    // Step 1: Attempt to retrieve the note using Mongoose.Model.findById()
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    Note.findById(request.params.noteid)
        .populate('user')
        .then(note => {
            // Step 2A: Return the correct HTTP status code, and the note correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(note.serialize());
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// UPDATE NOTE BY ID
noteRouter.put('/:noteid', jwtPassportMiddleware, (request, response) => {
    const noteUpdate = {
        title: request.body.title,
        content: request.body.content
    };
    // Step 1: Validate new user information is correct.
    // Here, we use the Joi NPM library for easy validation
    // https://www.npmjs.com/package/joi
    const validation = Joi.validate(noteUpdate, NoteJoiSchema);
    if (validation.error) {
        // Step 2A: If validation error is found, end the the request with a server error and error message.
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // Step 2B: Attempt to find the note, and update it using Mongoose.Model.findByIdAndUpdate()
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    Note.findByIdAndUpdate(request.params.noteid, noteUpdate)
        .then(() => {
            // Step 3A: Since the update was performed but no further data provided,
            // we just end the request with NO_CONTENT status code.
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            // Step 3B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE NOTE BY ID
noteRouter.delete('/:noteid', jwtPassportMiddleware, (request, response) => {
    // Step 1: Attempt to find the note by ID and delete it using Mongoose.Model.findByIdAndDelete()
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
    Note.findByIdAndDelete(request.params.noteid)
        .then(() => {
            // Step 2A: Since the deletion was performed but no further data provided,
            // we just end the request with NO_CONTENT status code.
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { noteRouter };