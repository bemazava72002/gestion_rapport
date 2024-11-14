const { Rapports, Provinces, Departements, Users } = require('../Config/db');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const auth = require('../Middlewares/auth');
const authorizeRole = require('../Middlewares/RoleMiddleware');

module.exports = (app) => {
  app.get('/api/rapport/generate', auth, authorizeRole(['Admin']), async (req, res) => {
    const { startDate, endDate, provinces, departements, Statut, format } = req.query;

    try {
      // Construire la condition pour la recherche
      let whereConditions = {};

      // Filtrage par date
      if (startDate && endDate) {
        whereConditions.date_creation = { [Op.between]: [startDate, endDate] };
      }

      // Filtrage par province
      if (provinces) {
        whereConditions['Departement.Province.id'] = provinces;  // Vérifiez votre modèle pour la bonne relation
      }

      // Filtrage par département
      if (departements) {
        whereConditions['Departement.id'] = departements;
      }

      // Filtrage par statut
      if (Statut) {
        whereConditions.Statut = Statut; // Filtrer selon les statuts (soumis, approuvé, rejeté)
      }

      // Récupérer les rapports filtrés
      const rapports = await Rapports.findAll({
        where: whereConditions,
        include: [
          { model: Departements,as:'Departement', include: [{ model: Provinces ,as:'Provinces'}] },
          { model: Users, as: 'Auteur' },
          { model: Users, as: 'Responsable' },
        ]
      });

      // Comptage des rapports par statut
      const countStats = {
        soumis: 0,
        approuve: 0,
        rejete: 0,
      };

      rapports.forEach((rapport) => {
        if (rapport.Statut === 'Soumis') {
          countStats.soumis += 1;
        } else if (rapport.Statut === 'Approuvée') {
          countStats.approuve += 1;
        } else if (rapport.Statut === 'Rejetée') {
          countStats.rejete += 1;
        }
      });

      if (format === 'excel') {
        // Générer un fichier Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapports');

        worksheet.columns = [
          { header: 'Titre', key: 'titre', width: 30 },
          { header: 'Statut', key: 'Statut', width: 15 },
          { header: 'Date de Création', key: 'date_creation', width: 20 },
          { header: 'Auteur', key: 'auteur', width: 25 },
          { header: 'Responsable', key: 'responsable', width: 25 },
          { header: 'Département', key: 'departement', width: 25 },
        ];

        rapports.forEach((rapport) => {
          worksheet.addRow({
            titre: rapport.titre,
            Statut: rapport.Statut,
            date_creation: rapport.date_creation.toLocaleDateString(),
            Auteur: rapport.Auteur.Nom,
            Responsable: rapport.Responsable.Nom,
            Separtement: rapport.Departement.departements,  // Assurez-vous d'utiliser la bonne clé pour le département
          });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=rapports.xlsx');
        await workbook.xlsx.write(res);
        res.end();
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        const headers = ['Numéro', 'Titre', 'Statut', 'Date de Création', 'Auteur', 'Responsable', 'Département'];

        // Ajouter un titre et les critères de recherche
        doc.setFontSize(16);
        doc.text('Rapport Mensuel sur la Lutte contre la Corruption', 14, 10);
        doc.setFontSize(12);
        doc.text(`Criteres de Recherche :`, 14, 20);
        doc.text(`- Date debut : ${startDate || 'Non spécifiée'}`, 14, 30);
        doc.text(`- Date fin : ${endDate || 'Non spécifiée'}`, 14, 40);
        doc.text(`- Departement : ${departements || 'Tous'}`, 14, 50);
        doc.text(`- Province : ${provinces || 'Toutes'}`, 14, 60);
        doc.text('-------------------------------------------------', 14, 70);

        // Table des résultats
        const tableData = rapports.map((rapport) => [
          rapport.id,
          rapport.titre,
          rapport.statut,
          rapport.date_creation.toLocaleDateString(),
          rapport.Auteur.Nom,
          rapport.Responsable.Nom,
          rapport.Departement.departements,  // Assurez-vous d'utiliser la bonne clé pour le département
        ]);

        doc.autoTable({
          head: [headers],
          body: tableData,
          startY: 80, // Position de départ de la table
        });

        // Ajouter le nombre de rapports soumis, approuvés, rejetés
        doc.text(`Nombre de rapports :`, 14, doc.lastAutoTable.finalY + 10);
        doc.text(`- Soumis : ${countStats.soumis}`, 14, doc.lastAutoTable.finalY + 20);
        doc.text(`- Approuves : ${countStats.approuve}`, 14, doc.lastAutoTable.finalY + 30);
        doc.text(`- Rejetes : ${countStats.rejete}`, 14, doc.lastAutoTable.finalY + 40);

        // Générer et envoyer le PDF
        const pdfOutput = doc.output();
        res.contentType('application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=rapport_mensuel.pdf');
        res.send(pdfOutput);
      } else {
        res.status(400).json({ message: 'Format non pris en charge' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la génération du fichier', error: error.message });
    }
  });
};