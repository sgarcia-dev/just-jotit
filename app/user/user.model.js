const mongoose = require('mongoose');
// To learn more about the Joi NPM module, see official docs
// https://www.npmjs.com/package/joi
const Joi = require('joi');
// To learn more about the bcrypt NPM module, see official docs
// https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');

// Each Mongoose schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

// Here we define a Mongoose instance methods, to learn more about them, see:
// https://mongoosejs.com/docs/guide.html#methods
userSchema.methods.serialize = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        username: this.username,
    };
};

// You should NEVER store a password directly out of security concerns.
// Instead, you should always "hash" it before storage. To learn more about hashing, see:
// https://security.blogoverflow.com/2013/09/about-secure-password-hashing/
userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

// Since we don't ever store the user's raw password and instead store the hash,
// we can validate it by running it into the same hashing algorithm and comparing the results.
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// To validate that data used to create a new user is valid, we will use "Joi", a NPM library that
// allows you to create "blueprints" or "schemas" to ensure validation of key information. To learn more:
// https://www.npmjs.com/package/joi
const UserJoiSchema = Joi.object().keys({
    // To learn more about Joi string validations, see:
    // https://github.com/hapijs/joi/blob/v13.6.0/API.md#string---inherits-from-any
    name: Joi.string().min(1).trim().required(),
    username: Joi.string().alphanum().min(4).max(30).trim().required(),
    password: Joi.string().min(8).max(30).trim().required(),
    email: Joi.string().email().trim().required()
});

// To learn more about how Mongoose schemas and models are created, see:
// https://mongoosejs.com/docs/guide.html
const User = mongoose.model('user', userSchema);
// To learn more about Mongoose Models vs Schemas, see:
// https://stackoverflow.com/questions/9127174/why-does-mongoose-have-both-schemas-and-models
module.exports = { User, UserJoiSchema };