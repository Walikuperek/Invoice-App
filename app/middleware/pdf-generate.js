const PDFDocument = require('pdfkit');
const fs = require('fs'); 

const configSprzedawca = require('../config/pdf-sprzedawca.config');

const doc = new PDFDocument({
    autoFirstPage: false
});

const pageOpts = {
    margins: {
        top: 20,
        bottom: 20,
        left: 36,
        right: 0
    },
    pageNumber: 0,
};


const generatePdf = async (data) => {

    const nabywca = {
        nazwa: data[0].pdfFileName,
        adres: {
            ul: data[0].ul,
            zip_n_post: data[0].zip + ' ' + data[0].miasto,
        },
        NIP: data[0].NIP,
        date: data[0].createdAt.slice(0, 10)
    };

    let RazemBrutto = 0;
    data.forEach(el => {
        RazemBrutto += el.total;
    });

    let countofItems = 0;

    // Get countOfItems
    data.forEach(el => {
        countofItems += 1;
        console.log(countofItems, el);
    });

    // ADD RAPORT HOOK TO RazemBrutto !!!!!!!                                           <<<<<----<<

    const nabywcaNazwaWithoutSpaces = nabywca.nazwa.split(' ').join('_');

    // --prod
    // doc.pipe(fs.createWriteStream(`/home/p565026/public_html/public_resources/exports/pdf/${nabywcaNazwaWithoutSpaces}.pdf`));

    // --dev
    doc.pipe(fs.createWriteStream(`resources/exports/pdf/${nabywcaNazwaWithoutSpaces}.pdf`));

    // $event
    doc.on('pageAdded', () => {
        pageOpts.pageNumber += 1;
    });
    
    doc.addPage({
        margins: {
            top: pageOpts.margins.top,
            bottom: pageOpts.margins.bottom,
            left: pageOpts.margins.left,
            right: pageOpts.margins.right
        }
    });

    HEADER(doc, pageOpts, nabywca);

    TABLE(doc, pageOpts);

    FOOTER(doc, pageOpts, RazemBrutto);

    // FInalize PDF
    doc.end();
    

};

/**
 * FOOTER
 * @function razemDoZaplatyRect
 * @function signLines
 * 
 * @param {PDFDocument} doc 
 * @param {object} pageOpts 
 */
function FOOTER(doc, pageOpts, RazemBrutto) {
    // Add header row - border-box
    razemDoZaplatyRect(doc, pageOpts, RazemBrutto);
    signLines(doc, pageOpts);
}

function razemDoZaplatyRect(doc, pageOpts, RazemBrutto) {
    doc.lineJoin('miter')
        .rect(pageOpts.margins.left, 733 - 71.15, 595.28 - pageOpts.margins.left - pageOpts.margins.right, 18)
        .fill('#C0C0C0');

    // Razem do zaplaty - text
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(9)
        .fill(configSprzedawca.font.color)
        .text('Razem do zapłaty', pageOpts.margins.left + 3, 736 - 70.15);
    
    doc.text(`${RazemBrutto} PLN`, 595.28 - pageOpts.margins.left - 180 - pageOpts.margins.right, 736 - 71.15, { 
            width: 210,
            align: 'right',
            lineGap: -10,
        })
        .font(configSprzedawca.font.family_italic)
        .moveDown()
        .text(`Słownie: trzy tys. sto pięćdziesiąt cztery PLN 85/100`, { 
            width: 210,
            align: 'right',
            lineGap: -10,
        });

}

function signLines(doc, pageOpts) {
    // Main line above signs
    doc.moveTo(pageOpts.margins.left, 733  - pageOpts.margins.top)
        .lineTo(595.28 - pageOpts.margins.right, 733  - pageOpts.margins.top)
        .stroke();

    // Uprawniony do wystawienia FV
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(configSprzedawca.font.size)
        .fill(configSprzedawca.font.color)
        .text(`Wojciech Jasiński`, pageOpts.margins.left, 733 - pageOpts.margins.top + 1.15, { 
            width: 179,
            align: 'center',
            lineGap: -10,
        })
        .moveDown()
        .font(configSprzedawca.font.family_regular)
        .fontSize(7)
        .text('Podpis osoby uprawnionej do wystawienia faktury', { 
            width: 179,
            align: 'center',
            lineGap: -10,
        });
    
    // Data odbioru
    doc.moveTo(pageOpts.margins.left + 2, 733 - pageOpts.margins.top + 14)
        .lineTo(pageOpts.margins.right + 179, 733 - pageOpts.margins.top + 14)
        .stroke();

        doc.font(configSprzedawca.font.family_regular)
        .fontSize(7)
        .fill(configSprzedawca.font.color)
        .text(`Data odbioru`, pageOpts.margins.left + 208, 733 - pageOpts.margins.top + 17.15, { 
            width: 109,
            align: 'center',
            lineGap: -10,
        });
    
    doc.moveTo(pageOpts.margins.left + 208, 733 - pageOpts.margins.top + 14)
        .lineTo(pageOpts.margins.right + 317, 733 - pageOpts.margins.top + 14)
        .stroke();

    // Odbior FV
    doc.font(configSprzedawca.font.family_regular)
        .fontSize(7)
        .fill(configSprzedawca.font.color)
        .text(`Podpis osoby uprawnionej do odbioru faktury`, pageOpts.margins.left + 343, 733 - pageOpts.margins.top + 15.15, { 
            width: 176,
            align: 'center',
            lineGap: -10,
        });
    
    doc.moveTo(pageOpts.margins.left + 336, 733 - pageOpts.margins.top + 14)
        .lineTo(595 - pageOpts.margins.left - 3, 733 - pageOpts.margins.top + 14)
        .stroke();
}

