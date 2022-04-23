const mongoose = require('mongoose');

const TokenModel = new mongoose.Schema({

        refreshToken: {
            type: String,
            required: true
        }
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Token', TokenModel);