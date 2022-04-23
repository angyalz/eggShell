// const express = require('express');
const createError = require('http-errors');

const Model = require('../../models/school.model');
const service = require('./school.service');

exports.create = (req, res, next) => {
    const validationErrors = new Model(req.body).validateSync();
    if (validationErrors) {
        return next(
            new createError.BadRequest(validationErrors)
        );
    }

    return service.create(req.body)
        .then(cp => {
            res.status(201);
            res.json(cp);
        })
        .catch(err => {
            console.log(err);
            return new createError.InternalServerError('School could not save');
        });
};

exports.findAll = (req, res, next) => {
    return service.findAll()
        .then(list => {
            res.json(list);
        }).catch(err => {
            console.error(err);
            return new createError.InternalServerError('List could nost send')
        })
};

exports.findOne = (req, res, next) => {
    return service.findOne(req.params.id)
        .then(entity => {
            if (!entity) {
                return next(new createError.NotFound("School not found"));
            }
            return res.json(entity);
        });
};

exports.update = (req, res, next) => {
    const validationErrors = new Model(req.body).validateSync();
    if (validationErrors) {
        return next(
            new createError.BadRequest(validationErrors)
        );
    }

    return service.update(req.params.id, req.body)
        .then(entity => {
            res.json(entity);
        })
        .catch(err => {
            console.error(err)
            return next(new createError.InternalServerError('Could not update school'));
        });
};

exports.delete = (req, res, next) => {
    return service.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => {
            console.error(err);
            return next(new createError.InternalServerError('Could not delete school'));
        });
};