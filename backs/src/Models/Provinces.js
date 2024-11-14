
module.exports = (sequelize,DataTypes)=>{

    return sequelize.define('Provinces', {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement:true,
    
        },
        provinces: { 
          type: DataTypes.STRING, 
          allowNull: false,
          unique:{
            msg:'ceci ne doit pas être duplique'
          },
          validate:{
            is: {
              notNull: 'ceci ne doit pas être vide',
              args: /^[A-Za-z]+$/, // Expression régulière pour valider uniquement des lettres
              msg: "ce champ doit contenir uniquement des lettres (a-z, A-Z)."
            }
          }
         
        }
    
      
    
      });
     
    }