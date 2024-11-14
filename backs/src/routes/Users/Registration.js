const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Users, Roles, Notifications } = require('../../Config/db');
const bcrypt = require('bcrypt');
const { logger } = require('../../Config/logger');
const { sendEmail } = require('../../Service/mailService');

module.exports = (app) => {
    app.post('/api/registration', async (req, res) => {
        const { Nom, Prenom, Email, password } = req.body;
        
        try {
            // Vérification des champs requis
            if (!Nom || !Prenom || !Email || !password) {
                const message = "Veuillez remplir tous les champs";
                return res.status(422).json({ message });
            }

            // Vérification de l'existence de l'email
            const existingUser = await Users.findOne({ where: { Email: Email } });
            if (existingUser) {
                const message = "Ce email existe déjà";
                return res.status(409).json({ message });
            }

            // Hachage du mot de passe
            const hashpassword = await bcrypt.hash(password, 10);

            // Création de l'utilisateur
            const user = await Users.create({
                Nom,
                Prenom,
                Email,
                password: hashpassword,
            });

            // Recherche de l'administrateur pour la notification
            const adminRole = await Roles.findOne({ where: { role: 'Admin' }, attributes: ['id'] });
            if (adminRole) {
                const adminUser = await Users.findOne({ where: { role_id: adminRole.id } });
                if (adminUser) {
                    const emailMessage = `
                        Un nouveau utilisateur ${user.Nom} ${user.Prenom} vient de créer un compte.
                        Veuillez le consulter: ${process.env.HOST_FRONT}/Users/attente
                    `;
                    await sendEmail(adminUser.Email, 'Un nouveau compte a été créé', emailMessage);
                }
            }

            // Logging
            logger.info({
                message: 'Création de compte',
                utilisateur: user.Nom,
                action: 'Création de compte',
                date: new Date(),
            });

            // Réponse de succès
            const message = `L'utilisateur ${user.Nom + " " + user.Prenom} a bien été ajouté`;
            return res.status(201).json({ message, data: user });

        } catch (error) {
            // Gestion des erreurs
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `Impossible d'effectuer l'ajout`;
            return res.status(500).json({ message: error.message, data: error });
        }
    });
};
