const {Affaires} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')
module.exports = (app)=>{
    app.delete('/api/Affaires/:id', auth, authorizeRole(['Admin','Responsable']), (req,res)=>{
        const id = req.params.id
        Affaires.findByPk(id).then(affaires =>{
            const Affairedeleted = affaires;
            return  Affaires.destroy({
                where: {id:affaires.id}
            }).then(_ =>{
                const message = `l'affaire${affaires.titre} a bien été supprimé`
                return  res.status(200).json({message, data: Affairedeleted})
            })
        })
        .catch(error =>{
            const message = ` l'affaire n'a pas pu être supprimé`
            res.status(500).json({message,data:error})
        })
    })
}