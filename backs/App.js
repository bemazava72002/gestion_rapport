
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const path = require('path');
const sequelize = require('./src/Config/db')
// const RoleRegister = require('./Controller/RolesCreation')
require('dotenv').config()

const port =  process.env.PORT || 3001
 
  app.use(bodyParser.json())
  app.use(cors({
   origin: 'http://localhost:5173',
 credentials: true
  }))
  
  app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
sequelize.initdb()
require('./src/routes/Rapports/NotificationCreatRapport')(app)
require('./src/routes/Users/admin/Activite')(app)
// roles

require('./src/routes/roles/CreateRoles')(app)
require('./src/routes/roles/RoleID')(app)
require('./src/routes/roles/RoleUpdate')(app)
require('./src/routes/roles/DeleteRoles')(app)
require('./src/routes/roles/AllRoles')(app)

//province
require('./src/routes/Provinces/CreateProvinces')(app)
require('./src/routes/Provinces/FindIdProvinces')(app)
require('./src/routes/Provinces/UpdateProvinces')(app)
require('./src/routes/Provinces/DeleteProvince')(app)
require('./src/routes/Provinces/AllProvince')(app)

//departement
require('./src/routes/Departements/CreateDepart')(app)
require('./src/routes/Departements/UpdateDepartement')(app)
require('./src/routes/Departements/DeleteDepartement')(app)
require('./src/routes/Departements/FindDepartement')(app)
require('./src/routes/Departements/AllDepartement')(app)

// Affaire
require('./src/routes/Affaire/CreateAffaire')(app)
require('./src/routes/Affaire/AllAffaire')(app)
require('./src/routes/Affaire/DeleteAffaire')(app)
require('./src/routes/Affaire/FindAffaire')(app)
require('./src/routes/Affaire/UpdateAffaire')(app)

// departement de finance 
require('./src/routes/Departements/Finance/AllFinance')(app)
require('./src/routes/Departements/Finance/CreateFinance')(app)
require('./src/routes/Departements/Finance/DeleteFinance')(app)
require('./src/routes/Departements/Finance/UpdateFinance')(app)
require('./src/routes/Departements/Finance/FindFinance')(app)

// departement de la justice
require('./src/routes/Departements/Justice/AllJustice')(app)
require('./src/routes/Departements/Justice/CreateJustice')(app)
require('./src/routes/Departements/Justice/DeleteJustice')(app)
require('./src/routes/Departements/Justice/FindJustice')(app)
require('./src/routes/Departements/Justice/UpdateJustice')(app)


//rapport
require('./src/routes/generation')(app)
require('./src/routes/pdf')(app)
require('./src/routes/RapportStat')(app)
require('./src/routes/Rapports/Statut')(app)
require('./src/routes/Rapports/DeleteRapport')(app)
require('./src/routes/Rapports/CreerRapport')(app)
require('./src/routes/Rapports/Validation')(app)
require('./src/routes/Rapports/UserRapport')(app)
require('./src/routes/Rapports/RapportType')(app)
require('./src/routes/Rapports/Responsable/Modification')(app)
require('./src/routes/Rapports/Responsable/AfficheRapport')(app)
require('./src/routes/Rapports/AllRapport')(app)
require('./src/routes/Rapports/Responsable/Approuve')(app)
// Dossier
require('./src/routes/Dossier/CreateDossier')(app)
require('./src/routes/Users/data')(app)
require('./src/routes/Users/Registration')(app)
require('./src/routes/Users/AllUser')(app)
require('./src/routes/Users/Login')(app)
require('./src/routes/Users/SuppressionUser')(app)
require('./src/routes/Users/admin/ActiveCompte')(app)
require('./src/routes/Users/admin/AssignationRole')(app)
require('./src/routes/Users/admin/AssignationDepart')(app)
app.use(({res})=>{
  const message = 'impossible de trouver la resource demandé'
res.status(404).json({message})
})

app.listen(port, () => console.log(`Nous avons demarré le serveur sur: http://localhost:${port}`));