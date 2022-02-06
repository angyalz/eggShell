const Request = require('../../../models/request.model');
const User = require('../../../models/user.model');

exports.create = async (requestData) => {
    try {
        console.log(requestData); // debug
        const user = await User.findById(requestData.targetUserId);
        console.log('user at request service: ', user); // debug
        user.pendingRequests.push(requestData.applicantId);
        return await user.save();
    } catch(err) {
        console.error(err)
    }
};

// exports.findAll = () => Request.find();

// exports.findOne = id => Request.findById(id);

// exports.update = (id, updateData) => Request.findByIdAndUpdate(id, updateData, { new: true });

exports.delete = id => {
    const user = User.find({'pendingRequests._id': ObjectId(id)});
    user.pendingRequest.id(id).remove();
    return user.save();
};