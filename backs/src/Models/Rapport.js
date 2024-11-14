
module.exports = (sequelize,DataTypes)=>{
 return  sequelize.define('Rapport', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    type: {
      type: DataTypes.ENUM('Mensuel', 'Trimestriel', 'Semestriel'),
      allowNull: false,
    },
    fichier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    depart_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"Departements",
       
      }
    },
    auteur_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"Users",
       
      }
    
    },
    responsable:{
      type:DataTypes.INTEGER,
      references:{
        model:"Users",
       
       
        
      }
    },
    recommandation:{
      type:DataTypes.STRING,
      allowNull:true
    
    },
    Statut:{
      type:DataTypes.ENUM('Soumis','Approuvée','Rejetée'),
      defaultValue: 'Soumis',
    }

  }, {
    timestamps: false,
  });
  

  
}

