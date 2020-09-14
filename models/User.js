const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const errorEmailRequired = 'An email address is required!';
const errorEmailInvalid = 'Your email address is not valid!';
const errorPasswordRequired = 'A password is required!';
const errorPasswordInvalid = 'Invalid password';
const errorPasswordLength = 'The minimum length for a password is 6 characters.';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, errorEmailRequired],
        unique: true,
        lowercase: true,
        validate: [isEmail, errorEmailInvalid]
    },
    password: {
        type: String,
        required: [true, errorPasswordRequired],
        minlength: [6, errorPasswordLength]
    }
});

// Hash the password before the User document gets added to the database
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Verify that the user email address and password are correct
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        }
        throw Error(errorPasswordInvalid);
    }
    throw Error(errorEmailInvalid);
}

const User = mongoose.model('user', userSchema);

module.exports = User;