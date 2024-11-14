const { Rapports, Departements, Users,Provinces } = require('../../Config/db');
const auth = require('../../Middlewares/auth');
const authorizeRole = require('../../Middlewares/RoleMiddleware');
const { Op } = require('sequelize'); // Importez Op pour utiliser des opérateurs Sequelize
const path = require('path');
require('dotenv').config()
const { generatePDF } = require('../../Service/pdfService');
const { generateExcel } = require('../../Service/excelService');
module.exports = (app) => {
    app.get('/api/rapports/tous', auth, authorizeRole(['Admin']), async (req, res) => {
        try {
            const { date_debut, date_fin, provinces, departements, Statut, format } = req.query;

            const conditions = {};

            // Conditions de filtrage par date
            if (date_debut && date_fin) {
                conditions.date_creation = { [Op.between]: [new Date(date_debut), new Date(date_fin)] };
            } else if (date_debut) {
                conditions.date_creation = { [Op.gte]: new Date(date_debut) };
            } else if (date_fin) {
                conditions.date_creation = { [Op.lte]: new Date(date_fin) };
            }

            if (Statut) conditions.Statut = Statut;

            // Recherche des rapports en fonction des critères
            const rapports = await Rapports.findAll({
                where: conditions,
                include: [
                    {
                        model: Departements,
                        as: 'Departement',
                        attributes: ['departements'],
                        where: departements ? { departements: departements } : {},
                        include: [{
                            model: Provinces,
                            as: 'Provinces',
                            attributes: ['provinces'],
                            where: provinces ? { provinces: provinces } : {},
                        }]
                    },
                    { model: Users, as: 'Auteur', attributes: ['Nom'] },
                    { model: Users, as: 'Responsable', attributes: ['Nom'] }
                ]
            });

            // Comptage des rapports par statut
            const counts = {
                soumis: rapports.filter(r => r.Statut === 'Soumis').length,
                rejetée: rapports.filter(r => r.Statut === 'Rejetée').length,
                approuvée: rapports.filter(r => r.Statut === 'Approuvée').length,
            };

            // Génération du fichier en fonction du format
            if (format === 'pdf') {
                const pdfFilePath = path.join(__dirname, '../../uploads/rapport_filtre.pdf');
                await generatePDF(rapports, counts, pdfFilePath);
                
                return res.download(pdfFilePath);
            }

            if (format === 'excel') {
                const excelFilePath = path.join(__dirname, '../../uploads/rapport_filtre.xlsx');
                await generateExcel(rapports, counts, excelFilePath);
               
                return res.download(excelFilePath);
            }

            return res.status(200).json({
                message: 'Rapports récupérés avec succès.',
                data: { rapports, counts }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports:', error);
            return res.status(500).json({ message: 'Erreur interne', data: error.message });
        }
    
    });
};
