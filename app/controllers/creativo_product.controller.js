// database Product schema
const db = require('../models');
const CreativoProduct = db.creativo_product;

const Log = require('../controllers/log_actions.controller');

var emptyProductsArray = false;

const { Op } = require('sequelize');


const createCreativoProduct = (req, res) => {
    CreativoProduct.create({
        kod: req.body.kod,
        nazwa: req.body.nazwa,
        typ: req.body.typ,
        nrKatalogu: req.body.nrKatalogu,
        ilosc: req.body.ilosc,
        rezerwacje: req.body.rezerwacje,
        braki: req.body.braki,
        iloscDostepna: req.body.iloscDostepna,
        cena: req.body.cena,
        iloscMinimalna: req.body.iloscMinimalna
    })
    .then(creativo_product => {
    })
    .catch(err => {
    });
};


const getById = (req, res) => {
    CreativoProduct.findOne({
        attributes: [
            'id', 'nazwa', 'cena', 'iloscDostepna'
        ],
        where: { 
            id: req.params.id
        }
    })
    .then((creativo_products) => {
        if (!creativo_products) {
            Log.createLog('creativo_product findOne by id', `Product with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `Product with id: ${req.body.id} not found!` });
        }

        res.status(200).send(creativo_products);
    })
    .catch(err => {
        Log.createLog('creativo_product findOne by id', `Product with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};


const deleteAll = async (req, res) => {
    await CreativoProduct.destroy({
        truncate: true
    })
    .then((creativo_products) => {
        if (!creativo_products) {
            Log.createLog('DELETE', `creativo_products not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'creativo_products not found!' });
        }

        Log.createLog('DELETE', 'Deleted all creativo_products records from database!', 3)
        res.status(200).send({ message: 'Deleted all records from database!' });
    })
    .catch(err => {
        Log.createLog('DELETE', `Creativo creativo_products could not been deleted`, 3);
        res.status(500).send({ message: err.message });
    });
}


const getAll = (req, res) => {

    CreativoProduct.findAndCountAll({
        attributes: [
            'id', 'kod', 'nazwa', 'cena', 'iloscDostepna'
        ],
        limit: 50,
        offset: 50
    })
    .then((creativo_products) => {
        if (!creativo_products) {
            return res.status(404).send({ message: 'creativo_products not found!' });
        }

        res.status(200).send(creativo_products.rows);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};


const search = (req, res) => {
    let word = req.params.word;
    Log.createLog('search', `word: ${word}`, 5);

    // Starts at 0
    counter += 1;

    // Analogic replation is located at the frontend
    // But reversed: word = word.replace('/', '%2F');
    word = word.replace('%2F', '/');

    if (emptyProductsArray == true) {
        const wordArr = word.split(" ");
        wordArr = wordArr.reverse();
        word = wordArr;

            counter += 10;
        // Get back to normal
        emptyProductsArray = false;
    }

    CreativoProduct.findAll({
        attributes: [
            'id' ,'kod', 'nazwa', 'cena', 'iloscDostepna'
        ],
        where: {      
            [Op.or]: [
                {
                kod: {
                    [Op.like]: `%${word}%`
                }
                },
                {
                nazwa: {
                    [Op.like]: `%${word}%`
                }
                }
            ]
        }
    }, req.params.word)
    .then((creativo_products) => {
        if (!creativo_products) {
            return res.status(404).send({ message: 'creativo_products not found!' });
        }

        if (creativo_products == [] && emptyProductsArray == false) {
            // Set to true for reversing the string[] 
            // and search for results one again
            emptyProductsArray = true;
            search(req, res);
        };

        res.status(200).send(creativo_products);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};


module.exports = {
    getAll,
    getById,
    search,
    createCreativoProduct
};