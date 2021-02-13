const configSprzedawca = require('../../config/pdf-sprzedawca.config');
/**
 * HEADER
 * @function sprzedawcaRect(doc, pageOpts)
 * @function proFormaTitleRect(doc, pageOpts)
 * @function nrFVText(doc, pageOpts)
 * @function dataWystawienia(doc, pageOpts)
 * @function pagesText(doc, pageOpts)
 * @function nabywcaText(doc, pageOpts)
 * @function odbiorcaText(doc, pageOpts)
 * 
 * @param {PDFDocument} doc 
 * @param {object} pageOpts 
 */
const HEADER = (doc, pageOpts, nabywca, sprzedawca, docNumber, typeOfDoc, PAGE_NUMBERS, TOTAL_PAGES) => {
    // Add 'Sprzedawca rect'
    sprzedawcaRect(doc, pageOpts, nabywca, sprzedawca);
    
    // Add name eg. Faktura Pro Forma
    titleRect(doc, pageOpts, nabywca, typeOfDoc);
    
    // Add nr FV/FPF
    nrFVText(doc, pageOpts, nabywca, docNumber, typeOfDoc);

    // Add date of submition
    dataWystawienia(doc, pageOpts, nabywca);

    // Add pages
    pagesText(doc, pageOpts, nabywca, PAGE_NUMBERS, TOTAL_PAGES);

    // Add 'Nabywca:' text 
    // and description below
    nabywcaText(doc, pageOpts, nabywca);

    // Add 'Odbiorca:' text 
    // and description below
    odbiorcaText(doc, pageOpts, nabywca);
}

function odbiorcaText(doc, pageOpts, nabywca) {
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text(`Odbiorca:`, pageOpts.margins.left + 240, pageOpts.margins.top + 114);
        
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text(nabywca.nazwa, pageOpts.margins.left + 240, pageOpts.margins.top + 127, { lineGap: -13 });
    doc.moveDown();
    doc.text('', { lineGap: -13 });
    doc.moveDown();
    if (nabywca.adres.ul !== '' && nabywca.adres.ul !== undefined) {
        doc.text(nabywca.adres.ul, { lineGap: -13 });
    }
    doc.moveDown();
    if (nabywca.adres.pdfList__Zip === undefined && nabywca.adres.pdfList__Miasto !== undefined) {
        // If only miasto is typed => print only miasto 
        doc.text(nabywca.adres.pdfList__Miasto, { lineGap: -13 });
    } else if (nabywca.adres.pdfList__Miasto === undefined && nabywca.adres.pdfList__Zip !== undefined) {
        // If only zip code is typed => print only zip
        doc.text(nabywca.adres.pdfList__Zip, { lineGap: -13 });
    } else if (nabywca.adres.pdfList__Miasto !== undefined && nabywca.adres.pdfList__Zip !== undefined) {
        // If zip and miasto is typed => print both
        doc.text(nabywca.adres.pdfList__Zip + ' ' + nabywca.adres.pdfList__Miasto, { lineGap: -13 });
    } else {
        // If nothing is typed => print nothing
    }
    doc.moveDown();
    if (nabywca.NIP !== '' && nabywca.NIP !== undefined) {
        doc.text(`NIP: ${nabywca.NIP}`, { lineGap: -13 });
    }
}

function nabywcaText(doc, pageOpts, nabywca) {
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text(`Nabywca:`, pageOpts.margins.left, pageOpts.margins.top + 114);
        
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text(nabywca.nazwa, pageOpts.margins.left, pageOpts.margins.top + 127, { lineGap: -13 });
    doc.moveDown();
    doc.text('', { lineGap: -13 });
    doc.moveDown();
    if (nabywca.adres.ul !== '' && nabywca.adres.ul !== undefined) {
        doc.text(nabywca.adres.ul, { lineGap: -13 });
    }
    doc.moveDown();
    if (nabywca.adres.pdfList__Zip === undefined && nabywca.adres.pdfList__Miasto !== undefined) {
        // If only miasto is typed => print only miasto 
        doc.text(nabywca.adres.pdfList__Miasto, { lineGap: -13 });
    } else if (nabywca.adres.pdfList__Miasto === undefined && nabywca.adres.pdfList__Zip !== undefined) {
        // If only zip code is typed => print only zip
        doc.text(nabywca.adres.pdfList__Zip, { lineGap: -13 });
    } else if (nabywca.adres.pdfList__Miasto !== undefined && nabywca.adres.pdfList__Zip !== undefined) {
        // If zip and miasto is typed => print both
        doc.text(nabywca.adres.pdfList__Zip + ' ' + nabywca.adres.pdfList__Miasto, { lineGap: -13 });
    } else {
        // If nothing is typed => print nothing
    }
    doc.moveDown();
    if (nabywca.NIP !== '' && nabywca.NIP !== undefined) {
        doc.text(`NIP: ${nabywca.NIP}`, { lineGap: -13 });
    }
}

