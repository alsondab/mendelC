# ACTIONS IMMÉDIATES POUR AMÉLIORER LES PERFORMANCES

**Date:** 2025  
**Priorité:** 🔴 CRITIQUE

---

## ✅ DÉJÀ FAIT (Vérifié)

1. ✅ **Font-display: swap** - Déjà configuré dans `layout.tsx`
2. ✅ **Images optimisées** - Next.js Image avec formats modernes
3. ✅ **CSS critique inline** - `optimizeCss: true` dans `next.config.ts`
4. ✅ **Code splitting** - Webpack configuré avec chunks séparés
5. ✅ **Minification** - SWC activé par défaut
6. ✅ **ES2020+** - `.browserslistrc` configuré
7. ✅ **Compression** - `compress: true` dans `next.config.ts`

---

## 🚨 ACTIONS IMMÉDIATES À FAIRE

### 1. Ajouter Preconnect aux Origines Tierces

**Fichier:** `app/[locale]/layout.tsx`

**Action:** Ajouter dans le `<head>` (ou vérifier que `NetworkOptimizations` le fait)

```typescript
// Vérifier que NetworkOptimizations inclut:
<link rel="preconnect" href="https://utfs.io" />
<link rel="dns-prefetch" href="https://utfs.io" />
```

**Impact:** Réduit la latence des requêtes vers UploadThing

---

### 2. Lazy Load Composants Admin

**Fichiers à modifier:**
- `app/[locale]/admin/**/*.tsx` (tous les composants admin)

**Action:** Utiliser `dynamic()` pour lazy load

```typescript
import dynamic from 'next/dynamic'

// Au lieu de:
import AdminDashboard from './admin-dashboard'

// Utiliser:
const AdminDashboard = dynamic(() => import('./admin-dashboard'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})
```

**Impact:** Réduit le First Load JS de ~100-200 KB

---

### 3. Preload LCP Image

**Fichier:** `app/[locale]/(home)/page.tsx` ou `layout.tsx`

**Action:** Identifier l'image LCP (généralement la première image du carousel) et la preload

```typescript
// Dans le layout ou la page d'accueil
<link 
  rel="preload" 
  as="image" 
  href={firstCarouselImage} 
  fetchPriority="high"
/>
```

**Impact:** Améliore LCP de 0.5-1s

---

### 4. Vérifier React.memo sur Composants Listés

**Fichiers à vérifier:**
- ✅ `components/shared/product/product-card.tsx` - Déjà fait
- ⚠️ `components/shared/product/product-price.tsx` - À vérifier
- ⚠️ `components/shared/cart/cart-item.tsx` - À vérifier
- ⚠️ `components/shared/wishlist/wishlist-item.tsx` - À vérifier

**Action:** S'assurer que tous utilisent `React.memo`

**Impact:** Réduit les re-renders de 30-50%

---

### 5. Optimiser Font Loading

**Fichier:** `app/[locale]/layout.tsx`

**Action:** Vérifier que `font-display: swap` est bien appliqué

```typescript
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // ✅ Déjà fait
})
```

**Impact:** Évite le FOIT (Flash of Invisible Text)

---

### 6. Réserver Espace pour Composants Dynamiques

**Fichiers:** Tous les composants avec chargement asynchrone

**Action:** Utiliser skeleton loaders avec dimensions fixes

```typescript
// Exemple pour ProductCard
<div className="h-64 w-full bg-gray-200 animate-pulse" />
```

**Impact:** Réduit CLS (Cumulative Layout Shift)

---

### 7. Vérifier Taille DOM

**Action:** Analyser avec Lighthouse

**Cible:** <1500 nœuds DOM

**Si dépassé:** Virtualiser les longues listes

```typescript
// Utiliser react-window ou react-virtual pour les longues listes
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

### 8. Optimiser Images avec Dimensions Explicites

**Fichiers:** Tous les composants avec `<Image>`

**Action:** S'assurer que toutes les images ont `width` et `height` (ou `fill` avec conteneur dimensionné)

**Statut:** ✅ Déjà fait pour la plupart (vérifié dans product-card, home-card, etc.)

---

### 9. Éviter Lazy Load sur LCP Image

**Fichier:** `components/shared/home/home-carousel.tsx`

**Action:** Vérifier que la première image du carousel a `priority={true}` et `loading="eager"`

**Statut:** ✅ Déjà fait (ligne 44-50)

---

### 10. Supprimer Console.log en Production

**Fichier:** `next.config.ts`

**Action:** Vérifier que `removeConsole` est activé

**Statut:** ✅ Déjà fait (lignes 69-74)

---

## 📋 CHECKLIST RAPIDE

- [ ] Vérifier `NetworkOptimizations` inclut preconnect
- [ ] Lazy load tous les composants admin
- [ ] Preload LCP image
- [ ] Vérifier React.memo sur tous les composants listés
- [ ] Ajouter skeleton loaders pour composants dynamiques
- [ ] Analyser taille DOM avec Lighthouse
- [ ] Vérifier toutes les images ont dimensions explicites
- [ ] Vérifier LCP image n'est pas lazy-loaded
- [ ] Vérifier removeConsole est activé

---

## 🎯 MÉTRIQUES CIBLES APRÈS OPTIMISATIONS

| Métrique | Avant | Cible | Action |
|----------|-------|-------|--------|
| Performance | ? | 80+ | Toutes les actions |
| LCP | ? | <2.5s | Preload LCP |
| FCP | ? | <1.8s | CSS critique |
| TBT | ? | <200ms | Lazy load admin |
| CLS | ? | <0.1 | Skeleton loaders |
| First Load JS | ? | <300KB | Lazy load admin |

---

## 🚀 COMMANDES POUR TESTER

```bash
# Build de production
npm run build

# Analyser le bundle
npm run analyze

# Lancer Lighthouse (si configuré)
npm run lighthouse

# Ou manuellement dans Chrome DevTools
# F12 > Lighthouse > Performance > Generate Report
```

---

## 📝 NOTES

- Les optimisations déjà faites sont marquées ✅
- Les optimisations à faire sont marquées ⚠️
- Prioriser les actions marquées 🔴 CRITIQUE
- Tester après chaque modification avec Lighthouse

