
module.exports = (sequelize, DataTypes) =>{
 return  sequelize.define('Roles', {
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true

    },

    role: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: { 
        msg: 'le roles est deja pris' },

    validate:{
      
        notNull: {
          msg: "le champ role est un element requise "},
        is: {
          args: /^[a-zA-Zéèê\s]+$/,
          msg: "Le nom du rôle ne doit contenir que des lettres"
        }
    },
   
    },
    
    
  });

}
