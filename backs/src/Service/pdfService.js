const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = (rapports, counts, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));

        // Titre du PDF
        doc.fontSize(18).text('Rapports Filtrés', { align: 'center' });
        doc.moveDown();

        // Statistiques
        doc.fontSize(14).text(`Nombre de rapports Soumis: ${counts.Soumis}`);
        doc.text(`Nombre de rapports Approuvée: ${counts.Approuvée}`);
        doc.text(`Nombre de rapports Rejetée: ${counts.Rejetée}`);
        doc.moveDown();

        // Détails des rapports
        rapports.forEach((rapport) => {
            doc
                .fontSize(12)
                .text(`Titre: ${rapport.titre}`)
                .text(`Description: ${rapport.description}`)
                .text(`Date: ${rapport.date_creation}`)
                .text(`departements: ${rapport.Departement.departements}`)
                .text(`provinces: ${rapport.Departement.Provinces.provinces}`)
                .moveDown();
        });

        doc.end();

        doc.on('finish', () => resolve());
        doc.on('error', (err) => reject(err));
    });
};

module.exports = { generatePDF };
