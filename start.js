const config = require('./app/config');
const db = require('./app/db');
const { startServer } = require('./app/server');

(async () => {
    try {
        await db.connect({
            mongoUrl: config.MONGO_URL
        });
        await startServer({
            port: config.PORT,
            db
        });
    } catch (err) {
        console.log(err);
    }
})();