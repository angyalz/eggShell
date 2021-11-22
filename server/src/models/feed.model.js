const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const FeedSchema = mongoose.Schema({

    name: { type: String, required: true, unique: true },
    // weight: { type: Number, required: true },
    // unit: { type: String, enum: ['kg', 'q'], default: 'kg', required: true }


}, {

    timestamps: true

})

FeedSchema.plugin(idValidator);

module.exports = mongoose.model('Feed', FeedSchema, 'feed');