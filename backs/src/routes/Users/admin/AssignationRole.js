const { Users, Roles } = require('../../../Config/db');
const auth = require('../../../Middlewares/auth');
const authorizeRole = require('../../../Middlewares/RoleMiddleware');

module.exports = (app) => {
    // Route pour assigner un rôle (accessible uniquement par un administrateur)
    app.patch('/api/assignation/:id', auth, authorizeRole(['Admin']), async (req, res) => {
        const userId = req.params.id; // Récupérer l'identifiant de l'utilisateur depuis l'URL
        const { role_id } = req.body;

        try {
            // Vérifiez si l'utilisateur existe
            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            // Vérifiez si le rôle existe
            const role = await Roles.findByPk(role_id);
            if (!role) {
                return res.status(404).json({ message: "Rôle non trouvé" });
            }

            // Mettre à jour le role_id de l'utilisateur
            user.role_id = role.id;
            await user.save();

            return res.status(200).json({ message: "Rôle assigné avec succès", data: user });
        } catch (error) {
            console.error("Erreur lors de l'assignation du rôle :", error); // Log de l'erreur
            return res.status(500).json({ message: "L'assignation du rôle a échoué", error: error.message });
        }
    });
};
