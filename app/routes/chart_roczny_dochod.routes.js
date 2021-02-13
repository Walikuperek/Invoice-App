const controller = require('../controllers/chart_roczny_dochod.controller');
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

    app.get('/api/chart/roczny', controller.getAll);

    app.post('/api/chart/roczny/create', controller.createChartRocznyRow);

};
