const express = require('express');
// https://www.npmjs.com/package/joi
const Joi = require('joi');
const noteRouter = express.Router();

const { Note, NoteJoiSchema } = require('./note.model.js');
const { HTTP_STATUS_CODES } = require('../config.js');

// CREATE NEW NOTE
noteRouter.post('/', (request, response) => {
    // Remember, We can access the request body payload thanks to the express.json() middleware we used in server.js
    const newNote = {
        title: request.body.title,
        content: request.body.content,
        createDate: Date.now()
    };

    const validation = Joi.validate(newNote, NoteJoiSchema);
    if (validation.error) {
        // If validation errors are found, return server error and the error message
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }

    // https://mongoosejs.com/docs/api.html#model_Model.create
    Note.create(newNote)
        .then(createdUser => {
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE NOTES
noteRouter.get('/', (request, response) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    Note.find()
        .then(notes => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                notes.map(note => note.serialize())
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE ONE NOTE BY ID
noteRouter.get('/:noteid', (request, response) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    Note.findById(request.params.noteid)
        .then(note => {
            return response.status(HTTP_STATUS_CODES.OK).json(note.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE NOTE BY ID
noteRouter.put('/:noteid', (request, response) => {
    const noteUpdate = {
        title: request.body.title,
        content: request.body.content
    };

    const validation = Joi.validate(noteUpdate, NoteJoiSchema);
    if (validation.error) {
        // If validation errors are found, return server error and the error message
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }

    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    Note.findByIdAndUpdate(request.params.noteid, noteUpdate)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE NOTE BY ID
noteRouter.delete('/:noteid', (request, response) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
    Note.findByIdAndDelete(request.params.noteid)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { noteRouter };