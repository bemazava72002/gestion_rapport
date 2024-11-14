const auth = require('../../Middlewares/auth');
const autoriseRole = require('../../Middlewares/RoleMiddleware');
const { Affaires, Dossiers } = require('../../Config/db');
const { upload } = require('../../Middlewares/uploads');

module.exports = (app) => {
  app.post(
    '/api/CreerDossier',
    auth,
    autoriseRole(['Admin', 'Responsable']),
    upload.single('fichier'),
    async (req, res) => {
      try {
        const { titre, description, affaire_id } = req.body;
        const fichier = req.file ? `/uploads/${req.file.filename}` : null;
        const { Userid } = req.user;

        // Rechercher l'affaire par son ID
        const affaire = await Affaires.findByPk(affaire_id);

        if (!affaire) {
          const message = `L'affaire n'existe pas dans la base de données`;
          return res.status(404).json({ message });
        }

        // Créer le dossier
        const dossier = await Dossiers.create({
          titre,
          description,
          affaire_id,
          auteur_id: Userid,
          fichier,
        });

        const message = `Le dossier a bien été ajouté`;
        return res.status(201).json({
          message,
          data: dossier,
        });
      } catch (error) {
        const message = `Une erreur s'est produite lors de la création du dossier`;
        return res.status(400).json({ message, error: error.message });
      }
    }
  );
};
