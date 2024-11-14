const { Departements } = require('../../Config/db');

module.exports = (app) => {
  app.get('/api/departement/:id', async (req, res) => {
    try {
      // Rechercher le département par son ID
      const departement = await Departements.findByPk(req.params.id);

      if (!departement) {
        const message = `Le département demandé n'existe pas, veuillez vérifier votre entrée.`;
        return res.status(404).json({ message });
      }

      const message = 'Le département a bien été trouvé.';
      return res.status(200).json({ message, data: departement });
    } catch (error) {
      const message = `Le département n'a pas pu être récupéré.`;
      res.status(500).json({ message, data: error.message });
    }
  });
};
