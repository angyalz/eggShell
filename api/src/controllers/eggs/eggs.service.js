const Model = require('../../models/egg.model');


exports.create = async (requestData) => {

    try {
        const entity = new Model(requestData);
        return await entity.save();
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