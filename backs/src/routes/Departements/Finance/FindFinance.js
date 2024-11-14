
const {Financieres} = require('../../../Config/db')
module.exports = (app)=>{
    app.get('/api/departement/Finance/:id', (req,res)=>{
       
        Financieres.findByPk(req.params.id,(err,finances)=>{
            if(!finances){
                const message = `le departement de finance demandé n'existe pas,
                 verifie bien votre entrer`
                return   res.status(404).json({message,data:err}) 
            }
            const message = `le departement de finance
             a bien été trouvée`
           return  res.status(200).json({message, data: finances})
        })
        .catch(error =>{
            const message = `le departement de finances  n'a pas pu être recuperé`
            res.status(500).json({message, data:error})
        })
    })
    }