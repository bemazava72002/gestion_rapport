const { Users } = require('../../Config/db');
const { logger } = require('../../Config/logger');
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')
module.exports = (app) => {
    app.delete('/api/users/:id', auth,authorizeRole(['Admin']), async (req, res) => {
        const {id} = req.params;

        try {
            // Vérification si l'utilisateur existe
            const user = await Users.findByPk(id);
            if (!user) {
                const message = "Utilisateur introuvable";
                return res.status(404).json({ message });
            }

            // Suppression de l'utilisateur
            await user.destroy();

            // Logging
            logger.info({
                message: 'Suppression de compte',
                utilisateur: user.Nom,
                action: 'Suppression de compte',
                date: new Date(),
            });

            const message = `L'utilisateur ${user.Nom + " " + user.Prenom} a bien été supprimé`;
            return res.status(200).json({ message });

        } catch (error) {
            // Gestion des erreurs
            const message = `Impossible de supprimer l'utilisateur`;
            return res.status(500).json({ message: error.message });
        }
    });
};
