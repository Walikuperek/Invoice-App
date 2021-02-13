// database Product schema
const db = require('../models');
const Seller = db.seller;

const Log = require('../controllers/log_actions.controller');

var counter = 0;
var emptyProductsArray = false;

const { Op } = require('sequelize');


/**
 * SQL: 'SELECT * FROM sellers WHERE id = req.params.id'
 */
const getById = (req, res) => {
    Seller.findOne({
        where: { 
            id: req.params.id
        }
    })
    .then((seller) => {
        if (!seller) {
            Log.createLog('seller findOne by id', `Seller with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `Seller with id: ${req.body.id} not found!` });
        }

        res.status(200).send(seller);
    })
    .catch(err => {
        Log.createLog('seller findOne by id', `Seller with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};

/**
 * SQL: 'DELETE TABLE sellers' 
 */
const deleteAll = async (req, res) => {
    await Seller.destroy({
        truncate: true
    })
    .then((sellers) => {
        if (!sellers) {
            Log.createLog('DELETE', `Sellers not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'Sellers not found!' });
        }

        Log.createLog('DELETE', 'Deleted all sellers records from database!', 2)
        res.status(200).send({ message: 'Deleted all records from database!' });
    })
    .catch(err => {
        Log.createLog('DELETE', `Sellers could not been deleted`, 3);
        res.status(500).send({ message: err.message });
    });
}


/**
 * SQL: 'SELECT * FROM sellers'
 * 
 * @returns sellers.rows = data
 * @returns sellers.count = count of rows
 */
const getAll = (req, res) => {

    Seller.findAndCountAll()
    .then((sellers) => {
        if (!sellers) {
            return res.status(404).send({ message: 'Sellers not found!' });
        }

        res.status(200).send(sellers);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};

/**
 * @returns sellers.rows = data
 * @returns sellers.count = count of rows
 */
const search = (req, res) => {
    let word = req.params.word;

    Seller.findAndCountAll({
        where: {      
            [Op.or]: [
                {
                    nazwa: {
                        [Op.like]: `%${word}%`
                    }
                },
                {
                    NIP: {
                        [Op.like]: `%${word}%`
                    }
                }
            ]
        }
    }, req.params.word)
    .then((sellers) => {
        if (!sellers) {
            return res.status(404).send({ message: 'Sellers not found!' });
        }

        res.status(200).send(sellers);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};


const deleteById = async (req, res) => {
    Seller.destroy({
        where: { 
            id: req.params.id
        }
    })
    .then((seller) => {
        if (!seller) {
            Log.createLog('table: sellers DELETE', `Seller with id: ${req.body.id} not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'Seller not found!' });
        }

        Log.createLog('table: sellers DELETE', `Deleted seller with id: ${req.body.id} from database!`, 2)
        res.status(200).send({ message: 'Deleted record from database!' });
    })
    .catch(err => {
        Log.createLog('table: sellers DELETE', `Seller with id: ${req.body.id} could not been deleted, err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}


const createSeller = (req, res) => {
    Seller.create({
        nazwa: req.body.nazwa,
        typ: req.body.typ,
        typDwa: req.body.typDwa,
        ulicaINr: req.body.ulicaINr,
        miasto: req.body.miasto,
        kodPocztowy: req.body.kodPocztowy,
        NIP: req.body.NIP,
    })
    .then(seller => {
        Log.createLog('table sellers', `Created seller with nazwa: ${req.body.nazwa}`, 2);
        res.status(200).send(seller);
    })
    .catch(err => {
        Log.createLog('table: sellers', `Could not create seller, err: ${err.message}`, 3);
    });
};

module.exports = {
    getAll,
    getById,
    search,
    deleteById,
    createSeller
};