const {Sequelize, DataTypes} = require('sequelize')
const UserModel = require('../Models/Users')
const FinanceModel = require('../Models/departements/Financieres')
const JusticeModel = require('../Models/departements/Justices')
const RoleModel = require('../Models/Roles')
const AffaireModel = require('../Models/Affaires')
const DossierModel = require('../Models/Dossiers')
const DepartementModel = require('../Models/departements/Departements')
const ProvinceModel = require('../Models/Provinces')
const RapportModel = require('../Models/Rapport')
const NotificationModel = require('../Models/Notification')
require('dotenv').config();
const sequelize = new Sequelize(

  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,

    {
        host: process.env.DB_HOST ,
        dialect: 'postgres',
        dialectOptions: {
    
          timezone: 'Etc/GMT-2'
        },
        logging: false
      }

)
const Affaires = AffaireModel(sequelize,DataTypes)
const Dossiers = DossierModel(sequelize,DataTypes)
const Users = UserModel(sequelize, DataTypes)
const Roles = RoleModel(sequelize,DataTypes)
const Departements = DepartementModel(sequelize,DataTypes)
const Provinces = ProvinceModel(sequelize,DataTypes)
const Rapports = RapportModel(sequelize,DataTypes)
const Notifications = NotificationModel(sequelize,DataTypes)
const  Financieres = FinanceModel(sequelize,DataTypes)
const Justices = JusticeModel(sequelize,DataTypes)


// departement et utilisateur
Departements.hasMany(Users,{
foreignKey: 'departement_id',
 as:'Users', 
 onUpdate: 'RESTRICT',
  onDelete: 'CASCADE'
})
Users.belongsTo(Departements, {
  foreignKey: 'departement_id',
  as: 'Departements',
})

// justice et departement



Departements.hasMany(Justices,{
  foreignKey: 'departement_id',
  as:'Justices',
  onUpdate: 'RESTRICT',
  onDelete: 'CASCADE'
})
Justices.belongsTo(Departements, {
  foreignKey: 'departement_id',
  as: 'Departements',
})
//Finance et Departements
Departements.hasMany(Financieres,{
  foreignKey: 'departementF_id',
  as:'Financieres',
})
Financieres.belongsTo(Departements, {
  foreignKey: 'departement_id',
  as: 'Departements',
})
//Affaires et Utilisateur
Users.hasMany(Affaires,{
  foreignKey: 'responsable_id',
  as: 'Affaires',
  onUpdate: 'RESTRICT',
  onDelete: 'CASCADE',
})
Affaires.belongsTo(Users,{
  foreignKey: 'responsable_id',
  as: 'Users',
})

//Dossier et utilisateur
Users.hasMany(Dossiers,{
  foreignKey: 'auteur_id',
  as: 'Dossiers',
})

Dossiers.belongsTo(Users,{
  foreignKey: 'auteur_id',
  as: 'Users',
})

//Dossier et affaire
Affaires.hasMany(Dossiers,{
  foreignKey: 'affaire_id',
  as: 'Dossiers',
})
Dossiers.belongsTo(Affaires,{
  foreignKey: 'affaire_id',
  as: 'Affaires',
})




// rapports et utilisateur
Users.hasMany(Rapports,{
  foreignKey: 'auteur_id',
  as: 'Rapports',
})
Rapports.belongsTo(Users,{
  foreignKey: 'auteur_id',
  as: 'Auteur',
})
 // rapport et responsable
Users.hasMany(Rapports,{
  foreignKey: 'responsable',
  as: 'Rapport',
})
Rapports.belongsTo(Users,{
  foreignKey: 'responsable',
  as: 'Responsable',
})
// rapports et departement
Departements.hasMany(Rapports,{
  foreignKey: 'depart_id',
  as: 'Rapports',
})
Rapports.belongsTo(Departements,{
  foreignKey: 'depart_id',
  as: 'Departement',
})

// roles et utilisateur
Roles.hasMany(Users,{
foreignKey:'role_id' ,
as: 'Users'
})
Users.belongsTo(Roles,{
  foreignKey:'role_id',
  as:'Roles'
})

// notification, rapport et utilisateur
Users.hasMany(Notifications,{
  foreignKey: 'reçu_par',
  as: 'Notifications',
})
Notifications.belongsTo(Users,{
  foreignKey: 'reçu_par',
  as: 'Users',
})

// 


//departement et provinces

Provinces.hasMany(Departements,{
  foreignKey: 'province_id',
  onUpdate: 'RESTRICT',
  onDelete: 'CASCADE',
  as: 'Departements'
})
Departements.belongsTo(Provinces,{
  foreignKey: 'province_id',
  as:'Provinces'
})


// departement et categorie

const initdb = () =>{return  sequelize.sync()
.then(_=>{
  console.log('INIT DB')
  
} 
)
}
module.exports = {
  initdb, Users, Roles,Departements,Provinces,
  Rapports,Notifications,Affaires,Dossiers,Financieres,Justices
}