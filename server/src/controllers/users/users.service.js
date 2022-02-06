const Model = require('../../models/user.model');


exports.create = async (requestData) => {

    try {
        const entity = new Model(requestData);
        return await entity.save();
    } catch (err) {
        console.error(err.message);
    }
};

exports.checkExists = async (requestData) => {

    try {
        // return await Model.exists(requestData);
        return await Model.find(requestData).select({ _id: 1}).lean()
    } catch (err) {
        console.error(err.message);
    }
};

exports.findAll = async () => {
    try {
        return await Model.find().select({ _id: 0, userName: 1, email: 1 })
    } catch (err) {
        console.error(err.message);
    }
};

exports.findById = async (id) => {
    try {
        return await Model.findById(id)
            .populate('pendingRequests.user', 'username avatarUrl')
            .populate('pendingInvitations.user', 'username avatarUrl')
            .populate('pendingInvitations.barton', 'bartonName');
    } catch (err) {
        console.error(err.message);
    }
};

exports.updatePartially = async (id, updateData) => {
    try {
        // const user = await Model.findById(id);
        // user.pendingRequests.push(updateData);
        // return await user.save();
        return await Model.findByIdAndUpdate(id, updateData, { upsert: true }).select({ password: 0 })
    } catch (err) {
        console.error(err.message);
    }
};

exports.update = async (id, updateData) => {
    try {
        return await Model.findByIdAndUpdate(id, updateData, { new: true }).select({ password: 0 })
    } catch (err) {
        console.error(err.message);
    }
};

exports.delete = async (id) => {
    try {
        return await Model.findByIdAndRemove(id)
    } catch (err) {
        console.error(err.message);
    }
};