/*
id int
obrotTotal f
marzaTotal f
produktyTotalWartosc f
produktyTotalIlosc f
pobranePdfIlosc int
*/
const db = require('../models');
const RaportWidget = db.raport_widget;

const Log = require('../controllers/log_actions.controller');
const { Op } = require('sequelize');

const increment_pobranePdfIlosc = async () => {
    const pdfIlosc = await RaportWidget.findOne({ where: { id: 1 }});

    pdfIlosc.increment('pobranePdfIlosc')
    .catch(err => {
        Log.createLog('raport_widget', `Could not increment pobranePdfIlosc, err: ${err.message}`, 3);
    });
};

/**
 * 
 * @param {number} total 
 * @param {number} totalIlosc
 * @param {number} ilosc 
 */
const update_produkty = async (total, totalIlosc, ilosc) => {
    const produkty = await RaportWidget.findOne({ where: { id: 1 }});
    
    produkty.produktyTotalWartosc = total;
    produkty.produktyTotalIlosc = totalIlosc;
    produkty.produktyIlosc = ilosc;

    await produkty.save({ fields: ['produktyTotalWartosc', 'produktyTotalIlosc', 'produktyIlosc'] })
    .catch(err => {
        Log.createLog('raport_widget', `Could not update: [ produktyTotalWartosc, produktyTotalIlosc, 'produktyIlosc' ], err: ${err.message}`, 3);
    });
};

const update_obrotTotal = async (total) => {
    const produkty = await RaportWidget.findOne({ where: { id: 1 }});
    
    produkty.obrotTotal = parseFloat(produkty.obrotTotal) + parseFloat(total);

    await produkty.save({ fields: ['obrotTotal'] })
    .catch(err => {
        Log.createLog('raport_widget', `Could not update: [ obrotTotal ], err: ${err.message}`, 3);
    });
};

const update_marzaTotal = async (marzaTotal) => {
    const produkty = await RaportWidget.findOne({ where: { id: 1 }});
    
    produkty.marzaTotal = parseFloat(produkty.marzaTotal) + parseFloat(marzaTotal);

    await produkty.save({ fields: ['marzaTotal'] })
    .catch(err => {
        Log.createLog('raport_widget', `Could not update: [ marzaTotal ], err: ${err.message}`, 3);
    });
};

const getWidgetRaporty = async (req, res) => {
    RaportWidget.findOne({ where: { id: 1 } })
    .then((raport) => {
        if (!raport) {
            return res.status(404).send({ message: 'Raport not found!' });
        }

        res.status(200).send(raport);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

module.exports = {
    increment_pobranePdfIlosc, update_produkty, update_obrotTotal, update_marzaTotal, getWidgetRaporty
};