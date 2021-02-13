const PDFDocument = require('pdfkit');
const fs = require('fs'); 
const { HEADER } = require('./header');
const { TABLE } = require('./table');
const { FOOTER } = require('./footer');
const { increment_pobranePdfIlosc } = require('../../controllers/raport_widget.controller');
const { createPdfListFromJSON } = require('../../controllers/pdf_list.controller');

const pageOpts = {
    margins: {
        top: 20,
        bottom: 20,
        left: 36,
        right: 36 // 24 jest idealne TODO: dostosowac cale pdfy do tego rozmiaru
    },
    // pageNumber: 0,
};

/* 
    RECURSION - who knows
        const pow = (x, n) => {
            if (n === 1) {
                return x;
            } else {
                return x * pow(x, n - 1);
            }
        }
        console.log(pow(3, 5)); // 243 

    CLOSURE
        const increaseCounter = (function() {
            let counter = 0;

            return function() {
                counter = counter + 1;
                console.log(counter);
            }
        })();

    NAMESPACE
        if (typeof PDF === 'undefined') {
            PDF = {};
            PDF.HEADER = {};
            PDF.TABLE = {};
            PDF.FOOTER = {};
        }

        PDF.HEADER.generate = () => { // ... generate header }
*/


/**
 * Util for date
 * 
 * @return {string} date formated to string YYYY-MM-DD including dashes
 */
const __getDateOfNow = () => {
    // Get this date
    const date = new Date();
    const YYYY = date.getUTCFullYear();
    let MM = date.getMonth();
    // due to counting months from 0-11 increment month
    MM++;
    if (MM < 10) MM = '0' + MM;
    let DD = date.getDate();
    if (DD < 10) DD = '0' + DD;

    return `${YYYY}-${MM}-${DD}`;
}

const generatePdf = async (data, nabywcaObjectFromSelectForm, sprzedawcaObjectFromSelectForm, docNumber, typeOfDoc, MARZA_TOTAL_TO_PDF) => {
    let nabywca;
    const PAGE_OPTS_PASSED = null;


    // CALC TOTAL PAGES
    let countOfRows = 0, TOTAL_PAGES = 1;
    // console.table(data);
    for (let i of data) {
        countOfRows += 1; // countOfRows++ cus we start at 1 not 0
        
        // Lenght of lines
        let LoLines = Math.round(i.nazwa.length / 40);
        if (LoLines === 0) LoLines = 1;
        if (LoLines !== 1) {
            // Multiple-line product
            countOfRows += LoLines - 1;
        }
        if (countOfRows % 36 === 0) {
            // Additional page is required, 36 is maximum number of rows on 1 page
            TOTAL_PAGES += 1;
        }
    }


    let PAGE_NUMBERS = {
        currentPage: 0,
        totalPages: 1,
    }

    const doc = new PDFDocument({
        autoFirstPage: false
    });


    // Setting data: sprzedawca
    const sprzedawca = {
        nazwa: sprzedawcaObjectFromSelectForm.nazwa,
        spolka_top: sprzedawcaObjectFromSelectForm.typ,
        spolka_bot: sprzedawcaObjectFromSelectForm.typDwa,
        adres: {
            ul: sprzedawcaObjectFromSelectForm.ulicaINr,
            zip_n_post: sprzedawcaObjectFromSelectForm.kodPocztowy + ' ' + sprzedawcaObjectFromSelectForm.miasto,
        },
        NIP: sprzedawcaObjectFromSelectForm.NIP
    };
    

    // Setting data: nabywca
    // Depending whether user typed nabywca manually or selects one from <select> tag
    if (nabywcaObjectFromSelectForm === undefined || nabywcaObjectFromSelectForm === null) {
        // If user typed manually
        nabywca = {
            nazwa: data[0].pdfFileName,
            adres: {
                ul: data[0].ul,
                zip_n_post: data[0].zip + ' ' + data[0].miasto,
                pdfList__Zip: data[0].zip,
                pdfList__Miasto: data[0].miasto
            },
            NIP: data[0].NIP,
            date: __getDateOfNow()
        };
    } else {
        // If nabywca was selected
        // Append proper client data from <select> form
        nabywca = {
            nazwa: nabywcaObjectFromSelectForm.nazwa,
            adres: {
                ul: nabywcaObjectFromSelectForm.ulicaINr,
                zip_n_post: nabywcaObjectFromSelectForm.kodPocztowy + ' ' + nabywcaObjectFromSelectForm.miasto,
                pdfList__Zip: nabywcaObjectFromSelectForm.kodPocztowy,
                pdfList__Miasto: nabywcaObjectFromSelectForm.miasto
            },
            NIP: nabywcaObjectFromSelectForm.NIP,
            date: __getDateOfNow()
        };
    }


    // Calculating total to show on document
    let RazemBrutto = 0;
    data.forEach(el => {
        RazemBrutto += el.total;
    });

    let countofItems = 0;

    const rowsData = [];
    // Get countOfItems
    data.forEach(el => {
        rowsData.push(el);
        countofItems += 1;
    });

    const dateMM_YYYY = `${nabywca.date.slice(5, 7)}_${nabywca.date.slice(2, 4)}`;
    const NABYWCA = `${nabywca.nazwa.split(' ').join('_')}`;
    const nabywcaNazwaWithoutSpaces = `${typeOfDoc}_C_${docNumber}_${dateMM_YYYY}__${NABYWCA}`;

    doc.pipe(fs.createWriteStream(`resources/exports/pdf/${nabywcaNazwaWithoutSpaces}.pdf`));

    // $event handler
    doc.on('pageAdded', () => {
        PAGE_NUMBERS.currentPage += 1;
    });
    
    let isTableFinished = false;
    
    while (isTableFinished !== true) {
        doc.addPage({
            margins: {
                top: pageOpts.margins.top,
                bottom: pageOpts.margins.bottom,
                left: pageOpts.margins.left,
                right: pageOpts.margins.right
            }
        });
        let indexNumber;
        HEADER(doc, pageOpts, nabywca, sprzedawca, docNumber, typeOfDoc, PAGE_NUMBERS, TOTAL_PAGES);
        isTableFinished = TABLE(doc, pageOpts, rowsData, isTableFinished, indexNumber);
        FOOTER(doc, pageOpts, RazemBrutto);
    }

    // FInalize PDF
    doc.end();

    // Add to PDF LIST tab
    const dataForPdfListGeneration = {
        pdfFileName: JSON.pdfFileName,
        ul: nabywca.adres.ul,
        zip: nabywca.adres.pdfList__Zip,
        miasto: nabywca.adres.pdfList__Miasto,
        NIP: nabywca.NIP,
        marzaTotal: MARZA_TOTAL_TO_PDF,
        razemBrutto: RazemBrutto
    };
    createPdfListFromJSON(nabywcaNazwaWithoutSpaces, dataForPdfListGeneration);

    // Increments value of pobranePdfIlosc 
    // in TABLE raport_widget database 
    increment_pobranePdfIlosc();

};

module.exports = { generatePdf };