const {Rapports,Provinces,Departements,Users} = require('../Config/db')
const pdfMake = require('pdfmake');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const auth = require('../Middlewares/auth')
const authorizeRole = require('../Middlewares/RoleMiddleware')
module.exports = (app)=>{

app.get('/api/rapport/pdf' , auth, authorizeRole(['Admin']),async (req,res)=>{
    const { startDate, endDate, provinces, departements } = req.query;

    try {
        // Construire la condition pour la recherche
        let whereConditions = {};
        if (startDate && endDate) {
            whereConditions.date_creation = { [Op.between]: [startDate, endDate] };
        }
        if (provinces) {
            whereConditions['Departement.Provinces.id'] = provinces;
        }
        if (departements) {
            whereConditions['Departement.id'] = departements;
        }

        // Récupérer les rapports
        const rapports = await Rapports.findAll({
            where: whereConditions,
            include: [
                { model: Departements, include: [{ model: Provinces }] },
                { model: Users, as: 'Auteur' },
                { model: Users, as: 'Responsable' },
            ]
        });

        // Créer un PDF avec les données récupérées
        const docDefinition = {
            content: [
                { text: 'Rapport Mensuel', style: 'header' },
                { text: `Période: ${startDate} - ${endDate}`, style: 'subheader' },
                { text: 'Rapports:', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*'],
                        body: [
                            ['Titre', 'Statut', 'Date de Création', 'Auteur', 'Responsable', 'Département'],
                            ...rapports.map(rapport => [
                                rapport.titre,
                                rapport.Statut,
                                rapport.date_creation,
                                rapport.Auteur.Nom,
                                rapport.Responsable.Nom,
                                rapport.Departement.departements,
                            ])
                        ]
                    }
                }
            ],
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                subheader: { fontSize: 14, margin: [0, 10, 0, 5] },
            }
        };

        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getBuffer((buffer) => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=rapport.pdf');
            res.send(buffer);
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la génération du PDF', error });
    }
})
}