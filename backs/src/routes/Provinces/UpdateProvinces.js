const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Provinces} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')
module.exports = (app)=>{
    app.put('/api/province/:id',auth,authorizeRole(['Admin']), (req,res)=>{
        const id = req.params.id
        Provinces.update(req.body,{
            where:{id:id} 
        })
        .then(_ =>{
          return Provinces.findByPk(id)
            .then(province =>{
                const message = `le province a bien été ${province.provinces}`
               return  res.status(200).json({message, data: province})
            }).catch(error =>{
                if(error instanceof ValidationError){
                   return  res.status(400).json({message: error.message, data: error})
                }
                if(error instanceof UniqueConstraintError){
                    return res.status(409).json({message: error.message, data: error})
                }
                
            })
        })
    })
}

