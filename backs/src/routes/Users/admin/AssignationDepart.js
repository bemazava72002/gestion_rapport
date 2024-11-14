const { Users, Departements } = require('../../../Config/db');
const auth = require('../../../Middlewares/auth');
const authorizeRole = require('../../../Middlewares/RoleMiddleware');

module.exports = (app) => {
    // Route pour assigner un departement (accessible uniquement par un administrateur)
    app.patch('/api/assignDepart/:id', auth, authorizeRole(['Admin']), async (req, res) => {
        const userId = req.params.id; // Récupérer l'identifiant de l'utilisateur depuis l'URL
        const { departement_id } = req.body;

        try {
            // Vérifiez si l'utilisateur existe
            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            // Vérifiez si le departement existe
            const depart = await Departements.findByPk(departement_id);
            if (!depart) {
                return res.status(404).json({ message: "Rôle non trouvé" });
            }

            // Mettre à jour le departement_id de l'utilisateur
            user.departement_id = depart.id;
            await user.save();

            return res.status(200).json({ message: "le departement assigné avec succès", data: user });
        } catch (error) {
            console.error("Erreur lors de l'assignation du rôle :", error); // Log de l'erreur
            return res.status(500).json({ message: "L'assignation du rôle a échoué", error: error.message });
        }
    });
};
