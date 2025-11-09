# 📦 Guide d'Analyse du Bundle JavaScript

**Objectif:** Identifier et réduire le JavaScript non utilisé (~218 KiB économisables)

---

## 🚀 Étape 1 : Générer le Rapport d'Analyse

```bash
# Générer le bundle analysé
npm run analyze

# Les rapports seront générés dans :
# - .next/analyze/client.html (Bundle client)
# - .next/analyze/server.html (Bundle serveur)
```

---

## 📊 Étape 2 : Analyser les Rapports

### 2.1 Ouvrir les Rapports

1. Ouvrir `.next/analyze/client.html` dans le navigateur
2. Ouvrir `.next/analyze/server.html` dans le navigateur

### 2.2 Identifier les Gros Chunks

**Rechercher:**

- ✅ Packages > 50 KiB (priorité haute)
- ✅ Duplications de code
- ✅ Imports de bibliothèques complètes au lieu de modules spécifiques

**Exemples de Problèmes Courants:**

#### ❌ Mauvais : Import complet

```typescript
import * as framerMotion from 'framer-motion' // ❌ Importe tout
```

#### ✅ Bon : Import spécifique

```typescript
import { motion } from 'framer-motion' // ✅ Importe uniquement motion
```

#### ❌ Mauvais : Import de toute une bibliothèque

```typescript
import _ from 'lodash' // ❌ Importe toute la bibliothèque
```

#### ✅ Bon : Import de fonction spécifique

```typescript
import debounce from 'lodash/debounce' // ✅ Importe uniquement debounce
```

---

## 🔍 Étape 3 : Identifier les Imports Non Utilisés

### 3.1 Utiliser ESLint

```bash
# Vérifier les imports non utilisés
npm run lint

# Corriger automatiquement si possible
npm run lint -- --fix
```

### 3.2 Vérifier Manuellement

**Rechercher dans le code:**

- Imports qui ne sont jamais utilisés
- Composants importés mais non rendus
- Hooks importés mais non appelés
- Types importés mais non utilisés

**Exemple:**

```typescript
// ❌ Mauvais
import { useState, useEffect, useMemo, useCallback } from 'react'
// Si seulement useState est utilisé

// ✅ Bon
import { useState } from 'react'
```

---

## 🎯 Étape 4 : Optimisations Spécifiques

### 4.1 Framer Motion

**Problème:** Framer Motion est volumineux (~52 KiB)

**Solutions:**

- ✅ Déjà optimisé : Lazy loading dans `product-card.tsx`
- ✅ Déjà optimisé : `modularizeImports` dans `next.config.ts`
- ⏳ Vérifier si tous les composants utilisent le lazy loading

**Vérifier:**

```bash
# Chercher les imports framer-motion directs
grep -r "from 'framer-motion'" Mendel/components
```

### 4.2 Recharts

**Problème:** Recharts est volumineux (~52 KiB) et utilisé uniquement dans admin

**Solutions:**

- ✅ Déjà optimisé : Lazy loading dans les composants admin
- ✅ Déjà optimisé : Chunk séparé dans `next.config.ts`
- ⏳ Vérifier que tous les imports admin sont lazy-loaded

**Vérifier:**

```bash
# Chercher les imports recharts
grep -r "from 'recharts'" Mendel
```

### 4.3 Radix UI

**Problème:** Plusieurs composants Radix UI importés

**Solutions:**

- ✅ Déjà optimisé : `modularizeImports` dans `next.config.ts`
- ✅ Déjà optimisé : Chunk séparé dans `next.config.ts`
- ⏳ Vérifier les imports inutilisés

### 4.4 Embla Carousel

**Problème:** Embla Carousel est volumineux

**Solutions:**

- ✅ Déjà optimisé : Lazy loading dans `home-carousel.tsx`
- ✅ Déjà optimisé : Chunk séparé dans `next.config.ts`

---

