const Log = require('../controllers/log_actions.controller');

const allAccess = (req, res) => {
    Log.createLog('moderator content', `Entered PUBLIC board`, 1);
    res.status(200).send('Panel publiczny');
};

const userBoard = (req, res) => {
    Log.createLog('moderator content', `Entered USER board`, 1);
    res.status(200).send('Panel użytkownika');
};

const adminBoard = (req, res) => {
    Log.createLog('moderator content', `Entered ADMIN board`, 1);
    res.status(200).send('Panel admina');
};

const moderatorBoard = (req, res) => {
    Log.createLog('moderator content', `Entered UPLOAD board`, 1);
    res.status(200).send('Upload panel');
};

module.exports = {
    allAccess,
    userBoard,
    adminBoard,
    moderatorBoard
};