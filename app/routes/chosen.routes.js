const controller = require('../controllers/chosen.controller');
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
    
    app.get('/api/products/chosen', controller.getAll);

    app.post('/api/products/chosen/:id/vat/:vat', controller.updateVatById);
    
    app.get('/api/products/chosen/:id', controller.getById);

    app.delete('/api/products/chosen/delete', controller.deleteAll);

    app.delete('/api/products/chosen/delete/:id', controller.deleteById);
    
    app.get('/api/products/chosen/get/count', controller.count);
    
    app.post('/api/products/chosen/create', controller.createChosen);

};
