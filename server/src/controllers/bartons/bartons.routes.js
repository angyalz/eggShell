const router = require('express').Router();
const controller = require('./bartons.controller');

const authenticationByJWT = require('../../controllers/auth/authenticate');
const adminRoleHandler = require('../../controllers/auth/adminOnly');

router.post('/', (req, res, next) => {
    return controller.create(req, res, next);
});

router.get('/', authenticationByJWT, (req, res, next) => {
    console.log('Get at bartons router');       // debug
    return controller.findAll(req, res, next);
});

router.get('/:id', authenticationByJWT, (req, res, next) => {
    console.log('Get at bartons router');       // debug
    return controller.findOne(req, res, next);
});

router.patch('/:id', authenticationByJWT, (req, res, next) => {
    return controller.update(req, res, next);
});

router.put('/:id', authenticationByJWT, (req, res, next) => {
    return controller.update(req, res, next);
});

router.delete('/:id', authenticationByJWT, adminRoleHandler, (req, res, next) => {
    return controller.delete(req, res, next);
});

module.exports = router;