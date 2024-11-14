
module.exports = (sequelize,DataTypes)=>{

    return sequelize.define('Notification', {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement:true,
    
        },
        titre: { 
          type: DataTypes.STRING, 
          allowNull: false,

        
         
        },
        Contenue:{
            type:DataTypes.STRING
        },
        reçu_par:{
            type:DataTypes.INTEGER,
            references:{
              model:'Users'
            }
            
        },
        types:{
          type:DataTypes.STRING,
        }
    
      
    
      });
     
    }