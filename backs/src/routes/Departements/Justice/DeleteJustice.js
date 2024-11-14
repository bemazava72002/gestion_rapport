const {Justices} = require('../../../Config/db')
module.exports = (app)=>{
    app.delete('/api/departement/Justices/:id', (req,res)=>{
        const id = req.params.id
        Justices.findByPk(id).then(justice =>{
            const justicedeleted = justice;
            return  Justices.destroy({
                where: {id:justice.id}
            }).then(_ =>{
                const message = `le departement de la justice ${justice.nom} a bien été supprimé`
                return  res.status(200).json({message, data: justicedeleted})
            })
        })
        .catch(error =>{
            const message = ` le departement de la justice n'a pas pu être supprimé`
            res.status(500).json({message,data:error})
        })
    })
}