const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Room = new schema({
    room_num: {
        type: String,
        unique: true,
        required: true
    },
    room_type: {
        type: String,
        required: true
    },
    bed: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('room', Room);