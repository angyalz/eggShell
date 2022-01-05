const service = require('./auth.service');
const Model = require('../../models/user.model')
const createError = require('http-errors');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

// register a new customer
exports.register = async (req, res, next) => {

    const validationErrors = new Model(req.body).validateSync();
    if (validationErrors) {
        console.error('ValidError: ', validationErrors);
        return next(
            new createError.BadRequest(validationErrors)
        );
    }

    let { username, email, password } = req.body;

    // if (!username || !email || !password) {
    //     console.error(`Request body is missing required field(s)`);
    //     return next(new createError.BadRequest(`Request body is missing required field(s)`));
    // }
    try {

        // check if email is not already in db
        // const emailIsTaken = await service.findUser({ email });

        // if (emailIsTaken) {
        //     console.error(emailIsTaken);
        //     return next(new createError.BadRequest(`Email is already registered`))
        // }

        password = await bcrypt.hash(password, saltRounds);

        const entity = await service.create({ username, email, password });

        if (!entity) {
            throw new Error('could not save user')
        }
        res.status(201);
        return res.json({ email: entity.email });

    } catch (err) {
        console.error(err.message);
        console.error(err);
        return next(new createError.InternalServerError(err));
    }
}

// user login
exports.login = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        console.error(`Request body is missing required field(s)`);
        return next(new createError.BadRequest(`Request body is missing required field(s)`));
    }

    try {

        const user = await service.findUser({ email });

        if (!user) {
            console.error(`Invalid email/pass combination`);
            return next(new createError.Unauthorized(`Invalid email/pass combination`));
        }
        // we check if the submitted pwd matches the one in the db
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.error(`Invalid email/pass combination`);
            return next(new createError.Unauthorized(`Invalid email/pass combination`));
        }

        // generate an accessToken
        const accessToken = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                role: user.role,
                bartons: user.barton,
            }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY
        }
        );

        // gen a refreshToken
        const refreshToken = jwt.sign({
            _id: user._id,
            username: user.username,
            role: user.role,
            bartons: user.barton,
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_EXPIRY
        });

        console.log('tokens: ', accessToken, refreshToken); // debug
        console.log('refreshToken: ', refreshToken); // debug

        // save the refresh token
        const savedRefreshToken = await service.saveToken(refreshToken);

        console.log('savedRefreshToken at auth.controller: ', savedRefreshToken); // debug

        if (!savedRefreshToken) {
            throw new Error('could not save token')
        }
        res.status(200);
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            bartons: user.barton,
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error(error.message);
        return next(new createError.InternalServerError(error.message));
    }
}

// refresh
exports.refresh = async (req, res, next) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.sendStatus(401);
    };

    try {

        // check that refreshToken exist in db
        const tokenFromDB = await service.findToken(refreshToken);

        if (!tokenFromDB) {
            return res.sendStatus(403);
        }

        // if token exists in db verify its validity
        const user = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // gen new accessToken
        const accessToken = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                role: user.role,
                bartons: user.barton,
            }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY
        }
        )
        res.status(200);
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            bartons: user.barton,
            accessToken,
            refreshToken,
        });

    } catch (error) {

        if (error.message === 'jwt expired') {
            await service.deleteToken(refreshToken);
            return next(new createError.Forbidden(error.message))
        }
        return next(new createError.InternalServerError(error.message));
    }
};

// user logs out
exports.logout = async (req, res, next) => {

    const { refreshToken } = req.body;
    // if no token is sent
    if (!refreshToken) {
        return res.sendStatus(403);
    }

    try {
        // we delete the refreshToken from the DB
        const { deletedCount } = await service.deleteToken(refreshToken);
        if (!deletedCount) {
            throw new Error('already logged out or token not found in DB')
        }
        console.log('deletedCount: ', deletedCount); // debug
        console.log('token found and deleted from DB');
        res.status(200);
        return res.json({});

    } catch (error) {

        if ((error.message === "already logged out or token not found in DB")) {
            return next(new createError.Unauthorized("already logged out or token not found in DB"));
        }

        return next(new createError.InternalServerError(error.message));
    }
}


