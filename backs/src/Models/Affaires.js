module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Affaires', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notNull: { msg: 'Le titre ne peut pas être vide' },
        is: {
          args: /^[A-Za-z]+$/,
          msg: "Le titre doit contenir uniquement des lettres (a-z, A-Z)."
        }
      }
    },
    description: {
      type: DataTypes.STRING,
    },
    responsable_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        
      }
    },
    departid: {
      type: DataTypes.INTEGER,
      references: {
        model: "Departements",
       
      }
    }
  });
};
