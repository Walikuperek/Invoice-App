const controller = require('../controllers/pdf_list.controller');
const ENV = require('../config/environment.config');

module.exports = (app) => {
    app.use((req, res, callback) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
            
        res.header('Access-Control-Allow-Origin', `${ENV.mode}`);

        callback();
    });

    app.get('/api/products/chosen/pdf/search/:fileName', controller.download);
    
    app.get('/api/products/chosen/pdf/list', controller.getAll);

    app.post('/api/products/chosen/pdf/list/create', controller.createPdfListFromJSON);

    app.get('/api/products/chosen/pdf/list/search/:word', controller.search);

};
