const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

global.__basedir = __dirname + "/..";

const app = express();
const ENV = require('./app/config/environment.config');

const corsOptions = {
    origin: ENV.mode
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
db.sequelize.sync();


app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', `${ENV.mode}`);
    
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/product.routes')(app);
require('./app/routes/excel.routes')(app);
require('./app/routes/log_actions.routes')(app);
require('./app/routes/chosen.routes')(app);
require('./app/routes/pdf_chosens.routes')(app);
require('./app/routes/pdf_list.routes')(app);
require('./app/routes/raport_widget.routes')(app);
require('./app/routes/chart_roczny_dochod.routes')(app);
require('./app/routes/seller.routes')(app);
require('./app/routes/client.routes')(app);
require('./app/routes/redirect.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}, ENV_MODE: ${ENV.mode}`);
});
