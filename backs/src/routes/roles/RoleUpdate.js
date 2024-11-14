const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Roles} = require('../../Config/db')
const auth = require('../../Middlewares/auth')


module.exports = (app)=>{
    app.put('/api/roles/:id', (req,res)=>{
        const id = req.params.id
        Roles.update(req.body,{
            where:{id:id} 
        })
        .then(_ =>{
          return Roles.findByPk(id)
            .then(roles =>{
                const message = `le role a bien été ${roles.role}`
              return  res.status(200).json({message, data: roles})
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

