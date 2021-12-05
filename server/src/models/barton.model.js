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
            species: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Poultry' },
            customName: { type: String },
            quantity: { type: Number, required: true },
            purchaseDate: { type: Date, default: Date.now },
            purchasePrice: { type: Number },
            ageAtPurchase: { type: Number}
        },
    ],
    feed: [
        {
            type: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Feed' },
            unit: { type: String, enum: ['kg', 'q'], default: 'kg', required: true },
            price: { type: Number, required: true },
            dateFrom: { type: Date, default: Date.now, required: true },
            dateTo: { type: Date, default: Date.now },
        }
    ],
    medicine: [
        {
            type: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Medicine' },
            price: { type: Number },
            dateFrom: { type: Date, default: Date.now },
            dateTo: { type: Date, default: Date.now },
        }
    ]

}, {

    timestamps: true

})

BartonSchema.plugin(idValidator);

module.exports = mongoose.model('Barton', BartonSchema, 'bartons');