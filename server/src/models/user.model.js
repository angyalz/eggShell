const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const UserSchema = mongoose.Schema({

    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    barton: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Barton'
        }
    ]

}, {

    timestamps: true

})

UserSchema.plugin(idValidator);

module.exports = mongoose.model('User', UserSchema, 'users');