const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const RequestSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },

}, {

    timestamps: true

})

RequestSchema.plugin(idValidator);

module.exports = mongoose.model('Request', RequestSchema, 'requests');
module.exports = RequestSchema;
