const userService = require('./users.service');
const logger = require('../../config/logger');
const createError = require('http-errors');


exports.getAllUsers = async (req, res, next) => {

    try {

        const userList = await userService.findAll();
        logger.info(`Send all of Users list with length:${userList.length}`);
        res.status(200);
        return res.json(userList);

    } catch (err) {

        logger.error(err);
        return next(new createError.InternalServerError('Could not send userList'));

    }
}

exports.getUserById = async (req, res, next) => {

    const id = req.params.id;
    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id:${id}`);

    try {

        const user = await userService.findById(id)

        if (!user) {
            return next(new createError.InternalServerError(`Could not send user by id:${id}`));
        }

        res.status(200);
        return res.json(user);


    } catch (err) {

        logger.error(err);

        if (err.kind === 'ObjectId') {
            return next(new createError.BadRequest(`Invalid ID: ${id}`));
        } else {
            return next(new createError.InternalServerError(`Could not send user by id:${id}`));
        }

    }
}