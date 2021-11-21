import { sign, verify } from 'jsonwebtoken';
import { findOne } from '../model/user.model';
import Token, { findOne as _findOne, findOneAndRemove } from '../model/token.model';

export function login(req, res) {

    const { username, password } = req.body;

    findOne({ userName: username, password: password })
        .then(user => {

            if (user) {
                const accessToken = sign({
                    username: user.userName,
                    role: user.role,
                    user_id: user._id
                }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRY
                });

                const refreshToken = sign({
                    username: user.userName,
                    role: user.role,
                    user_id: user._id
                }, process.env.REFRESH_TOKEN_SECRET);

                const newRefreshToken = new Token({
                    token: refreshToken
                });

                newRefreshToken.save()

                res.json({
                    accessToken,
                    refreshToken,
                    username: user.userName,
                    user_id: user._id,
                    role: user.role
                })

            } else {
                res.status(400).json('Username or password is incorrect');
                console.log('auth – no user; auth failed');
            }

        });

}

export function refresh(req, res) {

    const { token } = req.body;

    if (!token) {
        res.sendStatus(401);
        return;
    }

    _findOne({ token: token })
        .then(data => {

            if (data) {

                verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

                    if (err) {
                        res.sendStatus(403);
                    }

                    const accessToken = sign({
                        username: user.username,
                        role: user.role,
                        user_id: user.user_id
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: process.env.TOKEN_EXPIRY
                    });

                    res.json({
                        accessToken,
                        userData: {
                            username: user.username,
                            user_id: user.user_id,
                            role: user.role
                        }
                    })

                    return;

                })
            }
        })
}

export function logout(req, res) {

    const { token } = req.body;

    if (!token) {
        res.sendStatus(403);
        return;
    }

    findOneAndRemove({ token: token })
        .then(data => {
            if (data) {
                res.status(200).send({});
            } else {
                res.sendStatus(403);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json("Could not logout user");
        })

}