const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Financieres,Departements} = require('../../../Config/db')

module.exports = (app)=>{
app.post('/api/departement/Finances', async (req,res)=>{
const {nomF,departementF_id} = req.body
try{
  await  Departements.findByPk(departementF_id,async (err,departements)=>{
      const message= `le departement du finance n'est pas present dans la base`
      if(!departements){
        return res.status(404).json({message,data:err})
      }
    
     
        await  Financieres.create({nomF,departementF_id})
       
    
       return  res.status(201).json({message: `l'information 
        concernant le departement de Finance ${nomF} 
      a bien été ajouté`, data:{
          nomF,
          departementF_id,
          
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
