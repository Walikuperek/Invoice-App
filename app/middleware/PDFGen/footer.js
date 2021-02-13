const configSprzedawca = require('../../config/pdf-sprzedawca.config');
/**
 * FOOTER
 * @function razemDoZaplatyRect
 * @function signLines
 * 
 * @param {PDFDocument} doc 
 * @param {object} pageOpts 
 */
const FOOTER = (doc, pageOpts, RazemBrutto) => {
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
    
    doc.text(`${RazemBrutto.toFixed(2)} PLN`, 595.28 - pageOpts.margins.left - 180 - pageOpts.margins.right, 736 - 71.15, { 
            width: 210,
            align: 'right',
            lineGap: -10,
        })
        // .font(configSprzedawca.font.family_italic)
        // .moveDown()
        // .text(`Słownie: trzy tys. sto pięćdziesiąt cztery PLN 85/100`, { 
        //     width: 210,
        //     align: 'right',
        //     lineGap: -10,
        // });

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


module.exports = { FOOTER };