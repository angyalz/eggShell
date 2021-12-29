const service = require('./bartons.service');
const logger = require('../../config/logger');
const createError = require('http-errors');
const Model = require('../../models/barton.model');


exports.create = async (req, res, next) => {

    const validationErrors = new Model(req.body).validateSync();

    if (validationErrors) {
        return next(
            new createError.BadRequest(validationErrors)
        );
    }

    try {
        const entity = await service.create(req.body);
        logger.info(`Barton created: ${entity}`);
        res.status(201);
        return res.json(entity);
    } catch (err) {
        console.error(err.message);
        return new createError.InternalServerError('Barton could not save', err.message); 
    }

};


exports.findAll = async (req, res, next) => {

    try {

        const entityList = await service.findAll(req.query);

        console.log('EntityList at barton controller findAll: ', entityList);       // debug

        logger.info(`Send all of Bartons list with length:${entityList.length}`);
        res.status(200);
        return res.json(entityList);

    } catch (err) {

        logger.error(err);
        return next(new createError.InternalServerError('Could not send bartonlist'));

    }
};

exports.findOne = async (req, res, next) => {

    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id:${req.params.id}`);

    try {

        const entity = await service.findById(req.params.id)

        if (!entity) {
            return next(new createError.NotFound(`Could not send barton by id:${req.params.id}`));
        }

        res.status(200);
        return res.json(entity);


    } catch (err) {

        logger.error(err);

        if (err.kind === 'ObjectId') {
            return next(new createError.BadRequest(`Invalid ID: ${req.params.id}`));
        } else {
            return next(new createError.InternalServerError(`Could not send barton by id:${req.params.id}`));
        }

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
        return next(new createError.InternalServerError('Could not update barton'));
    }

};

exports.delete = async (req, res, next) => {

    try {
        const entity = service.delete(req.params.id);
        return res.json({})
    } catch (err) {
        console.error(err);
        return next(new createError.InternalServerError('Could not delete barton'));
    }

};