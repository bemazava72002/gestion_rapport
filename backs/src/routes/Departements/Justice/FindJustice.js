
const {Justices} = require('../../../Config/db')
module.exports = (app)=>{
    app.get('/api/departement/Justice/:id', (req,res)=>{
       
        Justices.findByPk(req.params.id,(err,justices)=>{
            if(!justices){
                const message = `le departement de la justice demandé n'existe pas,
                 verifie bien votre entrer`
                return   res.status(404).json({message,data:err}) 
            }
            const message = `le departement de la justice
             a bien été trouvée`
           return  res.status(200).json({message, data: justices})
        })
        .catch(error =>{
            const message = `le departement de la justice n'a pas pu être recuperé`
            res.status(500).json({message, data:error})
        })
    })
    }