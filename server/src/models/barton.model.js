const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const BartonSchema = new mongoose.Schema({

    bartonName: { type: String },
    users: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
            role: { type: String, enum: ['owner', 'user'], default: 'owner', required: true }
        }
    ],
    poultry: [
        {
            breed: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Poultry' },
            quantity: { type: Number, required: true },
            purchase_date: { type: Date, default: Date.now },
            purchase_price: { type: Number },
        },
    ],
    feed: [
        {
            type: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Feed' },
            unit: { type: String, enum: ['kg', 'q'], default: 'kg', required: true },
            price: { type: Number, required: true },
            date_from: { type: Date, default: Date.now, required: true },
            date_to: { type: Date, default: Date.now },
        }
    ],
    vaccine: [
        {
            type: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Vaccine' },
            price: { type: Number },
            date_from: { type: Date, default: Date.now },
            date_to: { type: Date, default: Date.now },
        }
    ]

}, {

    timestamps: true

})

BartonSchema.plugin(idValidator);

module.exports = mongoose.model('Barton', BartonSchema, 'bartons');