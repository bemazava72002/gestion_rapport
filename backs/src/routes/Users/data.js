const { checkDepartmentAccess } = require('../../Middlewares/checkDepartement');
const XLSX = require('xlsx');
const auth = require('../../Middlewares/auth');
const { Roles, Departements } = require('../../Config/db');
const path = require('path');

module.exports = (app) => {
    app.get('/api/donnee', auth, checkDepartmentAccess, async (req, res) => {
        const { roleID, departID } = req.user;

        try {
            console.log("User info:", req.user);  // Debug: Log user data to check if it's correct

            console.log("Loading Excel file...");

            // Ensure the path to the Excel file is correct
            const filePath = path.resolve(__dirname, '../../uploads/Fiche.xlsx');
            console.log("Excel file path:", filePath);  // Debug: Check the file path

            // Check if the file exists
            const fs = require('fs');
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'Fichier Excel introuvable' });
            }

            const workbook = XLSX.readFile(filePath);

            // Read the first sheet
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

            console.log("Excel data loaded:", jsonData);

            // Fetch the role and department based on the user
            const role = await Roles.findOne({ where: { id: roleID } });
            const departement = await Departements.findOne({ where: { id: departID } });

            if (!role || !departement) {
                console.error("Role or department not found");
                return res.status(404).json({ message: 'Role ou département introuvable' });
            }

            console.log("Fetched role:", role);
            console.log("Fetched department:", departement);

            // If the user is an admin, return all data
            if (role.role === 'Admin') {
                return res.json(jsonData);
            }

            // Filter data based on department
            const departementData = jsonData.filter(row => {
                console.log("Comparing department:", row[0]?.toString().trim().toLowerCase(), departement.departements.toLowerCase());  // Debug: Check the comparison
                return row[0]?.toString().trim().toLowerCase() === departement.departements.toLowerCase();
            });

            // If no data matches the department, return a not found response
            if (departementData.length === 0) {
                return res.status(404).json({ message: 'Aucune donnée trouvée pour ce département' });
            }

            // Return filtered data for the department
            res.json(departementData);

        } catch (error) {
            // Log full error stack for better debugging
            console.error("Erreur lors de la récupération des données:", error.stack || error);

            // Send a generic error message with status 500
            res.status(500).json({ message: "Une erreur est survenue lors de la récupération des données." });
        }
    });
};
