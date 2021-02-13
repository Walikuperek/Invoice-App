// database Product schema
const db = require('../models');
const Product = db.product;
const fs = require('fs');
// const path = require('path');

const Log = require('../controllers/log_actions.controller');

/**
 *  NPM package: excel reader for extracting .xlsx into rows
 *  @function upload
 */ 
const readXlsxFile = require('read-excel-file/node');

const { update_produkty } = require('../controllers/raport_widget.controller');

/**
 * Function that:
 *  @read .xlsx file
 *  @extract extracts data into array of arrays [cols [, rows]]
 *  @generate INSERT data INTO products
 */
const upload = async (req, res) => {
  Log.createLog('insert file', `Try to insert file: ${req.file.filename}`, 4);
  try {
    if (req.file == undefined) {
      return res.status(400).send('Please upload an excel file!');
    }

    // First delete all previous records from database
    await Product.destroy({
        truncate: { cascade: true }
    })

    // Apply new records from uploaded file 
    let path = 'resources/uploads/' + req.file.filename;

    readXlsxFile(path)
    .then(rows => {
        // Remove header row
        rows.shift();
        
        const products = [];

        let productsTotal = 0;
        let productsTotalIlosc = 0;
        let productsIlosc = 0;

        rows.forEach(row => {
            let product = {
                kod: row[0],
                nazwa: row[1],
                typ: row[2],
                nrKatalogu: row[3],
                ilosc: row[4],
                rezerwacje: row[5],
                braki: row[6],
                iloscDostepna: row[7],
                cena: row[8],
                iloscMinimalna: row[10]
            };
            products.push(product);

            // Raport Widgets
            productsTotal = productsTotal + (parseFloat(row[8]) * parseFloat(row[4]));
            productsTotalIlosc += parseInt(row[4]);
            productsIlosc += 1;
        });


        Product.bulkCreate(products)
        .then(() => {
            Log.createLog('uploaded file', `Uploaded and inserted successfully file: ${req.file.filename} into 'products' table`, 4);

            // Raport Widgets
            update_produkty(productsTotal.toFixed(2), productsTotalIlosc, productsIlosc);

            res.status(200).send({
                message: 'Uploaded the file successfully: ' + req.file.originalname
            });
        })
        .catch(err => {
            Log.createLog('uploaded file', `Failed to insert data from file: ${req.file.filename} into 'products' table`, 3);
            res.status(500).send({
                message: 'Fail to import data into database',
                error: err.message
            });
        });
    })
    .catch(err => {
        res.status(404).send({
            message: err.message
        });
    });
} catch (error) {
    Log.createLog('uploaded file', `Failed to upload file: ${req.file.filename}`, 3);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getExcelFilesList = (req, res) => {
    const directoryPath = 'resources/uploads/';
    let listOfExcelFiles = {};
    const list = [];

    const excelFileList = fs.readdir(directoryPath, (err, files) => {
        if (err) { 
            Log.createLog('excel files', 'Cannot get excel file list', 3);
            return res.status(500).send({ message: err.message });
        }

        files.forEach(el => {
            list.push(el);
        });

        res.write(JSON.stringify(list));
    });
    
};


module.exports = {
  upload,
  getExcelFilesList
};
