const router = require('express').Router();
const authController = require('./auth.controller');

router.post('/register', (req, res, next) => authController.register(req, res, next));

router.post('/login', (req, res, next) => authController.login(req, res, next));

router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));

router.post('/logout', (req, res, next) => authController.logout(req, res, next));

module.exports = router;