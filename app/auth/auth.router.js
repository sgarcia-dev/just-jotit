const express = require('express');
// To learn more about the jsonwebtoken standard, see:
// https://jwt.io/introduction/
const jwt = require('jsonwebtoken');

const { localPassportMiddleware, jwtPassportMiddleware } = require('../auth/auth.strategy');
const { JWT_SECRET, JWT_EXPIRY } = require('../config.js');

const authRouter = express.Router();

function createJwtToken(user) {
    return jwt.sign({ user }, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
}

authRouter.post('/login', localPassportMiddleware, (request, response) => {
    const jwtToken = createJwtToken(request.user.serialize());
    response.json({ jwtToken });
});

authRouter.post('/refresh', jwtPassportMiddleware, (request, response) => {
    const jwtToken = createJwtToken(request.user);
    response.json({ jwtToken });
});

module.exports = { authRouter };