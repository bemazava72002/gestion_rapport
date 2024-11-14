
const {Affaires} = require('../../Config/db')
module.exports = (app)=>{
    app.get('/api/Affaires/:id', (req,res)=>{
       
        Affaires.findByPk(req.params.id,(err,affaires)=>{
            if(!affaires){
                const message = `l'affaire demandé n'existe pas, verifie bien votre entrer`
                return   res.status(404).json({message,data:err}) 
            }
            const message = `l'affaire a bien été trouvée`
           return  res.status(200).json({message, data: affaires})
        })
        .catch(error =>{
            const message = `l'affaire n'a pas pu être recuperé`
            res.status(500).json({message, data:error})
        })
    })
    }