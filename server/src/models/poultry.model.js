const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const PoultrySchema = mongoose.Schema({

    name: { type: String, required: true },
    sex: { type: String, enum: ['male', 'female'], required: true }

}, {

    timestamps: true

})

PoultrySchema.plugin(idValidator);

module.exports = mongoose.model('Poultry', PoultrySchema, 'poultry');