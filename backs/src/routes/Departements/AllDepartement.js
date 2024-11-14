const { Departements, Provinces} = require('../../Config/db');  // Importez les modèles Departement et Provinces
const { Op } = require('sequelize');  // Importez l'Opérateur Sequelize pour LIKE

module.exports = (app) => {
  app.get('/api/departements', (req, res) => {

    // Recherche par nom de département
    if (req.query.departements) {
      const departement = req.query.departements;
      const limit = parseInt(req.query.limit) || 5;

      // Vérification de la longueur du terme de recherche
      if (departement.length < 2) {
        const message = `Le terme de recherche '${departement}' doit contenir au moins 2 caractères.`;
        return res.status(400).json({ message });
      }

      // Recherche des départements correspondant au terme de recherche
      return Departements.findAndCountAll({
        where: {
          // Utilise le bon champ ici (par exemple `name` ou `departement`)
          departements: {  // Assurez-vous que 'name' est bien le champ correct
            [Op.like]: `%${departement}%`,  // Recherche partielle par nom de département
          },
        },
        include: [{ 
          model: Provinces,
          as:'Provinces',
          
          attributes: ['provinces']  // Récupérer uniquement le champ `provinces` dans la table `Provinces`
        }],
       
        order: [['departements', 'ASC']],  // Tri par nom de département (ordre croissant)
        limit: limit,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} département(s) correspondant au terme de recherche '${departement}'.`;
        return res.json({ message, data: rows });
      }).catch(error => {
        const message = `Une erreur est survenue lors de la récupération des départements.`;
        return res.status(500).json({ message, data: error });
      });
    } 

    // Si aucune recherche spécifique n'est effectuée, retourner tous les départements avec leurs provinces
    else {
      Departements.findAll({
        include: [{ 
          model: Provinces,
          as:'Provinces',
          attributes: ['provinces']  // Inclure uniquement le champ `provinces` associé
        }],
      
        order: [['departements', 'ASC']],  // Tri par nom de département (ordre croissant)
      }).then(departement => {
        const message = "La liste des départements a été trouvée avec leurs provinces associées.";
        res.json({ message, data: departement });
      }).catch(error => {
        const message = `La liste des départements n'a pas pu être récupérée. Réessayez dans quelques instants.`;
        res.status(500).json({ message, data: error });
      });
    }
  });
};
