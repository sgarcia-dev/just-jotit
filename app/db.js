const mongoose = require('mongoose');

module.exports = {
    connect,
    disconnect
};

function connect(options) {
    const { mongoUrl } = options;
    return new Promise((resolve, reject) => {
        // Step 1: Attempt to connect to MongoDB with mongoose
        mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
            if (err) {
                // Step 2A: If there is an error starting mongo, log error, reject promise and stop code execution.
                console.error('❗ [ERROR] db.js > connect() > ', err);
                return reject(err);
            } else {
                console.log(`📚 [SUCCESS] db.js > connect() > Mongoose connected succesfully to ${mongoUrl}`);
                resolve();
            }
        });
    });
}

function disconnect() {
    return mongoose.disconnect();
}