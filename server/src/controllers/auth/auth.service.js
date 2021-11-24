const User = require('../../models/user.model');
const Token = require('../../models/token.model');

exports.findToken = async (refreshToken) => {
    try {
        await Token.findOne({ refreshToken })
    } catch (err) {
        console.error(err.message);
    }
}; 

exports.saveToken = (refreshToken) => Token.create({ refreshToken }); 
// exports.saveToken = async (refreshToken) => {
//     try {
//         await Token.create({ refreshToken });
//     } catch (err) {
//         console.error(err.message);
//     }
// }; 

exports.deleteToken = async (refreshToken) => {
    try {
        Token.deleteOne({ refreshToken })
    } catch (err) {
        console.error(err.message);
    }
}; 

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