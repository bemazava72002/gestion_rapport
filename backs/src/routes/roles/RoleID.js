
const {Roles} = require('../../Config/db')
const auth = require('../../Middlewares/auth')

module.exports = (app)=>{
    app.get('/api/roles/:id', (req,res)=>{
       
        Roles.findByPk(req.params.id)
        .then(role => {

            if(!role){
                const message = ` le role demandé n'existe pas, verifie bien votre entrer`
                return   res.status(404).json({message}) 
            }
            
            const message = 'le role a bien été trouvée'
           return  res.status(200).json({message, data: role})
        }).catch(error =>{
            const message = `le role n'a pas pu être recuperé`
            res.status(500).json({message, data:error})
        })
    })
    }