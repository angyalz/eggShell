const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const createError = require('http-errors');

const RequestSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

}, {

    timestamps: true

})

RequestSchema.plugin(idValidator);
RequestSchema.pre('save', function (next) {
    if ({} == this.user) {
        return next(new createError.BadRequest('Parameter is missing'));
    }
    next();
});

// module.exports = mongoose.model('Request', RequestSchema, 'requests');
module.exports = RequestSchema;
