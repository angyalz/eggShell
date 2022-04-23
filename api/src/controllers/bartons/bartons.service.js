const Model = require('../../models/barton.model');
const userService = require('../users/users.service');


exports.create = async (requestData) => {

    try {
        const entity = new Model(requestData);
        const user = await userService.findById(requestData.users[0].user);
        user.bartons.push(entity._id);
        const savedEntity = await entity.save();
        await user.save();
        return savedEntity;
    } catch (err) {
        console.error(err.message);
    }
};

exports.findAll = async (query) => {
    console.log('query at bartons service findAll: ', query); // debug
    try {
        return await Model.find(query)
        .populate('poultry.poultry')
        // .populate('feed.type')
        // .populate('medicine.type')
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
        const barton = await Model.findById(id);
        console.log('barton: ', barton);        // debug
        const user = await userService.findById(barton.users[0].user);
        console.log('user: ', user);        // debug
        const index = user.bartons.indexOf(id);
        user.bartons.splice(index, 1);
        await user.save();
        return await Model.findByIdAndRemove(id)
    } catch (err) {
        console.error(err.message);
    }
};