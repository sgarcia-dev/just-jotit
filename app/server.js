// To learn more about the ExpressJS NPM module, see official docs
// https://expressjs.com/
const express = require('express');
// To learn more about the morgan NPM module, see official NPM docs
// https://www.npmjs.com/package/morgan 
const morgan = require('morgan');
// To learn more about the Passport NPM module, see official docs
// http://www.passportjs.org/docs/
const passport = require('passport');

const { HTTP_STATUS_CODES } = require('./constants');
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

function startServer(config) {
    const { port, db } = config;
    if (port === undefined || db === undefined) {
        console.error('❗ [ERROR] server.js > startServer() > missing config options: port, db ');
        return Promise.reject();
    }

    return new Promise((reject, resolve) => {
        // Step 1: Start Express server
        server = app.listen(port, () => {
            // Step 2A: Log success message to console and resolve promise.
            console.log(`🚀 [SUCCESS] server.js > startServer() > Express server listening on http://localhost:${port}`);
            resolve();
        }).on('error', err => {
            // Step 2B: If there was a problem starting the Express server, disconnect from MongoDB immediately, log error to console and reject promise.
            db.disconnect();
            console.error(err);
            reject(err);
        });
    });
}

function stopServer() {
    return new Promise((reject, resolve) => {
        server.close(err => {
            if (err) {
                // Step 1A: If an error ocurred while shutting down, print out the error to the console and resolve promise;
                console.error(err);
                return reject(err);
            } else {
                // Step 1B: If the server shutdown correctly, log a success message
                console.log('Express server stopped.');
                resolve();
            }
        });
    });
}