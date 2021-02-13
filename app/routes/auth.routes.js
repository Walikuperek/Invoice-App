const controller = require('../controllers/auth.controller');
const { verifySignUp } = require('../middleware');


module.exports = (app) => {
    app.use((req, res, callback) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        
        callback();
    });

    app.post(
        '/api/auth/signup',
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post('/api/auth/signin', controller.signin);
    
};
