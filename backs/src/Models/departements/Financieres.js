
module.exports = (sequelize,DataTypes)=>{

    return  sequelize.define('Financieres', {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement:true,
    
        },
        nomF: { 
          type: DataTypes.STRING, 
          allowNull: false,
          unique: { 
            msg: 'le nom est deja pris' },
    
        validate:{
            is: {
              args: /^[a-zA-Z\s]+$/,
              msg: "Le  nom ne doit contenir que des lettres"
            } 
         
        }
      },
      departementF_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        validate:{
          notNull: {
            msg: "le champ departement ne peut être vide"
          }
        },
        references:{
          model: 'Departements'
        },
        
      },
   
      });
   
     
    }