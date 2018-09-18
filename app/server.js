// https://expressjs.com/
const express = require('express');
// https://www.npmjs.com/package/morgan 
const morgan = require('morgan');
// https://mongoosejs.com/docs/guide.html
const mongoose = require('mongoose');

const { PORT, HTTP_STATUS_CODES, MONGO_URL } = require('./config');
const { userRouter } = require('./user/user.router');
const { noteRouter } = require('./note/note.router');

let server;
const app = express(); // Initialize express server

// MIDDLEWARE
app.use(morgan('combined')); // Allows morgan to intercept and log all HTTP requests to the console
app.use(express.json()); // Required so AJAX request JSON data payload can be parsed and saved into request.body
app.use(express.static('./public')); // Intercepts all HTTP requests that match files inside /public
// ROUTER SETUP
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

function startServer() {
    return new Promise((resolve, reject) => { // returning a promise is essential
        // Step 1: Connect to MongoDB with mongoose
        mongoose.connect(MONGO_URL, { useNewUrlParser: true }, err => {
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
    return mongoose
        .disconnect()
        .then(() => new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    console.error(err);
                    return reject(err);
                } else {
                    console.log('Express server stopped.');
                    resolve();
                }
            });
        }));
}