
const {Provinces} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')

module.exports = (app)=>{
    app.get('/api/provinces/:id', auth,authorizeRole(['Admin']), (req,res)=>{
       
        Provinces.findByPk(req.params.id)
        .then(province => {

            if(!province){
                const message = `le province demandé n'existe pas, verifie bien votre entrer`
                return   res.status(404).json({message}) 
            }
            
            const message = 'le province a bien été trouvée'
           return  res.status(200).json({message, data: province})
        }).catch(error =>{
            const message = `le province n'a pas pu être recuperé`
            res.status(500).json({message, data:error})
        })
    })
    }