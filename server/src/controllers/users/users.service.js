const User = require('../../models/user.model');

// export function create(user) {
//     const newUser = new User(user);
//     return newUser.save();
// }

exports.findAll = async () => {
    try {
        await User.find().select({ _id: 0, userName: 1, email: 1 })
    } catch (err) {
        console.error(err.message);
    }
};

exports.findById = async (id) => {
    try {
        await User.findById(id)
    } catch (err) {
        console.error(err.message);
    }
};

exports.updateOne = async (id, payload) => {
    try {
        await User.findByIdAndUpdate(id, payload, { new: true }).select({ password: 0 })
    } catch (err) {
        console.error(err.message);
    }
};