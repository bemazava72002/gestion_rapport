const { Users, Roles, Departements } = require('../../Config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (app) => {
  app.post('/api/login', async (req, res) => {
    const { Email, password } = req.body;

    try {
      // Trouver l'utilisateur par e-mail, incluant rôle et département
      const user = await Users.findOne({
        where: { Email },
        include: [
          { model: Departements, as: 'Departements', attributes: ['departements'] },
          { model: Roles, as: 'Roles', attributes: ['role'] },
        ],
      });

      if (!user) {
        const message = `L'email n'existe pas`;
        return res.status(404).json({ message });
      }

      // Vérifier le mot de passe
      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        const message = `Mot de passe incorrect`;
        return res.status(401).json({ message });
      }
      if(!user.isActive){
        return res.status(401).json({message: `votre compte n'est pas encore activé`})
        
      }

      // Générer le token JWT
      const AccessToken = jwt.sign(
        {
          userId: user.id,
          role: user.role_id,
          roles: user.Roles ? user.Roles.role : null,
          depart: user.departement_id,
          Nom: user.Nom,
          departement: user.Departements ? user.Departements.departements : null,
        },
        process.env.JWT_SECRET,
        { subject: 'Acces', expiresIn: process.env.EXPIRED_ACCESSTOKEN }
      );

      const message = `Bienvenu ${user.Nom}`;
      return res.status(200).json({
        message,
        data: {
          AccessToken,
          nom: user.Nom,
          Prenom: user.Prenom,
          Email: user.Email,
          roles: user.role_id,
          role: user.Roles ? user.Roles.role : null,
          depart: user.departement_id,
          departement: user.Departements ? user.Departements.departements : null,
        },
      });
    } catch (error) {
      const message = `L'utilisateur n'a pas pu se connecter`;
      return res.status(500).json({ message, data: error.message });
    }
  });
};
