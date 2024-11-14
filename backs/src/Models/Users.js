
module.exports = (sequelize,DataTypes)=>{

return  sequelize.define('Users', {
    id:{
      type: DataTypes.INTEGER,
     autoIncrement:true,   // Génère automatiquement un UUID v4 
      primaryKey: true

    },
    Nom: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate:{
        notNull:{msg:'le nom ne peut pas être vide '},
        is: {
          args: /^[A-Za-z]+$/, // Expression régulière pour valider uniquement des lettres
          msg: "Le nom doit contenir uniquement des lettres (a-z, A-Z)."
        }
      }
    },
    Prenom:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:'le prenom ne peut pas être vide '},
        is: {
          args: /^[A-Za-z]+$/,
          msg: "Le prenom doit contenir uniquement des lettres (a-z, A-Z)."
        }
      }

    },
    Email:{
      type: DataTypes.STRING,
      allowNull:false,
      Unique:{
        msg:`ce email existe déjà`
      },
      validate:{
        notNull: {msg: `l'email ne peut pas être vide`},
        isEmail:{msg:'email invalide'}

      }
    },

    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {msg: `le mot de passe ne peut pas être vide`},

      }
  },
  departement_id:{
    type: DataTypes.INTEGER,
    allowNull:true,
    references:{
      model: 'Departements'
    },

  },
  role_id:{
    type:DataTypes.INTEGER,
    allowNull:true,
    references:{
      model:"Roles"
      
    }
  },
  isActive:{
    type:DataTypes.BOOLEAN,
    defaultValue: false,
    


  }
  

  });
 
 
}