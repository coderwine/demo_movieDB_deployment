const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // columns for our document
    firstName: {
        type: String, // What datatype this is expecting.
        require: true, // default is false.
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true // duplicate emails will throw an error response.
    },
    password: {
        type: String,
        required: true
    }
});

// Need to export model
module.exports = mongoose.model('User', UserSchema);