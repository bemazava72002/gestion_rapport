
module.exports = (sequelize,DataTypes)=>{

    return  sequelize.define('Departements', {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement:true,
    
        },
        departements: { 
          type: DataTypes.STRING, 
          allowNull: false,
          unique: { 
            msg: 'le champ departement est deja pris' },
    
        validate:{
            is: {
              args: /^[a-zA-Z\s]+$/,
              msg: "Le champ departement ne doit contenir que des lettres"
            } 
         
        }
      },
      province_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        validate:{
          notNull: {
            msg: "le champ province ne peut être vide"
          }
        },
        references:{
          model: 'Provinces'
        },
        
      },
   
      });
   
     
    }