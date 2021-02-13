const db = require('../models');
const PdfList = db.pdf_list;
const fs = require('fs');
const Log = require('../controllers/log_actions.controller');
const { update_obrotTotal, update_marzaTotal } = require('./raport_widget.controller');
const { Op } = require('sequelize');

const download = (req, res) => {
    PdfList.findOne({
        where: {
            pdfFileName: req.params.fileName
        }
    })
    .then(pdf => {
        res.setHeader(
            "Content-Type",
            "application/pdf"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + `resources/exports/pdf/${req.params.fileName}.pdf`
        );
        
        filestream = fs.createReadStream(`resources/exports/pdf/${req.params.fileName}`);
        filestream.pipe(res);
        res.status(200);
    })
    .catch(err => {
        Log.createLog('table: pdf_list', `Could not download PDF with file name: ${req.params.fileName}`, 3);
        res.status(500).send({ message: err.message });
    });
};

const getAll = (req, res) => {
    PdfList.findAndCountAll()
    .then(pdf_list => {
        res.status(200).send(pdf_list);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    })
}; 

const createPdfListFromJSON = (title, JSON) => {
    // const JSON = req.body;

    PdfList.create({        
        id: null,
        pdfFileName: title,
        ul: JSON.ul,
        zip: JSON.zip,
        miasto: JSON.miasto,
        NIP: JSON.NIP,
        marzaTotal: JSON.marzaTotal,
        razemBrutto: JSON.razemBrutto
    })
    .then(() => {
        Log.createLog('table: pdf_list', `Inserted successfully into PDF list, fileName: ${title}`, 2);
        /* 
        
        Raport.createYearMonthIncome

        */
        // Raport widgety update
        update_obrotTotal(JSON.razemBrutto);
        update_marzaTotal(JSON.marzaTotal);
    })
    .catch(err => {
        Log.createLog('table: pdf_list', `Could not create PDF list row, err: ${err.message}`, 3);
    });
};

/**
 * @return {object} object.rows | object.count
 * @returns array | object.rows = data
 * @returns number | object.count = count of rows
 */
const search = (req, res) => {
    let word = req.params.word;

    PdfList.findAndCountAll({
        where: {      
            [Op.or]: [
                {
                    pdfFileName: {
                        [Op.like]: `%${word}%`
                    }
                },
                {
                    ul: {
                        [Op.like]: `%${word}%`
                    }
                },
                {
                    miasto: {
                        [Op.like]: `%${word}%`
                    }
                },
                {
                    nip: {
                        [Op.like]: `%${word}%`
                    }
                }
            ]
        }
    }, req.params.word)
    .then((pdfList) => {
        if (!pdfList) {
            return res.status(404).send({ message: 'PdfList not found!' });
        }

        res.status(200).send(pdfList);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};

module.exports = {
    download, getAll, createPdfListFromJSON, search
};