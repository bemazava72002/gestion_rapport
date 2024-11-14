const {Roles} = require('../../Config/db')


module.exports = (app)=>{
    app.get('/api/roles', (req,res)=>{
      
        if(req.query.role){
            const roles = req.query.role
            const limit = parseInt(req.query.limit) || 5
            if(roles.length < 2){

                const message = ` le terme de recherche ${roles}
                doit contenir au mois 2 caractères`

                return res.status(400).json({message})

            }
            return Roles.findAndCountAll({where : {
                role:{ // propriete du modele
                    
                    [Op.like]: `%${roles}%`

                }
                
            
            },
            order: ['role'],
            limit: limit,
            
        }).then(({count,rows}) => {
                const message = ` il y a ${count} correspondant au terme de recherche ${roles}`
                return res.json({message, data: rows})
            })
            
        }
        else{
            Roles.findAll({order: ['role']})
            .then(role =>{
                const message = "la liste des roles a été trouvee"
                res.json({message, data:role})
            })
            .catch(error =>{
                const message = `la liste des roles n'a pas pu être
                recuperé. Reessayer dans quelques instant`
    
                res.status(500).json({message,data:error})
            })
        }
        
    })
}

