
const { Departements, Financieres} = require('../../../Config/db');  // Importez les modèles Departement et Provinces
const { Op } = require('sequelize');  // Importez l'Opérateur Sequelize pour LIKE

module.exports = (app) => {
  app.get('/api/departements/Finances', (req, res) => {

    // Recherche par nom de département
    if (req.query.nomF) {
      const NomFinance = req.query.nomF;
      const limit = parseInt(req.query.limit) || 5;

      // Vérification de la longueur du terme de recherche
      if (NomFinance.length < 2) {
        const message = `Le terme de recherche '${NomFinance}' doit contenir au moins 2 caractères.`;
        return res.status(400).json({ message });
      }

      // Recherche des départements correspondant au terme de recherche
      return Financieres.findAndCountAll({
        where: {
          // Utilise le bon champ ici (par exemple `name` ou `departement`)
          nomF: {  // Assurez-vous que 'name' est bien le champ correct
            [Op.like]: `%${NomFinance}%`,  // Recherche partielle par nom de département
          },
        },
        include: [{ 
          model: Departements,
          as:'Departements',
          
          attributes: ['departements']  // Récupérer uniquement le champ `provinces` dans la table `Provinces`
        }],
       
        order: [['nomF', 'ASC']],  // Tri par nom de département (ordre croissant)
        limit: limit,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} département 
        de Finance(s) correspondant 
        au terme de recherche '${NomFinance}'.`;
        return res.json({ message, data: rows });
      }).catch(error => {
        const message = `Une erreur est survenue 
        lors de la récupération
         des départements de Finances.`;
        return res.status(500).json({ message, data: error });
      });
    } 

    // Si aucune recherche spécifique n'est effectuée, retourner tous les départements avec leurs provinces
    else {
      Financieres.findAll({
        include: [{ 
          model: Departements,
          as:'Departements',
          attributes: ['departements']  // Inclure uniquement le champ `provinces` associé
        }],
      
        order: [['nomF', 'ASC']],  // Tri par nom de département (ordre croissant)
      }).then(finances => {
        const message = `a liste des départements de  finances
         a été trouvée avec leurs departements associées.`;
        res.json({ message, data: finances });
      }).catch(error => {
        const message = `La liste des départements
         de la justice n'a pas 
         pu être récupérée. Réessayez 
         dans quelques instants.`;
        res.status(500).json({ message, data: error });
      });
    }
  });
};
