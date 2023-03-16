
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    roles: {
        type: Object,
        required: false
    },
    email: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);

/*
roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
*/