function pagesText(doc, pageOpts, nabywca, PAGE_NUMBERS, TOTAL_PAGES) {
    doc.font(configSprzedawca.font.family_regular)
        .fontSize(9)
        .fill(configSprzedawca.font.color)
        .text(`Strona:`, pageOpts.margins.left + 410, pageOpts.margins.top + 74);

    doc.font(configSprzedawca.font.family_bold)
        .text(`${PAGE_NUMBERS.currentPage}/${TOTAL_PAGES}`, pageOpts.margins.left + 507, pageOpts.margins.top + 74);
}

function dataWystawienia(doc, pageOpts, nabywca) {
    doc.font(configSprzedawca.font.family_regular)
        .fontSize(9)
        .fill(configSprzedawca.font.color)
        .text(`Data wystawienia:`, pageOpts.margins.left + 240, pageOpts.margins.top + 51);

    doc.font(configSprzedawca.font.family_bold)
        .text(nabywca.date, pageOpts.margins.left + 475, pageOpts.margins.top + 51);
}

function nrFVText(doc, pageOpts, nabywca, docNumber, typeOfDoc) {
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(10)
        .fill(configSprzedawca.font.color)
        .text(`nr ${typeOfDoc}/C/${docNumber}/${nabywca.date.slice(5, 7)}/${nabywca.date.slice(0, 4)}`, pageOpts.margins.left + 335, pageOpts.margins.top + 20);
}

function titleRect(doc, pageOpts, nabywca, typeOfDoc) {
    doc.lineJoin('miter')
        .rect(pageOpts.margins.left + 240, pageOpts.margins.top, 283, 18)
        .fill('#C0C0C0');

    // Doc Name - text
    if (typeOfDoc === 'FPF') {
        doc.font(configSprzedawca.font.family_bold)
            .fontSize(12)
            .fill(configSprzedawca.font.color)
            .text('Faktura Pro Forma', pageOpts.margins.left + 325, pageOpts.margins.top);
    }
    

}

function sprzedawcaRect(doc, pageOpts, nabywca, sprzedawca) {
    // Adds border-box
    doc.lineJoin('miter')
        .rect(pageOpts.margins.left, pageOpts.margins.top, 235, 74)
        .stroke();

// Sprzedawca
    // Sprzedawca - white-box    
    doc.lineJoin('miter')
        .rect(pageOpts.margins.left + 5, pageOpts.margins.top - 5, 60, 10)
        .fill('#FFFFFF');

    // Sprzedawca - text
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text('Sprzedawca', pageOpts.margins.left + 10, pageOpts.margins.top - 6);

// Sprzedawca > Description in box
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text(sprzedawca.nazwa, pageOpts.margins.left + 3, pageOpts.margins.top + 5, { lineGap: -13 });
    doc.moveDown();
    doc.text(sprzedawca.spolka_top, { lineGap: -13 });
    doc.moveDown();
    doc.text(sprzedawca.spolka_bot, { lineGap: -13 });
    doc.moveDown();
    doc.text(sprzedawca.adres.ul, { lineGap: -13 });
    doc.moveDown();
    doc.text(sprzedawca.adres.zip_n_post, { lineGap: -13 });
    doc.moveDown();
    doc.text(sprzedawca.NIP, { lineGap: -13 });
}

module.exports = { HEADER };