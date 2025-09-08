const mongoose = require('mongoose')

// Configuration de la base de données
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mendelcorp'

// Schéma simplifié pour les paramètres
const settingSchema = new mongoose.Schema(
  {
    availableCurrencies: [
      {
        name: String,
        code: String,
        symbol: String,
        convertRate: Number,
      },
    ],
    availableLanguages: [
      {
        name: String,
        code: String,
      },
    ],
    defaultCurrency: String,
    defaultLanguage: String,
  },
  { strict: false }
)

const Setting = mongoose.model('Setting', settingSchema)

async function updateSettings() {
  try {
    // Connexion à la base de données
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connecté à la base de données')

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
    ]

    // Nouvelles langues (sans l'arabe)
    const newLanguages = [
      {
        name: 'English',
        code: 'en-US',
      },
      {
        name: 'Français',
        code: 'fr',
      },
    ]

    // Mettre à jour les paramètres
    const result = await Setting.findOneAndUpdate(
      {},
      {
        $set: {
          availableCurrencies: newCurrencies,
          availableLanguages: newLanguages,
          defaultCurrency: 'XOF',
          defaultLanguage: 'en-US',
        },
      },
      { upsert: true, new: true }
    )

    console.log('✅ Paramètres mis à jour avec succès')
    console.log(
      '📊 Nouvelles devises:',
      result.availableCurrencies.map((c) => `${c.name} (${c.code})`).join(', ')
    )
    console.log('💰 Devise par défaut:', result.defaultCurrency)
    console.log(
      '🌍 Nouvelles langues:',
      result.availableLanguages.map((l) => `${l.name} (${l.code})`).join(', ')
    )
    console.log('🔤 Langue par défaut:', result.defaultLanguage)
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Déconnecté de la base de données')
  }
}

// Exécuter le script
updateSettings()
