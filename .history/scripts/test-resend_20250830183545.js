#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration Resend
 * Usage: node scripts/test-resend.js
 */

import { Resend } from 'resend'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

async function testResend() {
  try {
    console.log('🧪 Test de la configuration Resend...')
    console.log('📧 Email expéditeur:', process.env.SENDER_EMAIL)
    console.log('👤 Nom expéditeur:', process.env.SENDER_NAME)
    console.log(
      '🔑 Clé API:',
      process.env.RESEND_API_KEY ? '✅ Configurée' : '❌ Manquante'
    )

    // Test d'envoi d'email
    const { data, error } = await resend.emails.send({
      from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
      to: ['test@example.com'], // Email de test
      subject: 'Test Resend - MendelCorp',
      html: `
        <h1>Test de configuration Resend</h1>
        <p>Si vous recevez cet email, la configuration est correcte.</p>
        <p>Expéditeur: ${process.env.SENDER_NAME} &lt;${process.env.SENDER_EMAIL}&gt;</p>
        <p>Date: ${new Date().toISOString()}</p>
      `,
    })

    if (error) {
      console.error("❌ Erreur lors de l'envoi:", error)

      if (error.message.includes('domain')) {
        console.log('\n🔧 Solution: Vérifiez votre domaine sur Resend')
        console.log('   Allez sur: https://resend.com/domains')
        console.log('   Ajoutez et vérifiez: mendelcorp.com')
      }

      if (error.message.includes('unauthorized')) {
        console.log('\n🔑 Solution: Vérifiez votre clé API Resend')
        console.log('   Vérifiez la variable: RESEND_API_KEY')
      }

      return
    }

    console.log('✅ Email envoyé avec succès!')
    console.log("📨 ID de l'email:", data?.id)
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Exécuter le test
testResend()
