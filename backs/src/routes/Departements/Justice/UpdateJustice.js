const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Justices,Departements} = require('../../../Config/db')

module.exports = (app)=>{
    app.put('/api/departement/Justices/:id', (req,res)=>{
        const id = req.params.id
        const  {nom,departement_id} = req.body
        Justices.update({nom,departement_id},{
            where:{id:id} 
        })
        .then(_ =>{
          return Justices.findByPk(id)
          .then(_=>{
            Departements.findByPk(departement_id,(err,departement)=>{

                if(!departement){
                    const message= `le departement n'est pas present dans la base`
                    return res.status(404).json({message,data:err})     
                }

                const message = `le departement de la justice a bien été modifié ${nom}`
               return  res.status(200).json({message, data: {
                nom,
                departement_id,
               
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
