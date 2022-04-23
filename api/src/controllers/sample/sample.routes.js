const express = require('express');
const router = express.Router();
const controller = require('./school.controller');

router.post('/', (req, res, next) => {
    return controller.create(req, res, next);
});

router.get('/', (req, res, next) => {
    return controller.findAll(req, res, next);
});

router.get('/:id', (req, res, next) => {
    return controller.findOne(req, res, next);
});

router.put('/:id', (req, res, next) => {
    return controller.update(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    return controller.delete(req, res, next);
});

module.exports = router;