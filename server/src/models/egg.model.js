const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const EggSchema = new mongoose.Schema({

    active: { type: Boolean, default: true },
    barton: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Barton' },
    eggs: [
        {
            qty: { type: Number, required: true },
            date: { type: Date, default: Date.now }, 
        }
    ],
    poultry: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Barton.poultry' },

}, {

    timestamps: true

})

BartonSchema.plugin(idValidator);

module.exports = mongoose.model('Egg', BartonSchema, 'eggs');