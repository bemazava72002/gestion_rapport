const {Financieres} = require('../../../Config/db')
module.exports = (app)=>{
    app.delete('/api/departement/Finances/:id', (req,res)=>{
        const id = req.params.id
        Financieres.findByPk(id).then(finances =>{
            const Financedeleted = finances;
            return  Financieres.destroy({
                where: {id:finances.id}
            }).then(_ =>{
                const message = `le departement de finance ${finances.nomF} a bien été supprimé`
                return  res.status(200).json({message, data: Financedeleted})
            })
        })
        .catch(error =>{
            const message = ` le departement de finance n'a pas pu être supprimé`
            res.status(500).json({message,data:error})
        })
    })
}