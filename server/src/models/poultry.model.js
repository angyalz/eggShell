const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const PoultrySchema = new mongoose.Schema({

    species: { type: String, required: true },
    // breed: {},
    sex: { type: String, enum: ['hen', 'cock'], required: true },
    nameOfSex: { type: String, reqired: true }

}, {

    timestamps: true

})

PoultrySchema.plugin(idValidator);

module.exports = mongoose.model('Poultry', PoultrySchema, 'poultry');