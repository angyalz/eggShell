const User = require('../../models/user.model');
const Token = require('../../models/token.model');

exports.findToken = (refreshToken) => Token.findOne({ refreshToken }); 

exports.saveToken = (refreshToken) => Token.create({ refreshToken }); 

exports.deleteToken = (refreshToken) => Token.deleteOne({ refreshToken }); 

exports.create = async (userData) => {
    try {
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        return savedUser;
    } catch (err) {
        console.error(err.message);
    }
}

exports.findUser = async (query) => {
    try {
        const user = await User.findOne(query);
        return user;
    } catch (err) {
        console.error(err.message);
    }
}