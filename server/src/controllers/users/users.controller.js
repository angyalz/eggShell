const service = require('./users.service');
const logger = require('../../config/logger');
const createError = require('http-errors');
const Model = require('../../models/user.model');


exports.create = async (req, res, next) => {

    const validationErrors = new Model(req.body).validateSync();

    if (validationErrors) {
        return next(
            new createError.BadRequest(validationErrors)
        );
    }

    try {
        const entity = await service.create(req.body);
        logger.info(`User created: ${entity}`);
        res.status(201);
        return res.json(entity);
    } catch (err) {
        console.error(err.message);
        return new createError.InternalServerError('User could not save', err.message); // User?
    }

};

exports.checkExists = async (req, res, next) => {

    try {
        const response = await service.checkExists(req.body);
        logger.info(`User check is exists: ${req.body} ${response}`);
        console.log(`User check is exists: ${req.body} ${response}`);   // debug
        res.status(200);
        return res.json(response);
    } catch (err) {
        console.error(err.message);
        return new createError.InternalServerError('User check failed', err.message); // User?
    }

};


exports.findAll = async (req, res, next) => {

    try {

        const entityList = await service.findAll();
        logger.info(`Send all of Users list with length:${entityList.length}`);
        res.status(200);
        return res.json(entityList);

    } catch (err) {

        logger.error(err);
        return next(new createError.InternalServerError('Could not send userList'));

    }
};

exports.findOne = async (req, res, next) => {

    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id:${req.params.id}`);

    try {

        const entity = await service.findById(req.params.id)

        if (!entity) {
            return next(new createError.NotFound(`Could not send user by id:${req.params.id}`));
        }

        res.status(200);
        return res.json(entity);


    } catch (err) {

        logger.error(err);

        if (err.kind === 'ObjectId') {
            return next(new createError.BadRequest(`Invalid ID: ${req.params.id}`));
        } else {
            return next(new createError.InternalServerError(`Could not send user by id:${req.params.id}`));
        }

    }
};

exports.setConnectRequest = async (req, res, next) => {

    try {
        const entity = await service.setConnectRequest(req.params.id, req.body)
        return res.json(entity);
    } catch (err) {
        console.error(err)
        return next(new createError.InternalServerError('Could not update user'));
    }

};

exports.update = async (req, res, next) => {

    const validationErrors = new Model(req.body).validateSync();

    if (validationErrors) {
        return next(
            new createError.BadRequest(validationErrors)
        );
    }

    try {
        const entity = await service.update(req.params.id, req.body)
        return res.json(entity);
    } catch (err) {
        console.error(err)
        return next(new createError.InternalServerError('Could not update user'));
    }

};

exports.delete = async (req, res, next) => {

    try {
        const entity = service.delete(req.params.id);
        return res.json({})
    } catch (err) {
        console.error(err);
        return next(new createError.InternalServerError('Could not delete user'));
    }

};