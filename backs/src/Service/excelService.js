const ExcelJS = require('exceljs');

const generateExcel = (rapports, counts, filePath) => {
    return new Promise((resolve, reject) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapports Filtrés');

        // Statistiques
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = `Nombre de rapports Soumis: ${counts.Soumis}`;
        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = `Nombre de rapports Approuvée: ${counts.Approuvée}`;
        worksheet.mergeCells('A3:E3');
        worksheet.getCell('A3').value = `Nombre de rapports Rejetée: ${counts.Rejetée}`;

        // Colonnes des rapports
        worksheet.columns = [
            { header: 'Titre', key: 'titre', width: 30 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Date', key: 'date_creation', width: 15 },
            { header: 'Departement', key: 'Departement', width: 15 },
            { header: 'Provinces', key: 'Provinces', width: 15 },
        ];

        // Ajout des rapports
        rapports.forEach((rapport) => {
            worksheet.addRow({
                titre: rapport.titre,
                description: rapport.description,
                date_creation: rapport.date_creation,
                Departement: rapport.Departement.departements,
                Provinces: rapport.Departement.Provinces.provinces
            });
        });

        workbook.xlsx.writeFile(filePath)
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};

module.exports = { generateExcel };
