const multer = require('multer');
const path = require('path');

// Définir le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/')); // Assurez-vous que le chemin est correct
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configure multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Erreur: Type de fichier non autorisé'));
  },
});

module.exports = { upload };
