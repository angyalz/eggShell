const Request = require('../../../models/request.model');
const User = require('../../../models/user.model');
const Barton = require('../../../models/barton.model');

exports.create = async (id, requestData) => {
    try {
        const user = await User.findById(id);
        await user.pendingRequests.push({ user: requestData });
        return await user.save();
    } catch(err) {
        console.error(err);
        return err;
    }
};

// exports.findAll = () => Request.find();

// exports.findOne = id => Request.findById(id);

exports.acceptRequest = async (targetUserId, bartonId, role) => {
    try {
        const barton = await Barton.findById(bartonId);
        await barton.users.push({ user: targetUserId, role: role });
        const savedBarton = await barton.save();
        const targetUser = await User.findById(targetUserId);
        await targetUser.bartons.push(bartonId);
        await targetUser.save();
        return {barton: savedBarton};
    } catch (err) {
        console.error(err);
        return err;
    }
};

exports.delete = async (requestId) => {
    try {
        const user = await User.findOne({ 'pendingRequests._id': requestId });
        await user.pendingRequests.remove({ _id: requestId });
        return await user.save();
    } catch (err) {
        console.error(err);
        return err;
    }
};