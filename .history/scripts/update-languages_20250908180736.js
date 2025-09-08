const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mendelcorp';

// Schéma simplifié pour les paramètres
const settingSchema = new mongoose.Schema({
  availableLanguages: [{
    name: String,
    code: String
  }],
  defaultLanguage: String
}, { strict: false });

const Setting = mongoose.model('Setting', settingSchema);

async function updateLanguages() {
  try {
    // Connexion à la base de données
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à la base de données');

    // Nouvelles langues (sans l'arabe)
    const newLanguages = [
      {
        name: 'English',
        code: 'en-US'
      },
      {
        name: 'Français',
        code: 'fr'
      }
    ];

    // Mettre à jour les langues
    const result = await Setting.findOneAndUpdate(
      {},
      {
        $set: {
          availableLanguages: newLanguages,
          defaultLanguage: 'en-US'
        }
      },
      { upsert: true, new: true }
    );

    console.log('✅ Langues mises à jour avec succès');
    console.log('🌍 Nouvelles langues:', result.availableLanguages.map(l => `${l.name} (${l.code})`).join(', '));
    console.log('🔤 Langue par défaut:', result.defaultLanguage);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de la base de données');
  }
}

// Exécuter le script
updateLanguages();
