const {Rapports} = require('../../Config/db')

module.exports = (app)=>{
    app.get('/rapport/statut', async (req,res)=>{
        try {
            // Récupérer les statuts uniques de la table Rapports
            const statuts = await Rapports.findAll({
              attributes: ['Statut'],
              group: ['Statut'], // Pour obtenir les valeurs distinctes
            });
        
            // Extraire les statuts à partir de l'objet résultant
            const statutList = statuts.map((statut) => statut.Statut);
        
            res.json(statutList); // Retourner la liste des statuts uniques
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des statuts' });
          }

    })
}