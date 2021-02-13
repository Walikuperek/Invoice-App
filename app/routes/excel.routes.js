const excelController = require('../controllers/excel.controller');
const upload = require('../middleware/upload');


module.exports = (app) => {
    app.use((req, res, callback) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );

        callback();
    });

    app.post('/api/upload', upload.single('file'), excelController.upload);

    app.get('/api/excel/list', excelController.getExcelFilesList);
    
};
