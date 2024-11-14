const {Departements} = require('../../Config/db')
module.exports = (app)=>{
    app.delete('/api/departement/:id', (req,res)=>{
        const id = req.params.id
        Departements.findByPk(id).then(departement =>{
            const Departdeleted = departement;
            return  Departements.destroy({
                where: {id:departement.id}
            }).then(_ =>{
                const message = `le departement ${departement.departements} a bien été supprimé`
                return  res.status(200).json({message, data: Departdeleted})
            })
        })
        .catch(error =>{
            const message = ` le departement n'a pas pu être supprimé`
            res.status(500).json({message,data:error})
        })
    })
}