## 📋 Checklist d'Analyse

### Packages à Vérifier (par taille estimée)

| Package          | Taille Estimée | Usage           | Action         |
| ---------------- | -------------- | --------------- | -------------- |
| `framer-motion`  | ~52 KiB        | Animations      | ✅ Lazy load   |
| `recharts`       | ~52 KiB        | Admin seulement | ✅ Lazy load   |
| `@radix-ui/*`    | ~37 KiB        | Composants UI   | ✅ Modularisé  |
| `embla-carousel` | ~20 KiB        | Carousels       | ✅ Lazy load   |
| `next-intl`      | ~15 KiB        | i18n            | Vérifier       |
| `zod`            | ~12 KiB        | Validation      | Vérifier       |
| `mongoose`       | ~10 KiB        | DB              | Server only ✅ |
| `zustand`        | ~5 KiB         | State           | Vérifier       |

### Actions Recommandées

1. ✅ **Vérifier les imports framer-motion**

   ```bash
   grep -r "from 'framer-motion'" Mendel/components
   ```

   - S'assurer que tous sont lazy-loaded sauf si nécessaire au premier rendu

2. ✅ **Vérifier les imports recharts**

   ```bash
   grep -r "from 'recharts'" Mendel
   ```

   - S'assurer que tous sont lazy-loaded (admin seulement)

3. ⏳ **Vérifier les imports lodash/underscore**

   ```bash
   grep -r "from 'lodash\|from 'underscore" Mendel
   ```

   - Remplacer par imports spécifiques si trouvés

4. ⏳ **Vérifier les imports de composants UI**

   ```bash
   grep -r "from '@/components/ui" Mendel
   ```

   - S'assurer que seuls les composants utilisés sont importés

5. ⏳ **Vérifier les imports de types**
   ```bash
   grep -r "import type" Mendel
   ```

   - S'assurer que les types ne sont pas importés comme valeurs

---

## 🛠️ Outils Utiles

### 1. Bundle Analyzer (Déjà Configuré)

```bash
npm run analyze
```

### 2. ESLint (Déjà Configuré)

```bash
npm run lint
```

### 3. TypeScript Compiler

```bash
# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

### 4. Webpack Bundle Analyzer (Alternative)

```bash
# Si besoin d'une analyse plus détaillée
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

---

## 📊 Exemple d'Analyse

### Rapport Bundle Analyzer

**Structure typique:**

```
.next/analyze/client.html
├── vendors-xxx.js (200 KiB) ← Analyser en priorité
│   ├── framer-motion (52 KiB)
│   ├── recharts (52 KiB)
│   └── ...
├── app-xxx.js (150 KiB)
└── ...
```

### Actions selon la Taille

| Taille     | Action                                       |
| ---------- | -------------------------------------------- |
| > 100 KiB  | 🔴 Priorité haute - Analyser immédiatement   |
| 50-100 KiB | 🟡 Priorité moyenne - Vérifier si nécessaire |
| < 50 KiB   | 🟢 Priorité basse - Optimiser si facile      |

---

## ✅ Résultats Attendus

Après optimisation, vous devriez voir :

- ✅ Réduction de ~15% du bundle size (~218 KiB)
- ✅ Meilleur code splitting
- ✅ Chargement plus rapide des pages
- ✅ Meilleur score Lighthouse Performance

---

## 📝 Notes Techniques

### Code Splitting Automatique

Next.js fait déjà du code splitting automatique :

- Par route (chaque page = chunk séparé)
- Par `dynamic()` imports
- Par `webpack` splitChunks config

### Vérifier les Duplications

Dans le rapport Bundle Analyzer :

- Chercher les packages dupliqués
- Vérifier si plusieurs versions d'une même lib sont chargées
- Utiliser `npm ls <package>` pour vérifier les versions

---

**Document créé le:** 2025-01-05  
**Dernière mise à jour:** 2025-01-05
