const router = require('express').Router();
const controller = require('./users.controller');

const authenticationByJWT = require('../auth/authenticate');
const adminRoleHandler = require('../auth/adminOnly');

router.post('/', authenticationByJWT, (req, res, next) => {
    return controller.checkExists(req, res, next);
});

router.get('/', authenticationByJWT, adminRoleHandler, (req, res, next) => {
    return controller.findAll(req, res, next);
});

router.get('/:id', authenticationByJWT, (req, res, next) => {
    return controller.findOne(req, res, next);
});

router.patch('/:id', authenticationByJWT, (req, res, next) => {
    return controller.updatePartially(req, res, next);
});

router.put('/:id', authenticationByJWT, (req, res, next) => {
    return controller.update(req, res, next);
});

router.delete('/:id', authenticationByJWT, adminRoleHandler, (req, res, next) => {
    return controller.delete(req, res, next);
});

module.exports = router;