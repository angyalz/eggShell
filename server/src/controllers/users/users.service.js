const User = require('../../models/user.model');

// export function create(user) {
//     const newUser = new User(user);
//     return newUser.save();
// }

exports.findAll = () => User.find().select({ _id: 0, userName: 1, email: 1 }); 

exports.findById = (id) => User.findById(id); 

exports.updateOne = (id, payload) => User.findByIdAndUpdate(id, payload, { new: true }).select({ password: 0 });