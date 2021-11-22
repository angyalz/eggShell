const router = require('express').Router();
const userController = require('./users.controller');

const authenticationByJWT = require('../../controllers/auth/authenticate');
const adminRoleHandler = require('../../controllers/auth/adminOnly');


router.get('/', authenticationByJWT, (req, res, next) => {
    return userController.getAllUsers(req, res, next);
});

router.get('/:id', authenticationByJWT, (req, res, next) => {
    return userController.getUserById(req, res, next);
});

router.patch('/:id', (req, res, next) => {
    return userController.updateOne(req, res, next);
});

// router.post('/', (req, res, next) => {
//     return createNewUser(req, res, next);
// });


module.exports = router;