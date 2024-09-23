const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Définir le chemin source et destination
const sourceDir = path.resolve(__dirname, '../extensions');
const destDir = path.resolve(__dirname, '../node_modules');

// Fonction pour copier les fichiers en fusionnant les dossiers
async function copyExtensions() {
  try {
    // Utilise fs-extra pour copier en fusionnant les dossiers
    await fs.copy(sourceDir, destDir, {
      overwrite: true, 
      errorOnExist: false,
      preserveTimestamps: true
    });
    console.log('Extensions copiées avec succès dans node_modules');
  } catch (err) {
    console.error('Erreur lors de la copie des extensions :', err);
  }
}

// Exécuter la fonction de copie
copyExtensions();
