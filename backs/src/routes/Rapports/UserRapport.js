const { Rapports, Departements, Users, Roles } = require('../../Config/db');
const auth = require('../../Middlewares/auth');
const authorizeRole = require('../../Middlewares/RoleMiddleware');

module.exports = (app) => {
    app.get('/api/rapports', auth, authorizeRole(['Employé']), async (req, res) => {
        const { Userid, departID } = req.user;

        try {
            // Fetch the department
            const departement = await Departements.findOne({ where: { id: departID } });
            console.log('Département:', departement);  // Debugging

            if (!departement) {
                return res.status(404).json({ message: 'Le département demandé n\'existe pas, veuillez vérifier votre entrée.' });
            }

            // Fetch the role for 'Responsable'
            const role = await Roles.findOne({ where: { role: 'Responsable' }, attributes:['id'] });
            if (!role) {
                return res.status(404).json({ message: 'Le rôle n\'existe pas.' });
            }

            // Fetch the responsable for the department and role
            const responsable = await Users.findOne({
                where: {
                    role_id: role.id, 
                    departement_id: departID,
                    // Optionally, add more filters here if needed
                },
            });

            if (!responsable) {
                return res.status(404).json({ message: 'Aucun responsable trouvé pour le rôle dans ce département.' });
            }

            // Fetch rapports and include Departement
          // Fetch rapports and include Departement and Responsable
const rapports = await Rapports.findAll({
    where: { auteur_id: Userid, depart_id: departID },
    include: [
       
        {
            model: Departements,
            as: 'Departement',
            attributes: ['departements'],
        },
        {
            model: Users,
            as: 'Responsable',
            attributes: ['Nom'],
        }
    ],
   
});

// Prepare response data
return res.status(200).json({
    message: 'Les rapports et informations associées ont été récupérés avec succès.',
    data: {
        rapports,
        departement: departement.departements,
        responsable:{
            id: responsable.id,
            nom: responsable.Nom,
            prenom: responsable.Prenom
        }
           
        
    },
});

            console.log('Rapports:', rapports);  // Debugging

            // Prepare response data
            return res.status(200).json({
                message: 'Les rapports et informations associées ont été récupérés avec succès.',
                data: {
                    rapports,
                    departement: departement.departements,
                    responsable: {
                        id: responsable.id,
                        nom: responsable.Nom,
                        prenom: responsable.Prenom
                    }
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports:', error);  // Debugging
            return res.status(500).json({ message: 'Le rapport n\'a pas pu être récupéré.', data: error.message });
        }
    });
};
