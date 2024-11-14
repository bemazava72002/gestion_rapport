const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Affaires, Departements, Users } = require('../../Config/db');
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')
module.exports = (app) => {
  app.post('/api/Affaire', auth, authorizeRole(['Employé']), async (req, res) => {
    const { titre, description, responsable_id, departid } = req.body;

    try {
      // Vérifier si le département existe
      const departement = await Departements.findByPk(departid);
      if (!departement) {
        const message = `Le département spécifié n'est pas présent dans la base.`;
        return res.status(404).json({ message });
      }

      // Vérifier si l'utilisateur responsable existe
      const user = await Users.findByPk(responsable_id);
      if (!user) {
        const message = `L'utilisateur spécifié n'est pas présent dans la base.`;
        return res.status(404).json({ message });
      }

      // Créer l'affaire
      const affaire = await Affaires.create({ titre, description, responsable_id, departid });

      // Réponse de succès
      const message = `L'information concernant l'affaire "${titre}" a bien été ajoutée.`;
      return res.status(201).json({ message, data: affaire });

    } catch (error) {
      // Gestion des erreurs
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      if (error instanceof UniqueConstraintError) {
        return res.status(409).json({ message: error.message, data: error });
      }

      // Autres erreurs
      const message = `L'affaire n'a pas pu être ajoutée.`;
      return res.status(500).json({ message, data: error });
    }
  });
};
