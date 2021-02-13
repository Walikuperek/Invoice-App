const controller = require('../controllers//log_actions.controller');


module.exports = (app) => {
    app.use((req, res, callback) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );

        callback();
    });

    app.get('/api/admin/logs/', controller.getAll);

    app.get('/api/admin/logs/:important', controller.getByImportant);

    app.delete('/api/admin/logs/delete', controller.deleteAll);
    
};
