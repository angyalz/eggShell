const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const EggSchema = new mongoose.Schema({

    qty: { type: Number, required: true },
    date: { type: Date, default: Date.now },

}, {

    timestamps: true

})

const EggListSchema = new mongoose.Schema({

    active: { type: Boolean, default: true },
    barton: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Barton' },
    eggs: [ EggSchema ],
    poultry: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Barton.poultry' },

}, {

    timestamps: true

})

EggListSchema.plugin(idValidator);
EggSchema.plugin(idValidator);

module.exports = mongoose.model('EggList', EggListSchema, 'egglists');
module.exports = mongoose.model('Egg', EggSchema, 'eggs');
