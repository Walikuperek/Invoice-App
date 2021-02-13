const controller = require('../controllers/client.controller');
const ENV = require('../config/environment.config');


module.exports = (app) => {
    app.use((req, res, callback) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
    
        res.header('Access-Control-Allow-Origin', `${ENV.mode}`);
        
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

        callback();
    });

    app.get('/api/clients/', controller.getAll);

    app.get('/api/clients/id/:id', controller.getById);

    app.get('/api/clients/search/:word', controller.search);

    app.delete('/api/clients/delete/:id', controller.deleteById);

    app.post('/api/clients/create', controller.createClient);

};
