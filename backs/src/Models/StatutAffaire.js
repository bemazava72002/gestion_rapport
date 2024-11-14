module.exports = (sequelize, DataTypes) =>{
    return  sequelize.define('StatuAffaire', {
       id:{
         type:DataTypes.INTEGER,
         autoIncrement:true,
         primaryKey: true
   
       },
   
       statut: { 
         type: DataTypes.STRING, 
         allowNull: false,
         unique: { 
           msg: 'le statut est deja pris' },
   
       validate:{
         
           notNull: {
             msg: "le champ status est un element requise "},
           is: {
             args: /^[a-zA-Zéèê\s]+$/,
             msg: "Le statut du rôle ne doit contenir que des lettres"
           }
       },
      
       },
       
       
     });
   
   }