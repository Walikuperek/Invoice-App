const db = require('../models');
const Chosen = db.chosen;
const { Op } = require('sequelize');
const Log = require('../controllers/log_actions.controller');
const Pdf = require('../controllers/pdf_files.controller');

const count = (req, res) => {
    Chosen.count()
    .then(count => {
        count = count.toString();
        res.status(200).send(count); // It is not allowed to send numbers
    })
    .catch(err => {
        Log.createLog('chosen product count', `Chosen product count not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}


const updateVatById = (req, res) => {
    Chosen.findOne({
        where: { 
            id: req.params.id
        }
    })
    .then( async (product) => {
        if (!product) {
            Log.createLog('chosen product updateVat by id', `Chosen product with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `Product with id: ${req.body.id} not found!` });
        }

        product.vat = parseFloat(req.params.vat);
        await product.save(); // save to DB

        res.status(200).send(product);
    })
    .catch(err => {
        Log.createLog('chosen product findOne by id', `Chosen product with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};


const getById = (req, res) => {
    Chosen.findOne({
        attributes: [
            'id', 'nazwa', 'cena', 'iloscDostepna'
        ],
        where: { 
            id: req.params.id
        }
    })
    .then((products) => {
        if (!products) {
            Log.createLog('chosen product findOne by id', `Chosen product with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `Product with id: ${req.body.id} not found!` });
        }

        res.status(200).send(products);
    })
    .catch(err => {
        Log.createLog('chosen product findOne by id', `Chosen product with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};

const deleteAll = async (req, res) => {
    await Chosen.destroy({
        truncate: true
    })
    .then((products) => {
        if (!products) {
            Log.createLog('DELETE', 'Deleted all chosen products records from database!', 2)
            return res.status(200).send({ message: 'Deleted all records from database!' });
        }
        Log.createLog('DELETE', `Chosen products not found and could not been deleted`, 3);
        return res.status(404).send({ message: 'Products not found!' });
    })
    .catch(err => {
        Log.createLog('DELETE', `Chosen products could not been deleted, err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}

const deleteById = async (req, res) => {

    Chosen.destroy({
        where: { 
            id: req.params.id
        }
    })
    .then((product) => {
        if (!product) {
            Log.createLog('DELETE', `Chosen product with id: ${req.params.id} not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'Product not found!' });
        }

        Log.createLog('DELETE', `Deleted chosen product with id: ${req.params.id} from 'chosens' database!`, 2)
        res.status(200).send({ message: 'Deleted record from database!' });
    })
    .catch(err => {
        Log.createLog('DELETE', `Chosen product with id: ${req.params.id} could not been deleted, err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}

const getAll = (req, res) => {
    Chosen.findAndCountAll({})
    .then((chosenProducts) => {
        if (!chosenProducts) {
            return res.status(404).send({ message: 'Chosen products not found!' });
        }

        res.status(200).send(chosenProducts);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};


const createChosen = (req, res) => {

    Chosen.create({
        nazwa: req.body.nazwa,
        ilosc: req.body.ilosc,
        cena: req.body.cena,
        iloscDostepna: req.body.iloscDostepna,
        jednostkaMiary: req.body.jednostkaMiary,
        vat: req.body.vat || 23,
        marza: req.body.marza || 0,
        total: req.body.total
    })
    .then(chosen => {
        res.status(200).send(chosen);
    })
    .catch(err => {
        Log.createLog('chosen products', `Could not create chosen product, err: ${err.message}`, 3);
    });
};


module.exports = { count, updateVatById, getById, deleteAll, deleteById, getAll, createChosen };




