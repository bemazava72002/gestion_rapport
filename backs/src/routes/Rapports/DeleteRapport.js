const {Rapports} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')
module.exports = (app)=>{
    app.delete('/api/rapport/:id', auth, authorizeRole(['Admin']), (req,res)=>{
        const id = req.params.id
        Rapports.findByPk(id).then(rapport =>{
            const Rapportdeleted = rapport;
            return  Rapports.destroy({
                where: {id:rapport.id}
            }).then(_ =>{
                const message = `le rapport ${rapport.titre} a bien été supprimé`
                return  res.status(200).json({message, data: Rapportdeleted})
            })
        })
        .catch(error =>{
            const message = ` le rapport n'a pas pu être supprimé`
            res.status(500).json({message,data:error})
        })
    })
}