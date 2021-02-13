const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const Log = require('../controllers/log_actions.controller');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const { sendRegisterWelcomeMail } = require('../middleware/email/index');

/*
    User.create({
    username: req.body.username,
    email: req.body.email,
    ---
    password: bcrypt.hashSync(req.body.password, 10)
    ---

 */

const signup = (req, res) => {
    // Save User to DB
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    .then(user => {
        if (req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            })
            .then(roles => {
                user.setRoles(roles)
                .then(() => {
                    sendRegisterWelcomeMail(req.body.email, req.body.username, req.body.password);
                    Log.createLog('signup user', `User: ${req.body.username}  created`, 2);
                    res.send({ message: 'Użytkownik zarejestrowany!' });
                });
            });
        } else {
            // user role = 1 ('user')
            // user role = 2 ('moderator')
            // user role = 3 ('admin')
            user.setRoles([2])
            .then(() => {
                sendRegisterWelcomeMail(req.body.email, req.body.username, req.body.password);
                Log.createLog('signup user', `User: ${req.body.username} created`, 2);
                res.send({ message: 'Użytkownik zarejestrowany!' });
            });
        }
    })
    .catch(err => {
        Log.createLog('signup user', `User: ${req.body.username} could not be created`, 3);
        res.status(500).send({ message: err.message });
    });
};

const signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (!user) {
            Log.createLog('signin user', `User: ${req.body.username} not found`, 3);
            return res.status(404).send({ message: 'Użytkownik nie znaleziony!' });
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            Log.createLog('signin user', `User: ${req.body.username} passed wrong password`, 3);
            return res.status(401).send({
                accessToken: null,
                message: 'Nieprawidłowe hasło!'
            });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        var authorities = [];

        user.getRoles()
        .then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push(`ROLE_${roles[i].name.toUpperCase()}`);
            }

            Log.createLog('signin user', `User: ${req.body.username} logged in`, 2);
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        })
        .catch(err => {
            Log.createLog('signup user', `User: ${req.body.username} could not log in`, 3);
            res.status(500).send({ message: err.message });
        });
    })
};

module.exports = {
    signup,
    signin
};
