const { Roles } = require('../Config/db')

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const { roleID } = req.user;

    Roles.findOne({ where: { id: roleID } })
      .then((role) => {
        if (!role || !allowedRoles.includes(role.role)) {
          return res.status(403).json({ message: 'Accès non autorisé' });
        }
        next();
      })
      .catch((err) => {
        return res.status(500).json({ message: 'Erreur de serveur' });
      });
  };
};
