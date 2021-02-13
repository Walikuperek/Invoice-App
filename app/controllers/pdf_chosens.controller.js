const db = require('../models');
const PdfChosen = db.pdf_chosens;
const PdfList = require('./pdf_list.controller');

// GENERATION PDF
// Getting query parameters
// For findOne{were id = req.query.seller}
const Seller = db.seller;
// For findOne{were id = req.query.client}
const Client = db.client;

const { Op } = require('sequelize');
const Log = require('../controllers/log_actions.controller');
const PDFGen = require('../middleware/PDFGen/index');

const count = (req, res) => {
    PdfChosen.count()
    .then(count => {
        count = count.toString();
        res.status(200).send(count); // It is not allowed to send numbers
    })
    .catch(err => {
        Log.createLog('table: pdf_chosens count', `pdf_chosens count not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}


const updateVatById = (req, res) => {
    PdfChosen.findOne({
        where: { 
            id: req.params.id
        }
    })
    .then( async (product) => {
        if (!product) {
            Log.createLog('table: pdf_chosens product updateVat by id', `Chosen PDF product with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `PDF Product with id: ${req.body.id} not found!` });
        }

        product.vat = parseFloat(req.params.vat);
        await product.save(); // save to DB

        res.status(200).send(product);
    })
    .catch(err => {
        Log.createLog('table: pdf_chosens product findOne by id', `Chosen PDF product with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};


const getById = (req, res) => {
    PdfChosen.findOne({
        where: { 
            id: req.params.id
        }
    })
    .then((products) => {
        if (!products) {
            Log.createLog('table: pdf_chosens product findOne by id', `Chosen PDF product with id: ${req.body.id} not found!`, 3);
            return res.status(404).send({ message: `PDF Product with id: ${req.body.id} not found!` });
        }

        res.status(200).send(products);
    })
    .catch(err => {
        Log.createLog('table: pdf_chosens product findOne by id', `Chosen PDF product with id: ${req.body.id} not found! err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });

};

const deleteAll = async (req, res) => {
    await PdfChosen.destroy({
        truncate: true
    })
    .then((products) => {
        if (!products) {
            Log.createLog('table: pdf_chosens DELETE', `Chosen PDF products not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'Products not found!' });
        }

        Log.createLog('table: pdf_chosens DELETE', 'Deleted all chosen PDF products records from database!', 2)
        res.status(200).send({ message: 'Deleted all records from database!' });
    })
    .catch(err => {
        Log.createLog('table: pdf_chosens DELETE', `Chosen PDF products could not been deleted, err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}

const deleteById = async (req, res) => {

    PdfChosen.destroy({
        where: { 
            id: req.params.id
        }
    })
    .then((product) => {
        if (!product) {
            Log.createLog('table: pdf_chosens DELETE', `Chosen PDF product with id: ${req.body.id} not found and could not been deleted`, 3);
            return res.status(404).send({ message: 'Product not found!' });
        }

        Log.createLog('table: pdf_chosens DELETE', 'Deleted chosen PDF product with id: ${req.body.id} from database!', 2)
        res.status(200).send({ message: 'Deleted record from database!' });
    })
    .catch(err => {
        Log.createLog('table: pdf_chosens DELETE', `Chosen PDF product with id: ${req.body.id} could not been deleted, err: ${err.message}`, 3);
        res.status(500).send({ message: err.message });
    });
}

const getAll = (req, res) => {
    PdfChosen.findAndCountAll({})
    .then((chosenProducts) => {
        if (!chosenProducts) {
            return res.status(404).send({ message: 'Chosen products not found!' });
        }

        res.status(200).send(chosenProducts.rows);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};


const createPdfChosen = (req, res) => {
    PdfChosen.create({
        pdfFileName: req.body.pdfFileName,
        ul: req.body.ul,
        zip: req.body.zip,
        miasto: req.body.miasto,
        NIP: req.body.NIP,
        nazwa: req.body.nazwa,
        ilosc: req.body.ilosc,
        iloscDostepna: req.body.iloscDostepna,
        jednostkaMiary: req.body.jednostkaMiary,
        cena: req.body.cena,
        vat: req.body.vat,
        marza: req.body.marza,
        total: req.body.total
    })
    .then(pdfChosen => {
        res.status(200).send(pdfChosen);
    })
    .catch(err => {
        Log.createLog('table: pdf_chosens', `Could not create chosen PDF product, err: ${err.message}`, 3);
    });
};

const createPdfChosensFromJSON = async (req, res) => {
    // Array for appending chosen items
    const pdfChosens = [];
    const JSON = req.body;
    let createdOK = false;

    // Seller & Client id && nabywca {object to pass}
    let SellerData, ClientData, nabywca;

    // Document number
    const docNumber = req.query.docnr;
    const typeOfDoc = req.query.typeOfDoc;

    // Get selected Seller from database
    await Seller.findOne({
        where: {
            id: req.query.seller
        }
    })
    .then((seller) => {
        if (!seller) {
            return res.status(404).send({ message: `Seller with id: ${req.query.seller} not found!` });
        }
        SellerData = seller;
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });


    // On frontend there is rule that
    // If User wants to add client manually
    // Then append data from form instead from DB
    if (req.query.client !== 'manual') {
        // Get selected Client from database
        await Client.findOne({
            where: {
                id: req.query.client
            }
        })
        .then((client) => {
            if (!client) {
                return res.status(404).send({ message: `Client with id: ${req.query.client} not found!` });
            }
            ClientData = client.dataValues;
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });


    } else {
        // User wants to add client manually
        // Actually here is nothing to do
    }
    // Append JSON data to pdfChosens[]
    let MARZA_TOTAL_TO_PDF = 0;
    JSON.forEach(el => {
        el.id = null;
        const marzaPLNBrutto = el.total - el.cena - ((el.vat / 100) * el.cena);
        el.marza = parseFloat(marzaPLNBrutto.toFixed(2));
        MARZA_TOTAL_TO_PDF += el.marza;
        pdfChosens.push(el);
    }); 

    PDFGen.generatePdf(pdfChosens, ClientData, SellerData, docNumber, typeOfDoc, MARZA_TOTAL_TO_PDF);

    // Add to PDF LIST table to show on frontend
    PdfChosen.bulkCreate(pdfChosens)
    .then(() => {
        Log.createLog('table: pdf_chosens', `Inserted successfully PDF chosen list, fileName: ${pdfChosens[0].pdfFileName}`, 2);
        res.status(200).send({
            message: 'Inserted successfully PDF chosen list'
        });
    })
    .catch(err => {
        Log.createLog('table: pdf_chosens', `Could not create chosen PDF list, err: ${err.message}`, 3);
    }); 
}

module.exports = { count, updateVatById, getById, deleteAll, deleteById, getAll, createPdfChosen, createPdfChosensFromJSON };




