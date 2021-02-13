const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;

const verifyToken = (req, res, callback) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: 'No token provided!'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unathorized!'
            });
        }

        req.userId = decoded.id;

        callback();
    });
};


const isAdmin = (req, res, callback) => {
    // SEQUELIZE: find a User by id: findByPk(id)
    User.findByPk(req.userId)
    .then(user => {
        user.getRoles()
        .then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    callback();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require admin role!'
            });

            return;
        });
    });
};

const isModerator = (req, res, callback) => {
    User.findByPk(req.userId)
    .then(user => {
        user.getRoles()
        .then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'moderator') {
                    callback();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require moderator role!'
            });
        });
    });
};

const isModeratorOrAdmin = (req, res, callback) => {
    User.findByPk(req.userId)
    .then(user => {
        user.getRoles()
        .then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'moderator') {
                    callback();
                    return;
                }

                if (roles[i].name === 'admin') {
                    callback();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require moderator od admin role!'
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;