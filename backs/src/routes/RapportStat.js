const { Rapports, Provinces, Departements, Users } = require('../Config/db');
const auth = require('../Middlewares/auth');
const { Op, Sequelize } = require('sequelize');
const authorizeRole = require('../Middlewares/RoleMiddleware');

module.exports = (app) => {
    app.get('/api/rapport/stats', auth, authorizeRole(['Admin']), async (req, res) => {
        const { date_debut, date_fin, provinces, departements, Statut } = req.query;
        const conditions = {};

        try {
            // Gestion des dates
            if (date_debut && date_fin) {
                const parsedDateDebut = new Date(date_debut);
                const parsedDateFin = new Date(date_fin);
                if (isNaN(parsedDateDebut) || isNaN(parsedDateFin)) {
                    return res.status(400).json({ error: 'Invalid date format' });
                }
                conditions.date_creation = { [Op.between]: [parsedDateDebut, parsedDateFin] };
            } else if (date_debut) {
                const parsedDateDebut = new Date(date_debut);
                if (isNaN(parsedDateDebut)) {
                    return res.status(400).json({ error: 'Invalid date format' });
                }
                conditions.date_creation = { [Op.gte]: parsedDateDebut };
            } else if (date_fin) {
                const parsedDateFin = new Date(date_fin);
                if (isNaN(parsedDateFin)) {
                    return res.status(400).json({ error: 'Invalid date format' });
                }
                conditions.date_creation = { [Op.lte]: parsedDateFin };
            }

            // Gestion du statut
            if (Statut) {
                conditions.Statut = Statut;
            }

            // Création des inclusions conditionnelles
            const includeClause = [
                {
                    model: Departements,
                    as: 'Departement',
                    attributes: ['id', 'departements'],
                    ...(departements ? { where: { departements } } : {}),
                    include: [{
                        model: Provinces,
                        as: 'Provinces',
                        attributes: ['id', 'provinces'],
                        ...(provinces ? { where: { provinces } } : {}),
                    }]
                },
                { model: Users, as: 'Auteur', attributes: ['id', 'Nom'] },
                { model: Users, as: 'Responsable', attributes: ['id', 'Nom'] }
            ];

            // Statistiques par statut
            const statusStats = await Rapports.findAll({
                where: conditions,
                include: includeClause,
                attributes: [
                    'Statut',
                    [Sequelize.fn('COUNT', Sequelize.col('Rapport.Statut')), 'status_count'] // Utiliser l'alias correct
                ],
                group: [
                    'Statut',
                    'Departement.id', 'Departement.departements',
                    'Departement->Provinces.id', 'Departement->Provinces.provinces',
                    'Auteur.id', 'Auteur.Nom',
                    'Responsable.id', 'Responsable.Nom'
                ]
            });

            // Statistiques par type
            const typeStats = await Rapports.findAll({
                where: conditions,
                include: includeClause,
                attributes: [
                    'type',
                    [Sequelize.fn('COUNT', Sequelize.col('Rapport.type')), 'type_count'] // Utiliser l'alias correct
                ],
                group: [
                    'type',
                    'Departement.id', 'Departement.departements',
                    'Departement->Provinces.id', 'Departement->Provinces.provinces',
                    'Auteur.id', 'Auteur.Nom',
                    'Responsable.id', 'Responsable.Nom'
                ]
            });

            // Statistiques mensuelles
            const monthlyStats = await Rapports.findAll({
                where: conditions,
                include: includeClause,
                attributes: [
                    [Sequelize.literal("TO_CHAR(date_creation, 'YYYY-MM')"), 'month'],
                    [Sequelize.fn('COUNT', Sequelize.col('Rapport.id')), 'monthly_count'] // Utiliser l'alias correct
                ],
                group: [
                    Sequelize.literal("TO_CHAR(date_creation, 'YYYY-MM')"),
                    'Departement.id', 'Departement.departements',
                    'Departement->Provinces.id', 'Departement->Provinces.provinces',
                    'Auteur.id', 'Auteur.Nom',
                    'Responsable.id', 'Responsable.Nom'
                ],
                order: [[Sequelize.literal("TO_CHAR(date_creation, 'YYYY-MM')"), 'ASC']]
            });

            // Retour des statistiques
            return res.status(200).json({
                data: {
                   
                   
                    statusStats,
                    typeStats,
                    monthlyStats
                }
            });
        } catch (error) {
            console.error("Error fetching statistics:", error);
            res.status(500).json({ error: 'Error fetching statistics' });
        }
    });
};
