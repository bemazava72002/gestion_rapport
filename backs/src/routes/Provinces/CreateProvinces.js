const { ValidationError, UniqueConstraintError} = require('sequelize')
const {Provinces} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')


module.exports = (app)=>{
app.post('/api/Provinces', auth,authorizeRole(['Admin']), (req,res)=>{

Provinces.create(req.body)
.then(provinces =>{
  if(!provinces){
    return res.status(422).json({message: 'ce champ ne peut être vide'})
  }
    const message = `l'information concernant le province ${req.body.provinces} a bien été ajouté`

   return  res.status(201).json({message, data: provinces})
})
.catch(error => {
  if(error instanceof ValidationError){
    return   res.status(400).json({message: error.message, data: error})
  }
   if(error instanceof UniqueConstraintError){
    return res.status(400).json({message, data: error})
   }
   
})
})
}