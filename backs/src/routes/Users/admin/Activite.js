const fs = require('fs');
const path = require('path');
const auth = require('../../../Middlewares/auth');
const authorizeRole = require('../../../Middlewares/RoleMiddleware');

module.exports = (app) => {
  app.get(
    '/api/logs/actions',
    auth,
    authorizeRole(['Admin']),
    (req, res) => {
      const logFilePath = path.join(__dirname, '../../../Config/logs/actions.log');

      // Vérifier si le fichier de log existe
      if (!fs.existsSync(logFilePath)) {
        console.error('Fichier de log introuvable à:', logFilePath);
        return res.status(404).json({ message: 'Fichier de log introuvable' });
      }

      fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erreur lors de la lecture des logs:', err.message);
          return res.status(500).json({ message: 'Erreur lors de la récupération des logs', error: err.message });
        }

       
        const logs = data
          .split('\n').reverse()
          .filter(line => line) 
          .map(line => {
            try {
              return JSON.parse(line);
            } catch (parseError) {
              console.error('Erreur de conversion en  JSON:', parseError.message);
              return null; 
            }
          })
          .filter(log => log); 

        res.json(logs);
      });
    }
  );
};
