/**
 * Script de test pour les notifications de stock
 * Usage: node scripts/test-stock-notifications.js
 */

const {
  checkStockAndNotify,
} = require('../lib/actions/stock-notifications.actions')

async function testStockNotifications() {
  console.log('🧪 Test des notifications de stock...\n')

  try {
    const result = await checkStockAndNotify()

    console.log('📊 Résultat:')
    console.log(`✅ Succès: ${result.success}`)
    console.log(`📧 Message: ${result.message}`)
    console.log(`📬 Notifications envoyées: ${result.notificationsSent}`)

    if (result.success && result.notificationsSent > 0) {
      console.log('\n🎉 Test réussi ! Des notifications ont été envoyées.')
    } else if (result.success && result.notificationsSent === 0) {
      console.log('\n✅ Test réussi ! Aucune notification nécessaire.')
    } else {
      console.log(
        "\n❌ Test échoué ! Erreur lors de l'envoi des notifications."
      )
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
  }
}

// Exécuter le test
testStockNotifications()
