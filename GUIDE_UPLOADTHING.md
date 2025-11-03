# 📤 Guide d'intégration UploadThing - Carousel et Logo

## ✅ Ce qui a été implémenté

### 1. **Endpoints UploadThing spécifiques** (`app/api/uploadthing/core.ts`)

Trois endpoints ont été configurés :

- **`imageUploader`** : Endpoint générique pour produits et catégories (4MB max)
- **`carouselImageUploader`** : Endpoint dédié aux images du carousel (8MB max, admin seulement)
- **`logoUploader`** : Endpoint dédié aux logos (2MB max, admin seulement)

**Sécurité** :
- ✅ Vérification admin obligatoire pour `carouselImageUploader` et `logoUploader`
- ✅ Authentification requise pour tous les endpoints
- ✅ Gestion d'erreurs avec messages clairs

**Optimisations automatiques** :
- ✅ CDN UploadThing (utfs.io) pour livraison rapide
- ✅ Conversion automatique en formats modernes (WebP, AVIF)
- ✅ Compression automatique des images

### 2. **Composant réutilisable ImageUpload** (`components/shared/image-upload.tsx`)

Un composant complet avec :

- ✅ **Prévisualisation optimisée** : Utilise Next/Image pour l'optimisation automatique
- ✅ **Remplacement d'image** : Bouton "Remplacer" au survol
- ✅ **Suppression** : Bouton "Supprimer" pour retirer l'image
- ✅ **Gestion d'erreurs** : Toasts pour feedback utilisateur
- ✅ **Aspect ratios** : Support pour carousel (16:6), logo (carré), et autres
- ✅ **Responsive** : Adapté mobile et desktop

### 3. **Formulaires améliorés**

#### Carousel Form (`app/[locale]/admin/settings/carousel-form.tsx`)
- ✅ Interface restructurée avec cartes par carousel
- ✅ Utilisation du composant `ImageUpload` avec endpoint `carouselImageUploader`
- ✅ Meilleure organisation visuelle avec grille responsive

#### Site Info Form (`app/[locale]/admin/settings/site-info-form.tsx`)
- ✅ Utilisation du composant `ImageUpload` avec endpoint `logoUploader`
- ✅ Interface simplifiée et professionnelle

## 🚀 Comment utiliser

### Pour les administrateurs

#### 1. **Uploader une image de carousel**

1. Aller dans **Paramètres** → **Carrousels**
2. Cliquer sur **"Ajouter un carrousel"** ou modifier un existant
3. Cliquer sur la zone d'upload ou **"Choisir un fichier"**
4. Sélectionner une image (max 8MB)
5. L'image est automatiquement uploadée et optimisée
6. Remplir les autres champs (Titre, URL, Texte du bouton)
7. Sauvegarder les paramètres

**Remplacement d'image** :
- Survoler l'image existante
- Cliquer sur **"Remplacer"**
- Sélectionner une nouvelle image

**Suppression** :
- Survoler l'image existante
- Cliquer sur **"Supprimer"**

#### 2. **Uploader un logo**

1. Aller dans **Paramètres** → **Informations du site**
2. Dans la section **"Logo du site"**, cliquer sur la zone d'upload
3. Sélectionner une image (max 2MB, format carré recommandé)
4. L'image est automatiquement uploadée et optimisée
5. Sauvegarder les paramètres

**Remplacement** : Même processus que pour le carousel

## 📋 Spécifications techniques

### Taille des fichiers

- **Carousel** : Maximum 8MB
- **Logo** : Maximum 2MB
- **Images génériques** : Maximum 4MB

### Formats supportés

- JPG / JPEG
- PNG
- WebP (recommandé)
- AVIF (automatique via UploadThing)

### Aspect ratios recommandés

- **Carousel** : 16:6 (1920x720px par exemple)
- **Logo** : 1:1 (carré, 200x200px minimum)

### Optimisations automatiques

UploadThing effectue automatiquement :

1. **Compression** : Réduction de la taille du fichier
2. **Conversion** : Formats modernes (WebP, AVIF) selon le navigateur
3. **CDN** : Livraison via CDN global (utfs.io)
4. **Cache** : Mise en cache pour performances optimales

## 🔒 Sécurité

- ✅ Seuls les administrateurs peuvent uploader des images de carousel et logo
- ✅ Authentification requise pour tous les uploads
- ✅ Validation des types de fichiers côté serveur
- ✅ Limites de taille respectées

## 🎨 Personnalisation

Le composant `ImageUpload` peut être personnalisé :

```tsx
<ImageUpload
  value={imageUrl}
  onChange={(url) => setImageUrl(url)}
  endpoint='carouselImageUploader' // ou 'logoUploader'
  maxSize='8MB'
  aspectRatio='carousel' // ou 'logo' ou 'square'
  label='Image du carousel'
  className='custom-class'
/>
```

## 📝 Notes importantes

1. **Variables d'environnement** : Assurez-vous que `UPLOADTHING_SECRET` et `UPLOADTHING_APP_ID` sont configurées dans `.env.local`

2. **Premier upload** : Lors du premier upload, UploadThing peut demander une autorisation

3. **URLs retournées** : Les URLs sont au format `https://utfs.io/f/...` (CDN UploadThing)

4. **Suppression côté UploadThing** : Les fichiers supprimés côté interface restent sur UploadThing (gestion manuelle via dashboard UploadThing si nécessaire)

## 🐛 Dépannage

### Erreur "Unauthorized"
- Vérifier que vous êtes connecté en tant qu'administrateur
- Vérifier les variables d'environnement UploadThing

### Erreur "File too large"
- Réduire la taille de l'image avant upload
- Utiliser un outil de compression d'images

### L'image ne s'affiche pas
- Vérifier que l'URL est bien sauvegardée dans les paramètres
- Vérifier la connexion internet
- Vérifier les permissions CORS si nécessaire

## ✨ Améliorations futures possibles

- [ ] Drag & drop pour uploader
- [ ] Éditeur d'image intégré (rotation, crop)
- [ ] Prévisualisation avant upload
- [ ] Compression côté client avant upload
- [ ] Gestion de plusieurs images simultanées
- [ ] Historique des uploads

