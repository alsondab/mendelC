const mongoose = require('mongoose');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mendelcorp';

// Schéma simplifié pour les paramètres
const settingSchema = new mongoose.Schema({
  availableCurrencies: [{
    name: String,
    code: String,
    symbol: String,
    convertRate: Number
  }],
  defaultCurrency: String
}, { strict: false });

const Setting = mongoose.model('Setting', settingSchema);

async function updateCurrencies() {
  try {
    // Connexion à la base de données
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à la base de données');

    // Nouvelles devises (sans le diram)
    const newCurrencies = [
      {
        name: 'United States Dollar',
        code: 'USD',
        symbol: '$',
        convertRate: 1,
      },
      {
        name: 'Euro',
        code: 'EUR',
        symbol: '€',
        convertRate: 0.96,
      },
      {
        name: "Franc CFA (Afrique de l'Ouest)",
        code: 'XOF',
        symbol: 'CFA',
        convertRate: 655.957,
      },
    ];

    // Mettre à jour les devises
    const result = await Setting.findOneAndUpdate(
      {},
      {
        $set: {
          availableCurrencies: newCurrencies,
          defaultCurrency: 'XOF'
        }
      },
      { upsert: true, new: true }
    );

    console.log('✅ Devises mises à jour avec succès');
    console.log('📊 Nouvelles devises:', result.availableCurrencies.map(c => `${c.name} (${c.code})`).join(', '));
    console.log('💰 Devise par défaut:', result.defaultCurrency);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de la base de données');
  }
}

// Exécuter le script
updateCurrencies();
