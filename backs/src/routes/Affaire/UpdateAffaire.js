const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Affaires,Departements,Users} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')
module.exports = (app)=>{
    app.put('/api/Affaire/:id', auth,authorizeRole(['Responsable']), (req,res)=>{
        const id = req.params.id
        const  {titre,description,responsable_id,departid} = req.body
        const affaire = Affaires.update({titre,description,responsable_id,departid},{
            where:{id:id} 
        })
        .then(_ =>{
          return Affaires.findByPk(id)
          .then(_=>{
            Users.findByPk(responsable_id,(err,responsable)=>{

                if(!responsable){
                    const message= `le responsable n'est pas present dans la base`
                    return res.status(404).json({message,data:err})     
                }
                Departements.findByPk(departid,(err,departement)=>{
                    if(!departement){
                        const message= `le departement n'est pas present dans la base`
                        return res.status(404).json({message,data:err})     
                    }
                })
                const message = `l'affaire a bien été modifié ${titre}`
               return  res.status(200).json({message, data: {
              affaire
               
               }})
            
            })
            .catch(error =>{
                if(error instanceof ValidationError){
                   return  res.status(400).json({message: error.message, data: error})
                }
                if(error instanceof UniqueConstraintError){
                    return res.status(409).json({message: error.message, data: error})
                }
                
            })
          })
            
        })
    })
}

