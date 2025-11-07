# Plan d'Optimisation des Performances - Lighthouse

## Problèmes identifiés (Score Performance: 50/100)

### 1. Render Blocking Requests
**Impact:** Bloque le rendu initial de la page, peut retarder le LCP

**Solutions:**
- [ ] Déplacer les scripts non critiques en bas de page ou utiliser `defer`/`async`
- [ ] Inline les CSS critiques (above-the-fold)
- [ ] Utiliser `next/font` pour optimiser les polices
- [ ] Vérifier les imports de bibliothèques lourdes (framer-motion, recharts)

**Fichiers à vérifier:**
- `app/layout.tsx` - Scripts et styles globaux
- `components/shared/client-providers.tsx` - Providers qui chargent des dépendances

### 2. Reduce Unused CSS (12 KiB mobile, 11 KiB desktop)
**Impact:** Réduit la taille du bundle et améliore le temps de chargement

**Solutions:**
- [ ] Analyser avec `@next/bundle-analyzer` pour identifier le CSS non utilisé
- [ ] Utiliser PurgeCSS ou Tailwind JIT pour éliminer le CSS non utilisé
- [ ] Vérifier les imports de composants UI non utilisés
- [ ] Optimiser les imports Tailwind (utiliser uniquement les classes nécessaires)

**Commandes:**
```bash
npm install --save-dev @next/bundle-analyzer
```

### 3. Reduce Unused JavaScript (218 KiB)
**Impact:** Réduit significativement le temps de parsing et d'exécution

**Solutions:**
- [ ] Analyser le bundle avec `@next/bundle-analyzer`
- [ ] Implémenter le code splitting dynamique pour les composants lourds
- [ ] Lazy load les composants admin (graphiques, tableaux)
- [ ] Vérifier les imports de bibliothèques complètes au lieu de imports spécifiques
- [ ] Utiliser `dynamic` de Next.js avec `ssr: false` pour les composants client-only

**Exemples:**
```typescript
// Au lieu de:
import { Chart } from 'recharts'

// Utiliser:
const Chart = dynamic(() => import('recharts').then(mod => mod.Chart), {
  ssr: false,
  loading: () => <Skeleton />
})
```

### 4. Reduce JavaScript Execution Time
**Impact:** Améliore le TBT (Total Blocking Time)

**Solutions:**
- [ ] Optimiser les re-renders avec `React.memo` et `useMemo`
- [ ] Réduire les calculs complexes côté client
- [ ] Déplacer la logique lourde vers les Server Actions
- [ ] Utiliser Web Workers pour les traitements intensifs

### 5. Minimize Main-Thread Work
**Impact:** Réduit le TBT et améliore la réactivité

**Solutions:**
- [ ] Analyser avec Chrome DevTools Performance pour identifier les longues tâches
- [ ] Découper les tâches longues en micro-tâches avec `setTimeout` ou `requestIdleCallback`
- [ ] Optimiser les animations avec `will-change` et `transform`
- [ ] Réduire les reflows/repaints

### 6. Optimize DOM Size
**Impact:** Réduit les calculs de style et les reflows

**Solutions:**
- [ ] Analyser la taille du DOM avec Lighthouse
- [ ] Limiter la profondeur d'imbrication des composants
- [ ] Utiliser la virtualisation pour les longues listes (react-window)
- [ ] Éviter les éléments DOM inutiles

### 7. Improve Image Delivery (24 KiB mobile, 64 KiB desktop)
**Impact:** Améliore le LCP et la perception de vitesse

**Solutions:**
- [ ] Vérifier que toutes les images utilisent `next/image` avec `priority` pour LCP
- [ ] Utiliser les formats modernes (AVIF, WebP) avec fallback
- [ ] Implémenter le lazy loading pour les images below-the-fold
- [ ] Optimiser les tailles d'images (utiliser les `sizes` appropriés)
- [ ] Utiliser un CDN pour les images (UploadThing est déjà configuré)

**Vérifications:**
- [ ] Images de la galerie produit utilisent `priority={false}` sauf la première
- [ ] Images du carousel utilisent `priority={true}` pour la première
- [ ] Images des cartes produit utilisent `loading="lazy"`

### 8. Network Dependency Tree
**Impact:** Réduit la longueur des chaînes de requêtes critiques

**Solutions:**
- [ ] Utiliser `preconnect` et `dns-prefetch` pour les domaines externes
- [ ] Optimiser l'ordre de chargement des ressources
- [ ] Réduire les dépendances entre ressources

### 9. Document Request Latency
**Impact:** Améliore le FCP (First Contentful Paint)

**Solutions:**
- [ ] Vérifier les redirects inutiles
- [ ] Optimiser le temps de réponse serveur (Vercel Edge Functions si nécessaire)
- [ ] Activer la compression gzip/brotli
- [ ] Utiliser le cache HTTP approprié

## Priorités d'implémentation

### Phase 1 - Quick Wins (Impact élevé, effort faible)
1. ✅ Optimiser les images (déjà partiellement fait)
2. ✅ Lazy load les composants admin
3. ✅ Analyser et réduire le CSS/JS non utilisé

### Phase 2 - Optimisations moyennes
1. Code splitting dynamique pour les composants lourds
2. Optimiser les re-renders avec React.memo
3. Améliorer le DOM size

### Phase 3 - Optimisations avancées
1. Web Workers pour les traitements lourds
2. Optimisation des animations
3. Virtualisation des listes longues

## Métriques cibles

- **Performance Score:** 80+ (actuellement 50)
- **FCP:** < 1.8s (actuellement variable)
- **LCP:** < 2.5s (actuellement 5.2s mobile)
- **TBT:** < 200ms (actuellement 120ms mobile - déjà bon!)
- **CLS:** 0 (déjà atteint ✅)

## Outils recommandés

1. **Bundle Analyzer:** `@next/bundle-analyzer`
2. **Performance:** Chrome DevTools Performance Panel
3. **Lighthouse CI:** Pour suivre les métriques dans le temps
4. **Web Vitals:** `@vercel/analytics` pour le monitoring en production

