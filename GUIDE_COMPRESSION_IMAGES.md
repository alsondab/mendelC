# Guide d'Optimisation des Images Banner

## Images à compresser

Les images suivantes doivent être compressées pour améliorer le LCP :

- `/public/images/banner1.jpg` (image principale - LCP actuel : 5.36s)
- `/public/images/banner2.jpg`
- `/public/images/banner3.jpg`

## Méthodes de compression recommandées

### Option 1 : Utiliser un outil en ligne (recommandé)

1. **Squoosh** (https://squoosh.app/)
   - Ouvrir l'image
   - Sélectionner le format : **WebP** ou **AVIF**
   - Qualité : **75-85%**
   - Taille cible : **< 200 KB** par image
   - Télécharger et remplacer les fichiers originaux

2. **TinyPNG** (https://tinypng.com/)
   - Upload les images JPG
   - Télécharger les versions compressées
   - Vérifier que la qualité reste acceptable

### Option 2 : Utiliser ImageMagick (CLI)

```bash
# Installer ImageMagick (Windows avec Chocolatey)
choco install imagemagick

# Compresser en WebP avec qualité 80%
magick convert public/images/banner1.jpg -quality 80 public/images/banner1.webp
magick convert public/images/banner2.jpg -quality 80 public/images/banner2.webp
magick convert public/images/banner3.jpg -quality 80 public/images/banner3.webp

# Ou compresser en gardant le format JPG (qualité réduite)
magick convert public/images/banner1.jpg -quality 80 -strip public/images/banner1.jpg
magick convert public/images/banner2.jpg -quality 80 -strip public/images/banner2.jpg
magick convert public/images/banner3.jpg -quality 80 -strip public/images/banner3.jpg
```

### Option 3 : Utiliser Sharp (Node.js)

Créer un script `scripts/compress-images.js` :

```javascript
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const images = ['banner1.jpg', 'banner2.jpg', 'banner3.jpg']

async function compressImages() {
  for (const image of images) {
    const inputPath = path.join('public', 'images', image)
    const outputPath = path.join(
      'public',
      'images',
      image.replace('.jpg', '.webp')
    )

    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath)

    console.log(`✓ Compressed ${image} -> ${image.replace('.jpg', '.webp')}`)
  }
}

compressImages().catch(console.error)
```

## Objectifs de compression

- **Taille cible** : < 200 KB par image (idéalement < 150 KB)
- **Format recommandé** : WebP avec fallback JPG
- **Qualité** : 75-85% (bon équilibre qualité/taille)
- **LCP attendu** : < 2.5s après compression

## Après compression

1. Remplacer les fichiers dans `/public/images/`
2. Si vous utilisez WebP, mettre à jour le code pour utiliser `.webp` au lieu de `.jpg`
3. Tester le LCP avec PageSpeed Insights
4. Vérifier que la qualité visuelle reste acceptable

## Notes importantes

- Next.js 15 convertit automatiquement les images en AVIF/WebP si configuré dans `next.config.ts`
- Les images locales doivent être optimisées manuellement avant upload
- La compression WebP peut réduire la taille de 60-80% par rapport au JPG original
