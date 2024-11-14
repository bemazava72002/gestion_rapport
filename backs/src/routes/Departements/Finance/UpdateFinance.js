const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Financieres,Departements} = require('../../../Config/db')

module.exports = (app)=>{
    app.put('/api/departement/Finances/:id', (req,res)=>{
        const id = req.params.id
        const  {nomF,departementF_id} = req.body
        Financieres.update({nomF,departementF_id},{
            where:{id:id} 
        })
        .then(_ =>{
          return Financieres.findByPk(id)
          .then(_=>{
            Departements.findByPk(departementF_id,(err,departement)=>{

                if(!departement){
                    const message= `le departement n'est pas present dans la base`
                    return res.status(404).json({message,data:err})     
                }

                const message = `le departement de la justice a bien été modifié ${nomF}`
               return  res.status(200).json({message, data: {
                nomF,
                departementF_id,
               
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

