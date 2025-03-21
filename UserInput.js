const mongoose = require('mongoose');

const userInputSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserInput', userInputSchema); 