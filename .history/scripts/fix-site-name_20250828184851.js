// Script pour corriger le nom du site
// Exécutez ce script avec: node scripts/fix-site-name.js

const { MongoClient } = require('mongodb');

async function fixSiteName() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mendel';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db('mendel');
    const settingsCollection = db.collection('settings');

    // Mettre à jour le nom du site
    const result = await settingsCollection.updateOne(
      {}, // Premier document
      {
        $set: {
          'site.name': 'MendelCorp',
          'site.description': 'Solutions technologiques professionnelles pour entreprises'
        }
      }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Nom du site mis à jour avec succès');
      console.log('📝 Nouveau nom: MendelCorp');
    } else {
      console.log('⚠️ Aucun document de paramètres trouvé');
    }

    // Vérifier le résultat
    const updatedSetting = await settingsCollection.findOne();
    if (updatedSetting) {
      console.log('📊 Paramètres actuels:');
      console.log(`   Nom: ${updatedSetting.site?.name || 'Non défini'}`);
      console.log(`   Description: ${updatedSetting.site?.description || 'Non définie'}`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

fixSiteName();
