const controller = require('../controllers/user.controller');
const { authJwt } = require('../middleware');


module.exports = (app) => {
    app.use((req, res, callback) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );

        callback();
    });

    app.get('/api/test/all', controller.allAccess);

    app.get(
        '/api/test/user',
        [authJwt.verifyToken],
        controller.userBoard
    );

    app.get('/api/test/mod', controller.moderatorBoard);

    app.get(
        '/api/test/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
    
};
