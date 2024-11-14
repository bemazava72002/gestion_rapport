const {Notifications,Users,Roles} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')
module.exports = (app)=>{
    app.get('/api/notifications/creation', auth, authorizeRole(['Responsable']) , async (req, res) => {

        const {Userid,departID} = req.user
        const roles = Roles.findOne({where:{role:'Employé'},attributes:['id']})

        const user = await Users.findOne({
            where: { departement_id:departID  },
            include: [{ model: Roles, 
              as: 'Roles', 
              where: { role: 'Employé' } }],
          });
        try {
            const notifications = await Notifications.findAll({
                where: { types:'Creation_rapport', reçu_par: user.id },
                include:[{
                        model: Users,
                        as:'Users', 
                        attributes:['Nom']
                }],
                order: [['createdAt', 'DESC']],
            });
            return res.status(200).json({ data: notifications,
                 user: user.Nom,
                 type:notifications.types,
                  notification: notifications.Contenue,titres:notifications.titre });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
    

}

