
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('Dossiers', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        titre: {
          type: DataTypes.STRING,
          allowNull: false,
          validate:{
            notNull:{msg:'le titre ne peut pas être vide '},
            is: {
              args: /^[A-Za-z]+$/,
              msg: "Le titre doit contenir uniquement des lettres (a-z, A-Z)."
            }
          }
          
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        date_ajout: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        fichier: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        affaire_id:{
          type:DataTypes.INTEGER,
          references:{
            model:'Affaires',
          }
        },
        auteur_id:{
          type:DataTypes.INTEGER,
          references:{
            model:'Users'
          }
        }
      }, {
        timestamps: false,
      });
          
}


