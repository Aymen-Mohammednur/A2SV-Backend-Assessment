const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxLength: 50,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minLength: 6,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
});

module.exports = mongoose.model('User', UserSchema);