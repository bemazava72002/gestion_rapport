// controllers/rapportsController.js

const { Rapports } = require('../../../Config/db');
const fs = require('fs');
const path = require('path');
const auth = require('../../../Middlewares/auth')
const authorizeRole = require('../../../Middlewares/RoleMiddleware')
const { upload } = require('../../../Middlewares/uploads');
module.exports = (app)=>{
    app.patch('/api/rapports/:id', auth, 
        
        authorizeRole(['Responsable']), upload.single('fichier'), async (req, res) => {
    const { id } = req.params;
    const { titre, description} = req.body;
    const fichier = req.file; // Utiliser multer pour le téléchargement de fichiers

    try {
        const rapport = await Rapports.findByPk(id);
        if (!rapport) {
            return res.status(404).json({ message: "Rapport non trouvé" });
        }

        // Mettre à jour les champs du rapport
        rapport.titre = titre || rapport.titre;
        rapport.description = description || rapport.description;
        

        // Gérer le fichier joint
        if (fichier) {
            // Supprimer l'ancien fichier si nécessaire
            if (rapport.fichier) {
                const oldFilePath = path.join(__dirname, '..', 'uploads', rapport.fichier);
                fs.unlinkSync(oldFilePath); // Supprimer l'ancien fichier
            }
            rapport.fichier = fichier.filename; // Enregistrer le nouveau fichier
        }

        // Enregistrer les modifications
        await rapport.save();

        return res.status(200).json({ message: "Rapport mis à jour avec succès", rapport });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rapport :", error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour du rapport" });
    }
})
}


