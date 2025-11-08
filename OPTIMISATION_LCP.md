# ⚡ Optimisation LCP (Largest Contentful Paint)

**Date:** 2025-01-05  
**Problème:** LCP de 5.0 s (objectif: < 2.5 s)

---

## 🔴 Problème Identifié

### LCP de 5.0 s (Trop Élevé)

**Cause Principale:** Le `HomeCarousel` était lazy-loaded avec `dynamic()`, ce qui retardait le rendu de l'élément LCP (première image du carousel).

---

## ✅ Optimisations Appliquées

### 1. Suppression du Lazy-Load du HomeCarousel ✅

**Fichier:** `app/[locale]/(home)/page.tsx`

**Avant:**
```typescript
const HomeCarousel = dynamic(() => import('@/components/shared/home/home-carousel'), {
  ssr: true,
  loading: () => <div>Chargement...</div>
})
```

**Après:**
```typescript
import { HomeCarousel } from '@/components/shared/home/home-carousel'
```

**Impact:** Le composant se charge maintenant immédiatement, permettant à l'image LCP de se rendre plus rapidement.

---

### 2. Réduction de la Qualité de l'Image LCP ✅

**Fichier:** `components/shared/home/home-carousel.tsx`

**Changement:**
- Qualité de la première image (LCP): `90` → `75`
- **Gain:** Réduction de ~15-20% de la taille de l'image, chargement plus rapide

---

### 3. Preload de l'Image LCP ✅

**Fichier:** `components/shared/lcp-image-preload.tsx` (nouveau)

**Fonctionnalité:**
- Ajoute un `<link rel="preload" fetchpriority="high">` dans le `<head>`
- Précharge l'image LCP avant que le composant ne soit rendu
- **Gain:** L'image commence à se charger dès le parsing du HTML

**Utilisation:**
```typescript
{firstCarouselImage && (
  <LCPImagePreload imageUrl={firstCarouselImage} />
)}
```

---

### 4. Metadata avec Preload ✅

**Fichier:** `app/[locale]/(home)/page.tsx`

**Ajout:**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const { carousels } = await getSetting()
  const firstCarouselImage = carousels?.[0]?.image || null
  
  return {
    other: {
      ...(firstCarouselImage && {
        'preload-image': firstCarouselImage,
      }),
    },
  }
}
```

---

## 📊 Résultats Attendus

### Avant Optimisations

| Métrique | Valeur |
|----------|--------|
| **LCP** | **5.0 s** 🔴 |

### Après Optimisations (Estimé)

| Métrique | Valeur Estimée |
|----------|----------------|
| **LCP** | **< 2.5 s** ✅ |

**Gains Estimés:**
- ✅ Suppression du lazy-load: **-2.0 à -3.0 s**
- ✅ Preload de l'image: **-0.5 à -1.0 s**
- ✅ Réduction qualité: **-0.2 à -0.5 s**

**Total Estimé:** **-2.7 à -4.5 s** → LCP attendu: **0.5 à 2.3 s** ✅

---

## 🔍 Vérifications à Effectuer

1. **Tester le LCP après déploiement**
   - Utiliser PageSpeed Insights ou Lighthouse
   - Vérifier que le LCP est < 2.5 s

2. **Vérifier le Preload dans le HTML**
   - Inspecter le `<head>` de la page
   - Vérifier la présence de `<link rel="preload" fetchpriority="high">`

3. **Vérifier la Qualité de l'Image**
   - L'image LCP doit être visible immédiatement
   - La qualité doit être acceptable (75 est généralement suffisant)

---

## 📋 Checklist

- [x] Suppression du lazy-load du HomeCarousel
- [x] Réduction de la qualité de l'image LCP (90 → 75)
- [x] Création du composant LCPImagePreload
- [x] Ajout du preload dans la page home
- [x] Ajout de generateMetadata avec preload
- [ ] Test du LCP après déploiement
- [ ] Vérification du preload dans le HTML

---

**Document créé le:** 2025-01-05  
**Dernière mise à jour:** 2025-01-05

