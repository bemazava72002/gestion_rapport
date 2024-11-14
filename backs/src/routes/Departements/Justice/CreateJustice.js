const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Justices,Departements} = require('../../../Config/db')

module.exports = (app)=>{
app.post('/api/departement/Justice', async (req,res)=>{
const {nom,departement_id} = req.body
try{
  await  Departements.findByPk(departement_id,async (err,departements)=>{
      const message= `le departement n'est pas present dans la base`
      if(!departements){
        return res.status(404).json({message,data:err})
      }
    
     
        await  Justices.create({nom,departement_id})
       
    
       return  res.status(201).json({message: `l'information 
        concernant le departement de la justice ${nom} 
      a bien été ajouté`, data:{
          nom,
          departement_id,
          
       } })
      })
  
    .catch(error => {
            if(error instanceof ValidationError){
              return   res.status(400).json({message: error.message, data: error})
            }
             if(error instanceof UniqueConstraintError){
              return res.status(400).json({message, data: error})
             }
             
          })    
}

catch(error){
    const message = `le departement ne peut être ajouté`
 return res.status(500).json({message, data:error})
}
})
}
