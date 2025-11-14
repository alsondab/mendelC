# PLAN D'OPTIMISATION PERFORMANCE - 45 RECOMMANDATIONS LIGHTHOUSE

**Date:** 2025  
**Objectif:** Améliorer le score Performance de Lighthouse en adressant les 45 recommandations

---

## 📊 CATÉGORISATION DES OPTIMISATIONS

### 🔴 CRITIQUES (Impact élevé - À faire en priorité)

#### 1. Render-Blocking Resources
**Problème:** JS/CSS bloquent le premier rendu  
**Solution:** 
- ✅ Déjà fait: `experimental.optimizeCss: true` dans `next.config.ts`
- ⚠️ À améliorer: Lazy load des composants non-critiques
- **Action:** Utiliser `dynamic()` avec `ssr: false` pour les composants non-essentiels

#### 2. Reduce Unused CSS
**Problème:** CSS non utilisé dans le bundle  
**Solution:**
- ✅ Déjà fait: Tailwind CSS purge automatique
- ⚠️ À vérifier: PurgeCSS config pour supprimer CSS inutilisé
- **Action:** Vérifier que `tailwind.config.ts` purge correctement

#### 3. Reduce Unused JavaScript
**Problème:** JS non utilisé chargé  
**Solution:**
- ✅ Déjà fait: Code splitting avec webpack
- ⚠️ À améliorer: Lazy load des composants admin (Recharts, etc.)
- **Action:** Vérifier que tous les composants admin sont lazy-loaded

#### 4. Reduce JavaScript Execution Time
**Problème:** Trop de temps passé à exécuter JS  
**Solution:**
- ✅ Déjà fait: `optimizePackageImports` pour framer-motion, lucide-react
- ⚠️ À améliorer: Réduire les re-renders avec React.memo
- **Action:** Ajouter React.memo sur les composants listés

#### 5. Minimize Main-Thread Work
**Problème:** Trop de travail sur le thread principal  
**Solution:**
- ✅ Déjà fait: CSS animations au lieu de JS quand possible
- ⚠️ À améliorer: Web Workers pour calculs lourds
- **Action:** Déplacer les calculs lourds vers Web Workers si nécessaire

---

### 🟡 IMPORTANTES (Impact moyen - À faire ensuite)

#### 6. Largest Contentful Paint (LCP)
**Problème:** LCP trop lent  
**Solution:**
- ✅ Déjà fait: Images optimisées avec Next.js Image
- ⚠️ À améliorer: Preload LCP image, éviter lazy-load sur LCP
- **Action:** Identifier l'image LCP et la preload

#### 7. First Contentful Paint (FCP)
**Problème:** FCP trop lent  
**Solution:**
- ✅ Déjà fait: CSS critique inline
- ⚠️ À améliorer: Réduire le temps de réponse serveur
- **Action:** Optimiser les Server Components

#### 8. Total Blocking Time (TBT)
**Problème:** TBT trop élevé  
**Solution:**
- ✅ Déjà fait: Code splitting
- ⚠️ À améliorer: Réduire les tâches longues (>50ms)
- **Action:** Analyser avec Chrome DevTools Performance

#### 9. Cumulative Layout Shift (CLS)
**Problème:** Éléments qui bougent  
**Solution:**
- ✅ Déjà fait: Dimensions explicites sur images
- ⚠️ À améliorer: Réserver l'espace pour les composants dynamiques
- **Action:** Ajouter `width` et `height` sur toutes les images

#### 10. Speed Index
**Problème:** Contenu visible trop lent  
**Solution:**
- ✅ Déjà fait: Images optimisées
- ⚠️ À améliorer: Prioriser le contenu above-the-fold
- **Action:** Utiliser `priority` sur les images critiques

---

### 🟢 OPTIMISATIONS (Impact faible - À faire si possible)

#### 11-20. Optimisations Images
**Actions:**
- ✅ Formats modernes (AVIF, WebP) - Déjà fait
- ✅ Tailles appropriées - Déjà fait
- ✅ Lazy loading - Déjà fait
- ⚠️ À vérifier: Compression des images
- ⚠️ À vérifier: Pas de GIFs animés (utiliser MP4/WebM)

#### 21-25. Optimisations Réseau
**Actions:**
- ✅ Compression texte (gzip/brotli) - Déjà fait
- ✅ Cache statique - Déjà fait
- ⚠️ À améliorer: Preconnect aux origines tierces
- ⚠️ À améliorer: DNS prefetch

#### 26-30. Optimisations JavaScript
**Actions:**
- ✅ Minification - Déjà fait (SWC)
- ✅ ES2020+ - Déjà fait (.browserslistrc)
- ⚠️ À vérifier: Pas de polyfills inutiles
- ⚠️ À vérifier: Pas de modules dupliqués

#### 31-35. Optimisations CSS
**Actions:**
- ✅ Minification - Déjà fait
- ✅ Purge CSS - Déjà fait (Tailwind)
- ⚠️ À vérifier: Pas de CSS critique chargé de manière asynchrone

#### 36-40. Optimisations DOM
**Actions:**
- ⚠️ À vérifier: Taille du DOM (<1500 nœuds)
- ⚠️ À vérifier: Profondeur du DOM (<32 niveaux)
- ⚠️ À améliorer: Virtualiser les longues listes

