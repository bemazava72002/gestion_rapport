const {Provinces} = require('../../Config/db')
const auth = require('../../Middlewares/auth')
const authorizeRole = require('../../Middlewares/RoleMiddleware')

module.exports = (app)=>{
    app.get('/api/provinces', auth, authorizeRole(['Admin']) ,(req,res)=>{

        if(req.query.provinces){
            const province = req.query.provinces
            const limit = parseInt(req.query.limit) || 5
            if(province.length < 2){
                const message = ` le terme de recherche ${province}
                doit contenir au mois 2 caractères`
                return res.status(400).json({message})
            }
            return Provinces.findAndCountAll({where : {
                provinces:{ // propriete du modele 
                    [Op.like]: `%${province}%`
                }
            },
            order: ['provinces'],
            limit: limit, 
        }).then(({count,rows}) => {
                const message = ` il y a ${count} correspondant au terme de recherche ${province}`
                return res.json({message, data: rows})
            })   
        }
        
        else{
            Provinces.findAll({order: ['provinces']})
            .then(province =>{
                const message = "la liste des provinces a été trouvee"
                res.json({message, data:province})
            })
            .catch(error =>{
                const message = `la liste des provinces n'a pas pu être
                recuperé. Reessayer dans quelques instant`
    
                res.status(500).json({message,data:error})
            })
        }
        
    })
}

