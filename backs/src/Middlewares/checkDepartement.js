const { Roles, Departements } = require('../Config/db');

const checkDepartmentAccess = async (req, res, next) => {
    const { roleID, departID } = req.user; // Utilisateur connecté

    try {
        // Trouver le rôle et le département
        const role = await Roles.findOne({ where: { id: roleID } });
        const departement = await Departements.findOne({ where: { id: departID } });

        // Si le rôle est 'Admin', l'accès est toujours autorisé
        if (role.role === 'Admin') {
            return next();
        }

        // Si le département n'existe pas ou si l'utilisateur n'a pas accès à ce département
        if (!departement) {
            return res.status(403).json({ message: "Accès refusé, département introuvable" });
        }

        // Si l'utilisateur n'est pas associé à ce département, accès refusé
        if (departement.id !== departID) {
            return res.status(403).json({ message: "Accès refusé, département non autorisé" });
        }

        // Si toutes les vérifications sont passées, l'accès est autorisé
        next();
    } catch (error) {
        console.error("Erreur lors de la vérification de l'accès au département:", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = { checkDepartmentAccess };
