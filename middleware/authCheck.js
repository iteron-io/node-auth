const jwt = require('jsonwebtoken');

const salt = 'ZGnFSTXwSE';

// Validate and check the user session
const authCheck = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, salt, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                next();
            }
        });
    }
    else {
        res.redirect('/login');
    }
}

module.exports = { authCheck };