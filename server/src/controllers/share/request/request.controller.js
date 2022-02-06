// const express = require('express');
const createError = require('http-errors');

const User = require('../../../models/user.model');
const Request = User.pendingRequests;
const service = require('./request.service');

exports.create = async (req, res, next) => {

    const { targetUserId, applicantId } = req.body;

    // const validationErrors = new Request({user: applicantId}).validateSync();

    if (!targetUserId || !applicantId) {
        return next(
            new createError.BadRequest('Parameters missing')
        );
    }

    const user = await User.findById(targetUserId);
    const isExists = await user.pendingRequests.id(applicantId)
    // user.pendingRequest.id(id).remove();

    if (isExists) {
        console.log('This request exists') // debug
        return next(
            new createError.BadRequest('Request exists')
        );
    }

    try {
    
        const entity = await service.create(req.body);
        const updatedUser = await User.findById(targetUserId);
        logger.info(`Request created: ${entity}`)
        res.status(201);
        res.json(updatedUser);

    } catch (err) {
        console.error(err)
        return new createError.InternalServerError('Request could not save');
    }
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
                return next(new createError.NotFound("Request not found"));
            }
            return res.json(entity);
        });
};

exports.update = (req, res, next) => {
    const validationErrors = new Request(req.body).validateSync();
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
            return next(new createError.InternalServerError('Could not update request'));
        });
};

exports.delete = async (req, res, next) => {

    const user = await User.find({ pendigRequests: req.params.id });
    console.log('user at request service delete method: '); // debug
    const isExists = await user.pendingRequests.id(applicantId);
    // user.pendingRequest.id(id).remove();

    if (!isExists) {
        return next(
            new createError.BadRequest('Request isn`t exists')
        );
    }

    try {
        return service.delete(req.params.id)
    } catch (err) {
        console.error(err);
        res.json({})
        return next(new createError.InternalServerError('Could not delete request'));
    }

};