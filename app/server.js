// https://www.npmjs.com/package/express
const express = require('express');
// https://www.npmjs.com/package/morgan 
const morgan = require('morgan');

const { PORT, HTTP_STATUS_CODES } = require('./config');

let server;
const app = express(); // Initialize express server

// MIDDLEWARE
app.use(morgan()); // Allows morgan to intercept and log all HTTP requests to the console
app.use(express.static('./public')); // Intercepts all HTTP requests that match files inside /public

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
    return new Promise((resolve, reject) => {
        server = app.listen(PORT, () => {
            console.log(`Express server listening on http://localhost:${PORT}`);
            resolve();
        }).on('error', err => {
            console.error(err);
            reject(err);
        });
    });
}

function stopServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                console.log('Express server stopped.');
                resolve();
            }
        });
    });
}