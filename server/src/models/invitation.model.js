const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const InvitationSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    barton: { type: mongoose.Schema.Types.ObjectId, ref: 'Barton' },

}, {

    timestamps: true

})

InvitationSchema.plugin(idValidator);

module.exports = mongoose.model('Invitation', InvitationSchema, 'invitations');
module.exports = InvitationSchema;