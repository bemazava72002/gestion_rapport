const {Provinces} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')

module.exports = (app)=>{
    app.delete('/api/province/:id', auth,authorizeRole(['Admin']), (req,res)=>{
        const id = req.params.id
        Provinces.findByPk(id).then(province =>{
            const Provincedeleted = province;
            return  Provinces.destroy({
                where: {id:province.id}
            }).then(_ =>{
                const message = `le province ${province.provinces} a bien été supprimé`
                return  res.status(200).json({message, data: Provincedeleted})
            })
        })
        .catch(error =>{
            const message = ` le province n'a pas pu être supprimé`
            res.status(500).json({message,data:error})
        })
    })
}