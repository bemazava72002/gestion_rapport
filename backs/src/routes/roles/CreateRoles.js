const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Roles} = require('../../Config/db')



module.exports = (app)=>{
app.post('/api/role', (req,res)=>{


Roles.create(req.body)
.then(roles =>{
  if(!roles){
    return res.status(422).json({message: 'ce champ ne peut être vide'})
  }
    const message = `l'information concernant le role ${req.body.role} a bien été ajouté`

   return  res.status(201).json({message, data: roles})
})
.catch(error => {
  if(error instanceof ValidationError){
    return   res.status(400).json({message: error.message, data: error})
  }
   if(error instanceof UniqueConstraintError){
    return res.status(409).json({message, data: error})
   }
   
   
    const message = `l'information role n'a pas pu être ajouté, veuillez reessayer`
   return  res.status(500).json({message, error})
})
})
}