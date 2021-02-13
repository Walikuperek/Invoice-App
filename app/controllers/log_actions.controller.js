const db = require('../models');
const Log = db.log_actions;

const { Op } = require('sequelize');

const getAll = (req, res) => {
    Log.findAndCountAll({
        // group: ['createdAt'],
        order: [
            ['createdAt', 'DESC'],
        ],
        limit: 100
     })
    .then((logs) => {
        if (!logs) {
            return res.status(404).send({ message: 'Logs not found!' });
        }

        res.status(200).send(logs);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};


const createLog = (type = '', description = '', important = 0) => {
    Log.create({
        typeOfAction: type,
        description: description,
        important: important
    })
    .then(log => {
    })
    .catch(err => {
    });
};


const getByImportant = (req, res) => {
    Log.findAndCountAll({
        where: {      
            [Op.or]: [
                {
                important: {
                    [Op.like]: `%${req.params.important}%`
                }
                },
            ]
        },
    }, req.params.word)
    .then((logs) => {
        if (!logs) {
            return res.status(404).send({ message: 'Logs not found!' });
        }

        res.status(200).send(logs);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};

const deleteAll = async (req, res) => {
    await Log.destroy({
        truncate: true
    })
    .then((products) => {
        if (!products) {
            Log.createLog('DELETE', 'Deleted all Logs from database!', 2)
            return res.status(200).send({ message: 'Deleted all logs from database!' });
        }
        Log.createLog('DELETE', `Logs not found and could not been deleted`, 3);
        return res.status(404).send({ message: 'Logs not found!' });
    })
    .catch(err => {
        Log.createLog('DELETE', `Logs could not been deleted, err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}

module.exports = { getAll, createLog, getByImportant, deleteAll };




