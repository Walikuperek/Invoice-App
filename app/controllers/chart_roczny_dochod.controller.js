const db = require('../models');
const ChartRoczny = db.chart_roczny;

const Log = require('../controllers/log_actions.controller');

const getAll = (req, res) => {
    console.log(`
    
    ------------------------------------- CHART GETALL 
    
    `);
    ChartRoczny.findAndCountAll()
    .then((data) => {
        if (!data) {
            return res.status(404).send({ message: 'Chart Roczny data not found!' });
        }

        res.status(200).send(data.rows);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};


/**
 * 
 * @param {integer} id auto increment
 * @param {float} req.body.marza 
 * @param {float} req.body.total
 * @param {float} req.body.vat
 * @param {integer} req.body.miesiac
 * @param {integer} req.body.rok 
 */
const createChartRocznyRow = (req, res) => {
    console.log(`
    
    ------------------------------------- CHART CREATE 
    
    `);
    ChartRoczny.create({
        id: null,
        marza: req.body.marza,
        total: req.body.total,
        vat: req.body.vat,
        miesiac: req.body.miesiac,
        rok: req.body.rok,
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        Log.createLog('table: chart_roczny', `Could not create chart_roczny row, err: ${err.message}`, 3);
        res.status(500).send(err.message);
    });
};


module.exports = {
    getAll, createChartRocznyRow
};