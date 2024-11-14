const {Users} = require('../Config/db')
require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{

    const authenHeader = req.headers.authorization
    if(!authenHeader){
        const message = `vous n'avez pas fourni une token d'authentification`
        return res.status(401).json({message})
    }
const token = authenHeader.split(' ')[1]
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            const message = `l'utilisateur n'a l'acces à ce route`
            return res.status(401).json({message})
        }
        const UserId = decoded.userId
        

        if(req.body.UserId && req.body.UserId !== UserId ){
            const message = `l'identifiant de l'utilisateur est invalid`
            return res.status(401).json({message})
        }
        else{
            req.user={
                Userid: decoded.userId,
                roleID: decoded.role,
                departID: decoded.depart,
                role: decoded.role,
                

            }
            next()
        }
    })

}