#### 41-45. Optimisations Diverses
**Actions:**
- ✅ Viewport meta tag - Déjà fait
- ✅ Font-display - À vérifier
- ⚠️ À vérifier: Passive event listeners
- ⚠️ À vérifier: Pas de document.write()

---

## 🎯 PLAN D'ACTION PRIORITAIRE

### Phase 1: Optimisations Critiques (Semaine 1)

1. **Lazy Load Composants Non-Critiques**
   ```typescript
   // Exemple: Admin components
   const AdminDashboard = dynamic(() => import('./admin-dashboard'), {
     ssr: false,
     loading: () => <LoadingSpinner />
   })
   ```

2. **Preload LCP Image**
   ```typescript
   // Dans layout.tsx ou page.tsx
   <link rel="preload" as="image" href="/images/hero-image.jpg" />
   ```

3. **Réduire Re-renders**
   - Ajouter React.memo sur ProductCard, ProductPrice, etc.
   - Utiliser useMemo/useCallback pour les calculs coûteux

4. **Optimiser Font Loading**
   ```css
   @font-face {
     font-family: 'Inter';
     font-display: swap; /* ou optional */
   }
   ```

### Phase 2: Optimisations Importantes (Semaine 2)

5. **Preconnect aux Origines Tierces**
   ```typescript
   // Dans layout.tsx
   <link rel="preconnect" href="https://utfs.io" />
   <link rel="dns-prefetch" href="https://utfs.io" />
   ```

6. **Réserver Espace pour Composants Dynamiques**
   ```typescript
   // Utiliser skeleton loaders avec dimensions fixes
   <div className="h-64 w-full bg-gray-200 animate-pulse" />
   ```

7. **Analyser et Optimiser TBT**
   - Utiliser Chrome DevTools Performance
   - Identifier les tâches >50ms
   - Optimiser ou déplacer vers Web Workers

### Phase 3: Optimisations Finales (Semaine 3)

8. **Vérifier Taille DOM**
   - Analyser avec Lighthouse
   - Virtualiser les longues listes si nécessaire

9. **Optimiser Font Loading**
   - Utiliser font-display: swap
   - Subset fonts si possible

10. **Finaliser Optimisations Réseau**
    - Vérifier tous les preconnect
    - Optimiser les chaînes de dépendances

---

## 📝 CHECKLIST D'IMPLÉMENTATION

### Render-Blocking
- [ ] Vérifier que `optimizeCss: true` fonctionne
- [ ] Lazy load tous les composants non-critiques
- [ ] Déferrer les scripts non-critiques

### Unused Code
- [ ] Vérifier purge CSS (Tailwind)
- [ ] Analyser bundle avec `npm run analyze`
- [ ] Supprimer imports inutilisés

### JavaScript Performance
- [ ] Ajouter React.memo sur composants listés
- [ ] Utiliser useMemo/useCallback
- [ ] Lazy load composants admin

### Images
- [ ] Preload LCP image
- [ ] Vérifier dimensions explicites
- [ ] Optimiser compression
- [ ] Éviter lazy-load sur LCP

### Réseau
- [ ] Ajouter preconnect aux origines tierces
- [ ] Vérifier compression (gzip/brotli)
- [ ] Optimiser cache headers

### DOM
- [ ] Vérifier taille DOM (<1500 nœuds)
- [ ] Virtualiser longues listes si nécessaire
- [ ] Réduire profondeur DOM

### Divers
- [ ] Vérifier font-display
- [ ] Vérifier passive event listeners
- [ ] Vérifier pas de document.write()

---

## 🔧 FICHIERS À MODIFIER

### 1. `app/[locale]/layout.tsx`
- Ajouter preconnect/prefetch
- Preload LCP image
- Optimiser font loading

### 2. Composants à Lazy Load
- `components/admin/*` (tous les composants admin)
- `components/shared/product/product-carousel.tsx`
- `components/shared/notifications/*` (si non-critique)

### 3. Composants à Optimiser avec React.memo
- `components/shared/product/product-card.tsx`
- `components/shared/product/product-price.tsx`
- `components/shared/cart/cart-item.tsx`
- `components/shared/wishlist/wishlist-item.tsx`

### 4. `tailwind.config.ts`
- Vérifier purge configuration
- Optimiser content paths

### 5. `next.config.ts`
- Vérifier toutes les optimisations
- Ajouter headers de compression si nécessaire

---

## 📊 MÉTRIQUES CIBLES

| Métrique | Actuel | Cible | Statut |
|----------|--------|-------|--------|
| Performance Score | ? | 80+ | ⏳ |
| LCP | ? | <2.5s | ⏳ |
| FCP | ? | <1.8s | ⏳ |
| TBT | ? | <200ms | ⏳ |
| CLS | ? | <0.1 | ⏳ |
| Speed Index | ? | <3.4s | ⏳ |

---

## 🚀 COMMANDES UTILES

```bash
# Analyser le bundle
npm run analyze

# Build de production
npm run build

# Lighthouse CI (si configuré)
npm run lighthouse

# Analyser les performances
npm run perf
```

---

## 📚 RESSOURCES

- [Web.dev Performance](https://web.dev/performance/)
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Lighthouse Scoring Guide](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)

