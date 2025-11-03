/**
 * ⚡ Optimization: Script de compression automatique des images
 *
 * Compresse toutes les images JPG dans /public/images/ en WebP
 * avec qualité optimisée pour réduire la taille tout en maintenant la qualité visuelle.
 *
 * Usage: npm run compress-images
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ⚡ Optimization: Support ES modules pour __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Vérifier si Sharp est installé
let sharp
try {
  const sharpModule = await import('sharp')
  sharp = sharpModule.default
} catch {
  console.error(
    "❌ Sharp n'est pas installé. Installez-le avec: npm install --save-dev sharp"
  )
  process.exit(1)
}

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images')
const QUALITY = 75 // Qualité WebP (75 est un bon équilibre qualité/taille)
const MAX_WIDTH = 1920 // Largeur maximale pour les images banner
const MAX_WIDTH_PRODUCT = 1200 // Largeur maximale pour les images produits

/**
 * Compresse une image en WebP
 */
async function compressImage(inputPath, outputPath, maxWidth) {
  try {
    const stats = await fs.promises.stat(inputPath)
    const originalSize = stats.size

    await sharp(inputPath)
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    const newStats = await fs.promises.stat(outputPath)
    const newSize = newStats.size
    const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(
      1
    )

    console.log(
      `✓ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB, -${reduction}%)`
    )

    return { originalSize, newSize, reduction }
  } catch (error) {
    console.error(
      `❌ Erreur lors de la compression de ${inputPath}:`,
      error.message
    )
    return null
  }
}

/**
 * Trouve toutes les images JPG dans un répertoire
 */
function findJpgImages(dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // Récursif pour les sous-dossiers (ex: categories)
      files.push(...findJpgImages(fullPath))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.jpg')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de la compression des images...\n')

  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    console.error(`❌ Le répertoire ${PUBLIC_IMAGES_DIR} n'existe pas.`)
    process.exit(1)
  }

  const images = findJpgImages(PUBLIC_IMAGES_DIR)

  if (images.length === 0) {
    console.log('ℹ️  Aucune image JPG trouvée.')
    return
  }

  console.log(`📸 ${images.length} image(s) trouvée(s)\n`)

  let totalOriginalSize = 0
  let totalNewSize = 0
  let successCount = 0

  for (const imagePath of images) {
    const relativePath = path.relative(PUBLIC_IMAGES_DIR, imagePath)
    const isBanner = relativePath.startsWith('banner')
    const maxWidth = isBanner ? MAX_WIDTH : MAX_WIDTH_PRODUCT

    const outputPath = imagePath.replace(/\.jpg$/i, '.webp')

    // Ne pas compresser si le fichier WebP existe déjà et est plus récent
    if (fs.existsSync(outputPath)) {
      const jpgStats = await fs.promises.stat(imagePath)
      const webpStats = await fs.promises.stat(outputPath)

      if (webpStats.mtime > jpgStats.mtime) {
        console.log(
          `⏭️  ${path.basename(imagePath)} déjà compressé (WebP plus récent)`
        )
        continue
      }
    }

    const result = await compressImage(imagePath, outputPath, maxWidth)

    if (result) {
      totalOriginalSize += result.originalSize
      totalNewSize += result.newSize
      successCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Résumé de la compression:')
  console.log(`   Images traitées: ${successCount}/${images.length}`)
  console.log(
    `   Taille totale: ${(totalOriginalSize / 1024).toFixed(1)}KB → ${(totalNewSize / 1024).toFixed(1)}KB`
  )
  console.log(
    `   Réduction: ${(((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100).toFixed(1)}%`
  )
  console.log('='.repeat(60))
  console.log('\n✅ Compression terminée!')
  console.log(
    '\n💡 Note: Les fichiers WebP sont créés, mais les fichiers JPG originaux sont conservés.'
  )
  console.log(
    '   Vous pouvez les remplacer manuellement si vous le souhaitez.\n'
  )
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
