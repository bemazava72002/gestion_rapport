const { Users} = require('../../../Config/db');
const auth = require('../../../Middlewares/auth');
const {logger} = require('../../../Config/logger')
const {sendEmail} = require('../../../Service/mailService')
const authorizeRole = require('../../../Middlewares/RoleMiddleware');
require('dotenv').config()
module.exports = (app) => {
    // Route pour assigner un departement (accessible uniquement par un administrateur)
    app.patch('/api/ActiveCompte/:id', auth, authorizeRole(['Admin']), async (req, res) => {
        const userId = req.params.id; // Récupérer l'identifiant de l'utilisateur depuis l'URL
        const { isActive } = req.body;

        try {
            // Vérifiez si l'utilisateur existe
            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            user.isActive = isActive;
            
                await user.save();
                logger.info({
                    message: `le compte de l'utilisateur ${user.Nom}`,
                    utilisateur: user.Nom,
                    action: 'Activation du compte',
                    date: new Date(),
                  });
                  const emailMessage = `votre compte a été ${isActive==true?'activé':'desactivé'} . Vous pouvez vous connecter vers cette lien: ${process.env.HOST_FRONT}/login  `;
                  await sendEmail(user.Email,
                     'activation de compte', 
                     emailMessage);
          

                return res.status(200).json({ message: `le compte a bien été ${isActive==true? 'activé':'desactivé'}  avec succès`, data: user });

        } catch (error) {
            console.error("Erreur lors de l'activation du compte :", error); // Log de l'erreur
            return res.status(500).json({ message: "L'activation du compte a échoué", error: error.message });
        }
    });
};
