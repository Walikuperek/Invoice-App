const configSprzedawca = require('../../config/pdf-sprzedawca.config');

/**
 * TABLE
 * @function headerTable
 * 
 * @param {PDFDocument} doc 
 * @param {object} pageOpts 
 */
const TABLE = (doc, pageOpts, rowsData, PAGE_OPTS_PASSED = null, indexNumber) => {
    // Add header row - border-box
    headerTable(doc, pageOpts);

    const isGeneratingDocumentFinished = rowsTable(doc, pageOpts, rowsData, PAGE_OPTS_PASSED, indexNumber);
    if (isGeneratingDocumentFinished === true) {
        // If it returns object instead of true
        // Then return object and pass it to index,
        // It is required for generating another page
        return true;
    } else if (typeof isGeneratingDocumentFinished === 'object') {
        return isGeneratingDocumentFinished;
    }
}

function rowsTable(doc, pageOpts, rowsData, PAGE_OPTS_PASSED = null, indexNumber = 0) {
    let ROWS_COUNT = 0;

    // Defines empty object for fill
    let PAGE_OPTS = {};

    if (typeof PAGE_OPTS_PASSED === 'object') {
        // If this is another page
        PAGE_OPTS = PAGE_OPTS_PASSED;
    } else {
        // If this is brand new document
        PAGE_OPTS = {
            reqPages: 1, // Init with 1 page req
            productsShowed: 0,
        };
    }

    let iterator = PAGE_OPTS.productsShowed || 0;
    indexNumber = PAGE_OPTS.productsShowed || 0;
    for (iterator; iterator < rowsData.length; iterator++) {
        ROWS_COUNT += 1; // ROWS_COUNT++ cus we start at 1 not 0
        indexNumber += 1;
        
        const row = printRow(doc, pageOpts, rowsData[iterator], ROWS_COUNT, indexNumber);
        // If returned value was bigger than 1 line
        // then add to nex printRow() exceeded number of lines
        if (row !== 1) {
            // Multiple-line product
            ROWS_COUNT += row - 1;
        }
        if (ROWS_COUNT % 36 === 0) {
            // Additional page is required, 36 is maximum number of rows on 1 page
            PAGE_OPTS.reqPages += 1;
            // How many lines were printed before
            PAGE_OPTS.productsShowed += indexNumber;
            return PAGE_OPTS;
        }
    }
    // Return true to indicate that there is no need of creating additional page
    // Generating doc is finished
    return true;
}

function printRow(doc, pageOpts, rowData, index, indexNumber) {
    const DISTANCE_FROM_TOP = 196;
    const LINE_HEIGHT = 12;

    // Add header texts
    doc.font(configSprzedawca.font.family_regular)
        .fontSize(9)
        .fill(configSprzedawca.font.color)
        .text(`${indexNumber}`, pageOpts.margins.left + 3, pageOpts.margins.top + DISTANCE_FROM_TOP + (LINE_HEIGHT * index));

    
    // Calc lengthOfLines
    let LoLines = Math.round(rowData.nazwa.length / 40);
    if (LoLines === 0) LoLines = 1;

    doc.text(`${rowData.nazwa}`, pageOpts.margins.left + 25, pageOpts.margins.top + DISTANCE_FROM_TOP + (LINE_HEIGHT * index), { 
        width: 200,
        height: LINE_HEIGHT * LoLines,
        align: 'left'
    });

    doc.text(`${rowData.ilosc}`,pageOpts.margins.left + 278, pageOpts.margins.top + DISTANCE_FROM_TOP + (LINE_HEIGHT * index), { 
        width: 20,
        align: 'right'
    });

    doc.text(`${rowData.jednostkaMiary}`,pageOpts.margins.left + 316, pageOpts.margins.top + DISTANCE_FROM_TOP + (LINE_HEIGHT * index), { 
        width: 15,
        align: 'right'
    });

    doc.text(`${rowData.vat}%`, pageOpts.margins.left + 353, pageOpts.margins.top + DISTANCE_FROM_TOP + (LINE_HEIGHT * index));

    doc.text(`${rowData.cena.toFixed(2)}`,pageOpts.margins.left + 391, pageOpts.margins.top + DISTANCE_FROM_TOP + (LINE_HEIGHT * index), { 
        width: 50,
        align: 'right'
    });

    doc.text(`${rowData.total.toFixed(2)}`,pageOpts.margins.left + 456, pageOpts.margins.top + DISTANCE_FROM_TOP + (LINE_HEIGHT * index), { 
        width: 65,
        align: 'right'
    });

    // return number/length of lines required for printing this exact line of product
    return LoLines;
}

function headerTable(doc, pageOpts) {
    // Add border-box
    doc.lineJoin('miter')
        .rect(pageOpts.margins.left, pageOpts.margins.top + 193, 595.28 - pageOpts.margins.left - pageOpts.margins.right, 15)
        .stroke();

    // Add header texts
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text(`L.p.`, pageOpts.margins.left + 3, pageOpts.margins.top + 194);

    doc.text(`Nazwa towaru/usługi`, pageOpts.margins.left + 25, pageOpts.margins.top + 194);

    doc.text(`PKWiU`, pageOpts.margins.left + 208, pageOpts.margins.top + 194);

    doc.text(`Ilość`, pageOpts.margins.left + 278, pageOpts.margins.top + 194);

    doc.text(`J.m.`, pageOpts.margins.left + 316, pageOpts.margins.top + 194);

    doc.text(`VAT`, pageOpts.margins.left + 353, pageOpts.margins.top + 194);

    doc.text(`Cena brutto`, pageOpts.margins.left + 391, pageOpts.margins.top + 194);

    doc.text(`Wartość brutto`, pageOpts.margins.left + 456, pageOpts.margins.top + 194);
}

module.exports = { TABLE };