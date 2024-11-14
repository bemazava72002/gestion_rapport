const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Provinces, Departements } = require('../../Config/db');
const auth = require('../../Middlewares/auth');
const autoriseRole = require('../../Middlewares/RoleMiddleware');

module.exports = (app) => {
  app.post('/api/departements', async (req, res) => {
    const { departements, province_id } = req.body;
    try {
      // Utilisez `await` pour obtenir la province
      const province = await Provinces.findByPk(province_id);

      if (!province) {
        const message = `La province n'est pas présente dans la base`;
        return res.status(404).json({ message });
      }

      // Créez le département
      const nouveauDepartement = await Departements.create({ departements, province_id });

      const message = `L'information concernant le département ${departements} a bien été ajoutée`;
      return res.status(201).json({ message, data: nouveauDepartement });

    } catch (error) {
      // Gérer les erreurs spécifiques de Sequelize
      if (error instanceof ValidationError) {
        const message = `Erreur de validation`;
        return res.status(400).json({ message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        const message = `Violation de contrainte d'unicité`;
        return res.status(400).json({ message, data: error.errors });
      }

      // Gérer les autres erreurs
      const message = `Le département ne peut être ajouté`;
      return res.status(500).json({ message, data: error });
    }
  });
};
