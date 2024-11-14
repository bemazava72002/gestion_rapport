const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Provinces, Departements } = require('../../Config/db');

module.exports = (app) => {
  app.put('/api/departement/:id', async (req, res) => {
    const id = req.params.id;
    const { departements, province_id } = req.body;

    try {
      // Vérifier si la province existe
      const province = await Provinces.findByPk(province_id);
      if (!province) {
        const message = `La province spécifiée n'est pas présente dans la base de données.`;
        return res.status(404).json({ message });
      }

      // Mettre à jour le département
      await Departements.update({ departements, province_id }, {
        where: { id: id }
      });

      // Récupérer et retourner le département mis à jour
      const updatedDepartement = await Departements.findByPk(id);
      if (!updatedDepartement) {
        const message = `Le département avec l'ID ${id} n'existe pas.`;
        return res.status(404).json({ message });
      }

      const message = `Le département a bien été modifié : ${departements}`;
      return res.status(200).json({ message, data: updatedDepartement });

    } catch (error) {
      // Gestion des erreurs de validation et de contrainte unique
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      if (error instanceof UniqueConstraintError) {
        return res.status(409).json({ message: error.message, data: error });
      }

      // Gestion des autres erreurs
      const message = `Le département n'a pas pu être mis à jour.`;
      return res.status(500).json({ message, data: error.message });
    }
  });
};
