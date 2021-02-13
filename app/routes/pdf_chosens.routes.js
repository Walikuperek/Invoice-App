const controller = require('../controllers/pdf_chosens.controller');
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
    
    app.post('/api/products/chosen/pdf/create', controller.createPdfChosensFromJSON);

};
