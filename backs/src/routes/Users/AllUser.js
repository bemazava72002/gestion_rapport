const { Users, Departements, Roles } = require('../../Config/db'); 
const { Op } = require('sequelize'); 
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware');
const AllRoles = require('../roles/AllRoles');
module.exports = (app) => {
  app.get('/api/users/:isActives', auth, authorizeRole(['Admin']), async (req, res) => {
    // Recherche par nom de département
    try {
  const {isActives} = req.params
const users = await Users.findAll({
  
include: [
 
  {
      model: Departements,
      as: 'Departements',
      attributes: ['departements'],
  },
  {
      model:Roles,
      as:'Roles',
      attributes:['role']
  }
  
],
where:{isActive: isActives }

});

// Prepare response data
return res.status(200).json({
message: 'Les utilisateurs  ont été récupérés avec succès.',
data: {
  users

},
});

  } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);  // Debugging
      return res.status(500).json({ message: 'Le rapport n\'a pas pu être récupéré.', data: error.message });
  }

  })}