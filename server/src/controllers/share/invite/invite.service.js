const Invite = require('../../../models/invitation.model');
const User = require('../../../models/user.model');

exports.create = requestData => {
    const entity = new Invite(requestData);
    return entity.save();
};

exports.findAll = () => Invite.find();

exports.findOne = id => Invite.findById(id);

exports.update = (id, updateData) => Invite.findByIdAndUpdate(id, updateData, { new: true });

exports.delete = id => Invite.findByIdAndRemove(id);