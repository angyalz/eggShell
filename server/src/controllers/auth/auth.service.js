const User = require('../../models/user.model');
const Token = require('../../models/token.model');

exports.findToken = async (refreshToken) => {
    try {
        return await Token.findOne({ refreshToken })
    } catch (err) {
        console.error(err.message);
    }
}; 

// exports.saveToken = (refreshToken) => Token.create({ refreshToken }); 
exports.saveToken = async (refreshToken) => {
    try {
        return await Token.create({ refreshToken });
    } catch (err) {
        console.error(err.message);
    }
}; 

exports.deleteToken = async (refreshToken) => {
    try {
        return await Token.deleteOne({ refreshToken });
    } catch (err) {
        console.error(err.message);
    }
}; 

exports.create = async (userData) => {
    try {
        // const newUser = new User(userData);
        // return await newUser.save();
        return await new User(userData).save();
    } catch (err) {
        console.error(err.message);
    }
}

exports.findUser = async (query) => {
    try {
        return await User.findOne(query);
    } catch (err) {
        console.error(err.message);
    }
}