const { Rapports, Users, Departements, Dossiers, Roles,Notifications } = require('../../Config/db');
const auth = require('../../Middlewares/auth');
const authorizeRole = require('../../Middlewares/RoleMiddleware');
const { upload } = require('../../Middlewares/uploads');
const {logger} = require('../../Config/logger')
const {sendEmail} = require('../../Service/mailService')
module.exports = (app) => {
  app.post(
    '/api/rapport',
    auth,
    authorizeRole(['Employé']),
    upload.single('fichier'),
    async (req, res) => {
       const fichier = req.file ? `/uploads/${req.file.filename}` : null;
      const { titre, description, type, responsable, recommandation } = req.body;
      const { Userid, departID } = req.user; // ID de l'utilisateur connecté

      try {
        const user = await Users.findOne({
          where: { id: Userid, departement_id: departID },
        });
        
        if (!user) {
          return res.status(404).json({
            message: "L'identifiant de l'utilisateur connecté est introuvable dans la base de données.",
          });
        }
        // Récupérer le rôle de Responsable
        const roleResponsable = await Roles.findOne({ where: { role: 'Responsable' } ,attributes:['id']});
       
        if (!roleResponsable) {
          return res.status(404).json({ message: "Le rôle 'Responsable' est introuvable." });
        }

        // Récupérer l'utilisateur connecté
       


        // Récupérer le responsable pour le département de l'auteur
        const responsable = await Users.findOne({
          where: { departement_id: departID, role_id: roleResponsable.id },
        });
        
        if (!responsable) {
          return res.status(404).json({ message: "Aucun responsable trouvé pour ce département." });
        }

        // Log des données avant la création
        console.log('Données du rapport:', {
          titre,
          description,
          type,
          depart_id: user.departement_id,
          auteur_id: user.id,
          responsable: responsable.id , // Assigner le responsable ici
          fichier,
          recommandation,
        });

        // Création du rapport avec les informations correctes
        const rapport = await Rapports.create({
          titre,
          description,
          type,
          depart_id: user.departement_id,
          auteur_id: user.id,
          responsable: responsable.id, // Assigner le responsable ici
          fichier,
          recommandation,
        });
        await Notifications.create({
          titre: 'Rapports',
          Contenue:  `Nouveau rapport soumis par ${user.Nom}: ${titre}.`,
          reçu_par: responsable.id,
          types: 'Creation_rapport'


        });
        logger.info({
          message: 'Création de rapport',
          utilisateur: user.Nom,
          action: 'Création de rapport',
          details: {
            titre,
            description,
            responsable: responsable.Nom,
            
          },
          date: new Date(),
        });
        const emailMessage = `Un nouveau rapport intitulé ${titre}  ${rapport.type} a été créé par ${user.Nom}. Veuillez le consulter: ${process.env.HOST_FRONT}/Resrapport  `;
        await sendEmail(responsable.Email,
           'Notification de Création de Rapport', 
           emailMessage);

        
        return res.status(201).json({
          message: "Le rapport a été soumis avec succès.",
          data: rapport,
          
            id: responsable.id,
            nom:responsable.Nom,

         
        });
      } catch (error) {
        console.error('Erreur lors de la soumission du rapport:', error);
        return res.status(500).json({
          message: "Erreur lors de la soumission du rapport",
          error: error.message,
        });
      }
    }
  );
};
