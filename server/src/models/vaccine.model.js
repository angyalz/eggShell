const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const VaccineSchema = mongoose.Schema({

    name: { type: String, required: true, unique: true},


}, {

    timestamps: true

})

VaccineSchema.plugin(idValidator);

module.exports = mongoose.model('Vaccine', VaccineSchema, 'vaccine');