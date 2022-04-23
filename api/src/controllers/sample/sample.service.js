const Model = require('../../models/user.model');

exports.create = requestData => {
    const entity = new Model(requestData);
    return entity.save();
};

exports.findAll = () => Model.find();

exports.findOne = id => Model.findById(id);

exports.update = (id, updateData) => Model.findByIdAndUpdate(id, updateData, { new: true });

exports.delete = id => Model.findByIdAndRemove(id);