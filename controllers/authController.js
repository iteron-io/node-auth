const constants = require('../constants');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const errorEmailInvalid = 'Your email address is not valid!';
const errorEmailMatch = 'An account with that email address does not exist';
const errorPasswordInvalid = 'Invalid password';
const errorPasswordMatch = 'This password is incorrect';
const errorEmailExists = 'An account with that email already exists!';

const salt = 'ZGnFSTXwSE';
const maxAge = 3 * 24 * 60 * 60;

// Error message handling
const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors = {
        email: '',
        password: ''
    }

    // Login page error message for email address
    if (err.message === errorEmailInvalid) {
        errors.email = errorEmailMatch;
    }

    // Login page error message for password
    if (err.message === errorPasswordInvalid) {
        errors.password = errorPasswordMatch;
    }

    // Error code 11000 means the email already exists in the database
    if (err.code === 11000) {
        errors.email = errorEmailExists;
        return errors;
    }

    // Apply custom error messages from the model
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// Create a JSON Web Token
const createToken = (id) => {
    return jwt.sign({ id }, salt, {
        expiresIn: maxAge
    });
}

// GET - Signup
module.exports.signup_get = (req, res) => {
    res.render('signup', {
        title: constants.titleSignup
    });
}

// POST - Signup
module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.create({ email, password });

        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

// GET - Login
module.exports.login_get = (req, res) => {
    res.render('login', {
        title: constants.titleLogin
    });
}

// POST - Login
module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        // Apply a JSON Web Token to the user session
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);

        res.status(400).json({ errors });
    }
}

// GET - Logout
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}