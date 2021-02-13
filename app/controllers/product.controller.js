// database Product schema
const db = require('../models');
const Product = db.product;

const Log = require('../controllers/log_actions.controller');

var counter = 0;
var emptyProductsArray = false;

const { Op } = require('sequelize');

/**
 *  NPM package: excel reader for extracting .xlsx into rows
 *  @function insertProductsFromXlsx
 */ 
const readXlsxFile = require('read-excel-file/node');


/**
 * SQL: 'SELECT kod, nazwa, cena, iloscDostepna FROM products'
 */
const getById = (req, res) => {
    Product.findOne({
        attributes: [
            'id', 'nazwa', 'cena', 'iloscDostepna'
        ],
        where: { 
            id: req.params.id
        }
    })
    .then((products) => {
        if (!products) {
            Log.createLog('product findOne by id', `Product with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `Product with id: ${req.body.id} not found!` });
        }

        res.status(200).send(products);
    })
    .catch(err => {
        Log.createLog('product findOne by id', `Product with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};

/**
 * SQL: 'DELETE TABLE products' 
 */
const deleteAll = async (req, res) => {
    await Product.destroy({
        truncate: true
    })
    .then((products) => {
        if (!products) {
            Log.createLog('DELETE', `Products not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'Products not found!' });
        }

        Log.createLog('DELETE', 'Deleted all products records from database!', 2)
        res.status(200).send({ message: 'Deleted all records from database!' });
    })
    .catch(err => {
        Log.createLog('DELETE', `Products could not been deleted`, 3);
        res.status(500).send({ message: err.message });
    });
}


/**
 * SQL: 'SELECT kod, nazwa, cena, iloscDostepna FROM products'
 */
const getAll = (req, res) => {

    Product.findAndCountAll({
        attributes: [
            'id', 'kod', 'nazwa', 'cena', 'iloscDostepna'
        ],
        // limit: 200,
        // offset: 50
    })
    .then((products) => {
        if (!products) {
            return res.status(404).send({ message: 'Products not found!' });
        }

        res.status(200).send(products);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};

/**
 * Search field
 * SQL: 'SELECT `kod`, `nazwa`, `cena`, `iloscDostepna` 
 *          FROM `products` AS `products` 
 *          WHERE (`products`.`kod` 
 *              LIKE '%searchedString%' 
 *          OR `products`.`nazwa`
 *              LIKE '%searchedString%');'
 */
const search = (req, res) => {
    let word = req.params.word;
    Log.createLog('search', `word: ${word}`, 5);

    // Starts at 0
    counter += 1;

    // Analogic replacement is located at the frontend
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

    Product.findAndCountAll({
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
    .then((products) => {
        if (!products) {
            return res.status(404).send({ message: 'Products not found!' });
        }

        if (products.rows == [] && emptyProductsArray == false) {
            // Set to true for reversing the string[] 
            // and search for results one again
            emptyProductsArray = true;
            search(req, res);
        };

        res.status(200).send(products);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};

module.exports = {
    getAll,
    getById,
    search
};