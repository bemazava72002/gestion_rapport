const { Rapports, Users, Roles,Departements } = require('../../../Config/db');
const auth = require('../../../Middlewares/auth');
const authorizeRole = require('../../../Middlewares/RoleMiddleware');
const {upload} = require('../../../Middlewares/uploads')
module.exports = (app) => {
  app.get(
    '/api/rapports/responsable',
    auth,
    authorizeRole(['Responsable']),
    

    async (req, res) => {
      const { Userid, departID } = req.user; // ID de l'utilisateur connecté (responsable)

      try {
        // Vérifier si l'utilisateur connecté est bien un responsable de département
        const user = await Users.findOne({
          where: { id: Userid },
          include: [{ model: Roles, 
            as: 'Roles', 
            where: { role: 'Responsable' } }],
        });

        if (!user) {
          return res.status(403).json({
            message: "Accès refusé : Vous n'êtes pas autorisé à voir ces rapports.",
          });
        }

        // Récupérer les rapports pour le département du responsable
        const rapports = await Rapports.findAll({
          where: { depart_id: departID },
          include: [
            {
              model: Users,
              as: 'Auteur',
              attributes: ['Nom'], // Inclure les infos sur l'auteur si nécessaire
            },
            {
              model: Departements,
              as: 'Departement',
              attributes: ['departements'], // Inclure les infos sur l'auteur si nécessaire
            },
          ],
          order: [['date_creation', 'DESC']],

         
        });

        return res.status(200).json({
          message: 'Liste des rapports pour votre département.',
          data:{ rapports}
        });
      } catch (error) {
        return res.status(500).json({
          message: "Erreur lors de la récupération des rapports.",
          error: error.message,
        });
      }
    }
  );
};
