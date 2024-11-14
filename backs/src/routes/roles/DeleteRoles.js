const {Roles} = require('../../Config/db')
const auth = require('../../Middlewares/auth')

module.exports = (app)=>{
    app.delete('/api/roles/:id', (req,res)=>{
        const id = req.params.id
        Roles.findByPk(id).then(roles =>{
         
            const Roledeleted = roles;
           return  Roles.destroy({
                where: {id:roles.id}
            }).then(_ =>{
                const message = `le role ${roles.role} a bien été supprimé`
                res.json({message, data: Roledeleted})
            })
        })
        .catch(error =>{
            const message = ` le role n'a pas pu être supprimé`
            res.status(500).json({message,data:error})
        })
    })
}