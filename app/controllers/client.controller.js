// database Product schema
const db = require('../models');
const Client = db.client;

const Log = require('../controllers/log_actions.controller');

var counter = 0;
var emptyProductsArray = false;

const { Op } = require('sequelize');


/**
 * SQL: 'SELECT * FROM clients WHERE id = req.params.id'
 */
const getById = (req, res) => {
    Client.findOne({
        where: { 
            id: req.params.id
        }
    })
    .then((client) => {
        if (!client) {
            Log.createLog('client findOne by id', `client with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `client with id: ${req.body.id} not found!` });
        }

        res.status(200).send(client);
    })
    .catch(err => {
        Log.createLog('client findOne by id', `client with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};

/**
 * SQL: 'DELETE TABLE clients' 
 */
const deleteAll = async (req, res) => {
    await Client.destroy({
        truncate: true
    })
    .then((clients) => {
        if (!clients) {
            Log.createLog('DELETE', `clients not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'clients not found!' });
        }

        Log.createLog('DELETE', 'Deleted all clients records from database!', 2)
        res.status(200).send({ message: 'Deleted all records from database!' });
    })
    .catch(err => {
        Log.createLog('DELETE', `clients could not been deleted`, 3);
        res.status(500).send({ message: err.message });
    });
}


/**
 * SQL: 'SELECT * FROM clients'
 * 
 * @returns clients.rows = data
 * @returns clients.count = count of rows
 */
const getAll = (req, res) => {

    Client.findAndCountAll()
    .then((clients) => {
        if (!clients) {
            return res.status(404).send({ message: 'clients not found!' });
        }

        res.status(200).send(clients);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};

/**
 * @returns clients.rows = data
 * @returns clients.count = count of rows
 */
const search = (req, res) => {
    let word = req.params.word;
    if (word === undefined) return this.getAll();
    
    Client.findAndCountAll({
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
    .then((clients) => {
        if (!clients) {
            return res.status(404).send({ message: 'clients not found!' });
        }

        res.status(200).send(clients);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};


const deleteById = async (req, res) => {
    Client.destroy({
        where: { 
            id: req.params.id
        }
    })
    .then((client) => {
        if (!client) {
            Log.createLog('table: clients DELETE', `client with id: ${req.body.id} not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'client not found!' });
        }

        Log.createLog('table: clients DELETE', `Deleted client with id: ${req.body.id} from database!`, 2)
        res.status(200).send({ message: 'Deleted record from database!' });
    })
    .catch(err => {
        Log.createLog('table: clients DELETE', `client with id: ${req.body.id} could not been deleted, err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}


const createClient = (req, res) => {
    Client.create({
        nazwa: req.body.nazwa,
        typ: req.body.typ,
        typDwa: req.body.typDwa,
        ulicaINr: req.body.ulicaINr,
        miasto: req.body.miasto,
        kodPocztowy: req.body.kodPocztowy,
        NIP: req.body.NIP,
    })
    .then(client => {
        Log.createLog('table clients', `Created client with nazwa: ${req.body.nazwa}`, 2);
        res.status(200).send(client);
    })
    .catch(err => {
        Log.createLog('table: clients', `Could not create client, err: ${err.message}`, 3);
    });
};

module.exports = {
    getAll,
    getById,
    search,
    deleteById,
    createClient
};