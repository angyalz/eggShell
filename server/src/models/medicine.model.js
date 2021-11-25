const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const MedicineSchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true},


}, {

    timestamps: true

})

MedicineSchema.plugin(idValidator);

module.exports = mongoose.model('Medicine', MedicineSchema, 'medicine');