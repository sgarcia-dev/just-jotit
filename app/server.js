// To learn more about the ExpressJS NPM module, see official docs
// https://expressjs.com/
const express = require('express');
// To learn more about the morgan NPM module, see official NPM docs
// https://www.npmjs.com/package/morgan 
const morgan = require('morgan');
// To learn more about the Mongoose NPM module, see official docs
// https://mongoosejs.com/docs/guide.html
const mongoose = require('mongoose');
// To learn more about the Passport NPM module, see official docs
// http://www.passportjs.org/docs/
const passport = require('passport');

const { PORT, HTTP_STATUS_CODES, MONGO_URL, TEST_MONGO_URL } = require('./config');
const { authRouter } = require('./auth/auth.router');
const { userRouter } = require('./user/user.router');
const { noteRouter } = require('./note/note.router');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');

let server;
const app = express(); // Initialize express server
passport.use(localStrategy); // Configure Passport to use our localStrategy when receiving Username + Password combinations
passport.use(jwtStrategy); // Configure Passport to use our jwtStrategy when receving JSON Web Tokens

// MIDDLEWARE
app.use(morgan('combined')); // Allows morgan to intercept and log all HTTP requests to the console
app.use(express.json()); // Required so AJAX request JSON data payload can be parsed and saved into request.body
app.use(express.static('./public')); // Intercepts all HTTP requests that match files inside /public
// ROUTER SETUP
app.use('/api/auth', authRouter); // Redirects all calls to /api/user to userRouter.
app.use('/api/user', userRouter); // Redirects all calls to /api/user to userRouter.
app.use('/api/note', noteRouter); // Redirects all calls to /api/note to noteRouter.

// In case we make a HTTP request that is unhandled by our Express server, we return a 404 status code and the message "Not Found."
app.use('*', function (req, res) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Not Found.' });
});

module.exports = {
    app,
    startServer,
    stopServer
};

function startServer(testEnv) {
    // Remember, because the process of starting/stopping a server takes time, it's preferrable to make
    // this asynchronous, and return a promise that'll reject/resolve depending if the process is succesful.

    return new Promise((resolve, reject) => {
        let mongoUrl;

        if (testEnv) {
            mongoUrl = TEST_MONGO_URL;
        } else {
            mongoUrl = MONGO_URL;
        }
        // Step 1: Attempt to connect to MongoDB with mongoose
        mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
            if (err) {
                // Step 2A: If there is an error starting mongo, log error, reject promise and stop code execution.
                console.error(err);
                return reject(err);
            } else {
                // Step 2B: Start Express server
                server = app.listen(PORT, () => {
                    // Step 3A: Log success message to console and resolve promise.
                    console.log(`Express server listening on http://localhost:${PORT}`);
                    resolve();
                }).on('error', err => {
                    // Step 3B: If there was a problem starting the Express server, disconnect from MongoDB immediately, log error to console and reject promise.
                    mongoose.disconnect();
                    console.error(err);
                    reject(err);
                });
            }
        });
    });
}

function stopServer() {
    // Remember, because the process of starting/stopping a server takes time, it's preferrable to make
    // this asynchronous, and return a promise that'll reject/resolve depending if the process is succesful.

    // Step 1: Disconnect from the MongoDB database using Mongoose
    return mongoose
        .disconnect()
        .then(() => new Promise((resolve, reject) => {
            // Step 2: Shut down the ExpressJS server
            server.close(err => {
                if (err) {
                    // Step 3A: If an error ocurred while shutting down, print out the error to the console and resolve promise;
                    console.error(err);
                    return reject(err);
                } else {
                    // Step 3B: If the server shutdown correctly, log a success message.
                    console.log('Express server stopped.');
                    resolve();
                }
            });
        }));
}