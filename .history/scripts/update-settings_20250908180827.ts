import mongoose from 'mongoose'
import { connectToDatabase } from '../lib/db'

// Interface pour les devises
interface Currency {
  name: string
  code: string
  symbol: string
  convertRate: number
}

// Interface pour les langues
interface Language {
  name: string
  code: string
}

// Interface pour les paramètres
interface SettingsUpdate {
  availableCurrencies: Currency[]
  availableLanguages: Language[]
  defaultCurrency: string
  defaultLanguage: string
}

async function updateSettings() {
  try {
    // Connexion à la base de données
    await connectToDatabase()
    console.log('✅ Connecté à la base de données')

    // Nouvelles devises (sans le diram)
    const newCurrencies: Currency[] = [
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
    const newLanguages: Language[] = [
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
    const Setting = mongoose.model('Setting')
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
