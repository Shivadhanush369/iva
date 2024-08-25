
    // jwtMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'secretKey';


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token;
        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                return res.status(403).json({ result: 'Token is invalid or expired' });
            }
            req.authData = authData;
            next();
        });
    } else {
        res.status(403).json({ result: 'Token is not provided' });
    }
}

module.exports = verifyToken;
