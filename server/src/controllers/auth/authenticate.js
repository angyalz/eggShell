const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = async (req, res, next) => {

    try {

        const authHeader = req.headers?.authorization;

        if (!authHeader) {
            return next(new createError.Unauthorized('Missing authorization header'));
        }

        const token = authHeader.split(' ')[1];

        //    check the token
        const { _id, role } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!_id) {
            return next(new createError.Forbidden('invalid access token'))
        }

        req.userId = _id;
        req.userRole = role;
        next();

    } catch (error) {

        console.error(error.message);

        if (error.message === 'jwt expired')
            return next(new createError.Forbidden('jwt expired'));
            
        if (error.message === 'jwt malformed')
            return next(new createError.Unauthorized('invalid access token'));

        res.sendStatus(500)
    }
}