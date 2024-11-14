const { Rapports, Users } = require('../../../Config/db');
const auth = require('../../../Middlewares/auth');
const authorizeRole = require('../../../Middlewares/RoleMiddleware');

module.exports = (app) => {
    app.patch('/api/rapport/approuve/:id', auth, authorizeRole(['Responsable']), async (req, res) => {
        const rapportId = req.params.id;
        const {Statut} = req.body
        

        try {
            const rapport = await Rapports.findOne({where:{id:rapportId }})

            if (!rapport) {
                return res.status(404).json({ message: "Rapport non trouvé" });
            }

                Statut = "Approuvée"
                rapport.Statut = Statut ;
                
             
            
            await rapport.save();
            res.status(200).json({
                message: "Le rapport a été approuvé avec succès.",
                data: {
                    rapport// Incluez les données de l'auteur
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de l'approbation du rapport", error: error.message });
        }
    });
};
