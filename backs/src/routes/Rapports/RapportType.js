// Dans votre fichier de routes ou de contrôleurs
const { Rapports } = require('../../Config/db');
const auth = require('../../Middlewares/auth')
module.exports = (app) => {
    // Route pour récupérer les types de rapports
    app.get('/api/rapport/types', auth,  async (req, res) => {
        try {
            const types = Rapports.rawAttributes.type.values; // Récupérer les valeurs ENUM
            return res.status(200).json(types);
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la récupération des types de rapport", error: error.message });
        }
    });
};
