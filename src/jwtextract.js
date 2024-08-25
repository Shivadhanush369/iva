const jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

async function returnUsername(token) {
    console.log("inside functoion  "+ JSON.stringify(token));
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject(new Error('No token provided'));
        }

        // Verify the token
        jwt.verify(token,secretKey, (err, decoded) => { // Replace 'your-secret-key' with your actual secret key
            if (err) {
                return reject(new Error('Token is not valid'+err));
            }
            console.log("in jwt extract "+JSON.stringify(decoded));
            resolve(decoded);
        });
    });
}

module.exports = returnUsername;