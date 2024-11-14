const { Departements, Users,Affaires} = require('../../Config/db');  // Importez les modèles Departement et Provinces
const { Op } = require('sequelize');  // Importez l'Opérateur Sequelize pour LIKE
const auth = require('../../Middlewares/auth')
module.exports = (app) => {
  app.get('/api/Affaires', auth,(req, res) => {

    // Recherche par nom de département
    if (req.query.titre){
      const affaires = req.query.titre;
      const limit = parseInt(req.query.limit) || 5;

      // Vérification de la longueur du terme de recherche
      if (affaires.length < 2) {
        const message = `Le terme de recherche '${affaires}' doit contenir au moins 2 caractères.`;
        return res.status(400).json({ message });
      }

      // Recherche des départements correspondant au terme de recherche
      return Affaires.findAndCountAll({
        where: {
          // Utilise le bon champ ici (par exemple `name` ou `departement`)
          titre: {  // Assurez-vous que 'name' est bien le champ correct
            [Op.like]: `%${affaires}%`,  // Recherche partielle par nom de département
          },
        },
        include: [{ 
          model: Departements,
          as:'Departements',
          
          attributes: ['departements']  // Récupérer uniquement le champ `provinces` dans la table `Provinces`
        }],
        include: [{ 
            model: Users,
            as:'Users',
            
            attributes: ['Nom,Prenom']  // Récupérer uniquement le champ `provinces` dans la table `Provinces`
          }],
       
        order: [['titre', 'ASC']],  // Tri par nom de département (ordre croissant)
        limit: limit,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} affaires(s) correspondant au terme de recherche '${departement}'.`;
        return res.json({ message, data: rows });
      }).catch(error => {
        const message = `Une erreur est survenue lors de la récupération des Affaires.`;
        return res.status(500).json({ message, data: error });
      });
    } 

    // Si aucune recherche spécifique n'est effectuée, retourner tous les départements avec leurs provinces
    else {
      Affaires.findAll({
        include: [{ 
          model: Departements,
          as:'Departements',
          attributes: ['departements']  // Inclure uniquement le champ `provinces` associé
        }],
        include: [{ 
            model: Users,
            as:'Users',
            attributes: ['Nom','Prenom']  // Inclure uniquement le champ `provinces` associé
          }],
      
        order: [['titre', 'ASC']],  // Tri par nom de département (ordre croissant)
      }).then(affaires => {
        const message = "La liste des affaires a été trouvée avec leurs provinces associées.";
        res.json({ message, data: affaires });
      }).catch(error => {
        const message = `La liste des affaires n'a pas pu être récupérée. Réessayez dans quelques instants.`;
        res.status(500).json({ message, data: error });
      });
    }
  });
};