// 111-173
// 
/**
 * TABLE
 * @function headerTable
 * 
 * @param {PDFDocument} doc 
 * @param {object} pageOpts 
 */
function TABLE(doc, pageOpts) {
    // Add header row - border-box
    headerTable(doc, pageOpts);
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
function HEADER(doc, pageOpts, nabywca) {
    // Add 'Sprzedawca rect'
    sprzedawcaRect(doc, pageOpts, nabywca);
    
    // Add name eg. Faktura Pro Forma
    proFormaTitleRect(doc, pageOpts, nabywca);
    
    // Add nr FV/FPF
    nrFVText(doc, pageOpts, nabywca);

    // Add date of submition
    dataWystawienia(doc, pageOpts, nabywca);

    // Add pages
    pagesText(doc, pageOpts, nabywca);

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
    doc.text(nabywca.adres.ul, { lineGap: -13 });
    doc.moveDown();
    doc.text(nabywca.adres.zip_n_post, { lineGap: -13 });
    if (nabywca.NIP !== '') {
        doc.moveDown();
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
    doc.text(nabywca.adres.ul, { lineGap: -13 });
    doc.moveDown();
    doc.text(nabywca.adres.zip_n_post, { lineGap: -13 });
    if (nabywca.NIP !== '') {
        doc.moveDown();
        doc.text(`NIP: ${nabywca.NIP}`, { lineGap: -13 });
    }
}

function pagesText(doc, pageOpts, nabywca) {
    doc.font(configSprzedawca.font.family_regular)
        .fontSize(9)
        .fill(configSprzedawca.font.color)
        .text(`Strona:`, pageOpts.margins.left + 410, pageOpts.margins.top + 74);

    doc.font(configSprzedawca.font.family_bold)
        .text(`1/${pageOpts.pageNumber}`, pageOpts.margins.left + 507, pageOpts.margins.top + 74);
}

function dataWystawienia(doc, pageOpts, nabywca) {
    doc.font(configSprzedawca.font.family_regular)
        .fontSize(9)
        .fill(configSprzedawca.font.color)
        .text(`Data wystawienia:`, pageOpts.margins.left + 240, pageOpts.margins.top + 51);

    doc.font(configSprzedawca.font.family_bold)
        .text(nabywca.date, pageOpts.margins.left + 475, pageOpts.margins.top + 51);
}

function nrFVText(doc, pageOpts, nabywca) {
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(10)
        .fill(configSprzedawca.font.color)
        .text(`nr FPF/C/1/${nabywca.date.slice(5, 7)}/${nabywca.date.slice(0, 4)}`, pageOpts.margins.left + 335, pageOpts.margins.top + 20);
}

function proFormaTitleRect(doc, pageOpts) {
    doc.lineJoin('miter')
        .rect(pageOpts.margins.left + 240, pageOpts.margins.top, 283, 18)
        .fill('#C0C0C0');

    // Doc Name - text
    doc.font(configSprzedawca.font.family_bold)
        .fontSize(12)
        .fill(configSprzedawca.font.color)
        .text('Faktura Pro Forma', pageOpts.margins.left + 325, pageOpts.margins.top);
}

function sprzedawcaRect(doc, pageOpts) {
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
        .text(configSprzedawca.sprzedawca.nazwa, pageOpts.margins.left + 3, pageOpts.margins.top + 5, { lineGap: -13 });
    doc.moveDown();
    doc.text(configSprzedawca.sprzedawca.spolka_top, { lineGap: -13 });
    doc.moveDown();
    doc.text(configSprzedawca.sprzedawca.spolka_bot, { lineGap: -13 });
    doc.moveDown();
    doc.text(configSprzedawca.sprzedawca.adres.ul, { lineGap: -13 });
    doc.moveDown();
    doc.text(configSprzedawca.sprzedawca.adres.zip_n_post, { lineGap: -13 });
    doc.moveDown();
    doc.text(configSprzedawca.sprzedawca.NIP, { lineGap: -13 });
}

module.exports = {
    generatePdf,
};