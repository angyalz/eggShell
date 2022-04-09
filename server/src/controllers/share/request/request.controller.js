const logger = require('../../../config/logger');
const createError = require('http-errors');

const User = require('../../../models/user.model');
// const Request = require('../../../models/request.model');
const service = require('./request.service');

exports.create = async (req, res, next) => {

    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id: ${req.params.id} and body: ${req.body}`);

    const targetUserId = req.params.id;
    const applicantId = req.body.user;

    if (!targetUserId || !applicantId) {
        return next(
            new createError.BadRequest('Parameters missing')
        );
    }

    if (targetUserId === applicantId) {
        return next(
            new createError.BadRequest('Parameters are equals')
        )
    }

    const isExists = await User.exists({ _id: targetUserId, 'pendingRequests.user': applicantId });
    const existUser = await User.find({ _id: targetUserId, 'pendingRequests.user': applicantId });  // debug
    console.log('existUser: ', existUser);        // debug
    // user.pendingRequest.id(id).remove();

    if (isExists) {
        return next(
            new createError.BadRequest('Request exists')
        );
    }

    try {

        const entity = await service.create(targetUserId, applicantId);
        const updatedUser = await User.findById(applicantId);
        logger.info(`Request created: ${entity}`)
        res.status(201);
        res.json(updatedUser);

    } catch (err) {
        console.error(err)
        return new createError.InternalServerError('Request could not save');
    }
};

// exports.findAll = (req, res, next) => {
//     return service.findAll()
//         .then(list => {
//             res.json(list);
//         }).catch(err => {
//             console.error(err);
//             return new createError.InternalServerError('List could nost send')
//         })
// };

// exports.findOne = (req, res, next) => {
//     return service.findOne(req.params.id)
//         .then(entity => {
//             if (!entity) {
//                 return next(new createError.NotFound("Request not found"));
//             }
//             return res.json(entity);
//         });
// };

exports.update = async (req, res, next) => {

    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id: ${req.params.id} and body: ${req.body}`);

    const requestId = req.params.id;
    const { userId, targetUserId, bartonDataList } = req.body;
    console.log('Request req body: ',
        '\n userId: ', userId, 
        '\n targetUserId: ', targetUserId, 
        '\n bartonDataList: ', bartonDataList); // debug

    if ( !userId || !targetUserId || !requestId || !bartonDataList ) {
        return next(
            new createError.BadRequest('Missing fields!')
        );
    }

    try {

        for (let bartonData of bartonDataList) {
            const savedData = await service.acceptRequest(targetUserId, bartonData.id, bartonData.role);
            logger.info(`Barton updated with user ${savedData.barton}`);
        }
        
        const user = await service.delete(requestId);
        logger.info(`User's pendingRequest updated ${user}`);

        // const user = await User.findById(userId);
        // res.status()
        return res.json(user);

    } catch (err) {
        console.error(err)
        return next(new createError.InternalServerError('Could not update request'));
    }

};

exports.delete = async (req, res, next) => {

    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id: ${req.params.id} and body: ${req.body}`);

    console.log('Req.params at delete: ', req.params);    // debug
    console.log('Req.params.id at delete: ', req.params.id);    // debug

    const user = await User.findOne({ 'pendingRequests._id': req.params.id });
    const userId = user._id;
    console.log('user at request controller delete method: ', user); // debug
    console.log('userId at request controller delete method: ', userId); // debug
    // const isExists = await user.pendingRequests.id(req.params.id);
    // const existUser = await user.pendingRequests.id(req.params.id);
    // console.log('isExists at delete: ', isExists); // debug
    // console.log('existUser at delete: ', existUser); // debug
    // user.pendingRequest.id(id).remove();

    if (!user) {
        return next(
            new createError.BadRequest('Request isn`t exists')
        );
    }

    try {
        const entity = await service.delete(req.params.id);
        const updatedUser = await User.findById( userId );
        console.log('updated user at delete: ', updatedUser);  // debug
        logger.info(`Request deleted: ${entity}`)
        res.status(202);
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        return next(new createError.InternalServerError('Could not delete request'));
    }

};