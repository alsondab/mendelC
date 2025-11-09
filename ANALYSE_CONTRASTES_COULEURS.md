# 🎨 Analyse des Contrastes de Couleurs - WCAG AA

**Objectif:** Améliorer l'accessibilité en vérifiant et corrigeant les contrastes (+3 points Accessibility)

---

## 📋 Standards WCAG AA

### Ratio de Contraste Requis

- **Texte normal (< 18px ou < 14px bold):** Ratio ≥ 4.5:1
- **Grand texte (≥ 18px ou ≥ 14px bold):** Ratio ≥ 3:1
- **Éléments UI (boutons, liens):** Ratio ≥ 3:1

---

## 🔍 Couleurs Identifiées à Vérifier

### 1. Product Price - Deal Badge

**Fichier:** `components/shared/product/product-price.tsx`

**Ligne 83:**

```typescript
<span className='text-red-600 text-xs font-semibold bg-red-50 px-1 xs:px-2 py-0.5 xs:py-1 rounded-md'>
```

**Analyse:**

- **Texte:** `text-red-600` (rgb(220, 38, 38))
- **Fond:** `bg-red-50` (rgb(254, 242, 242))
- **Ratio estimé:** ~4.8:1 ✅ (acceptable pour texte normal)
- **Action:** ✅ OK - Pas de changement nécessaire

---

### 2. Product Price - Discount Percentage

**Fichier:** `components/shared/product/product-price.tsx`

**Ligne 125:**

```typescript
<div className='text-lg xs:text-xl sm:text-2xl lg:text-3xl text-orange-700'>
```

**Analyse:**

- **Texte:** `text-orange-700` (rgb(194, 65, 12))
- **Fond:** Par défaut (background blanc/clair)
- **Ratio estimé:** ~7.5:1 ✅ (excellent)
- **Action:** ✅ OK - Pas de changement nécessaire

---

### 3. Badges et Indicateurs

**Fichiers à vérifier:**

- `components/shared/header/cart-button.tsx` : Badge rouge
- `components/shared/header/wishlist-count.tsx` : Badge amber
- `components/shared/notifications/stock-gauge.tsx` : Couleurs de statut

---

## 🛠️ Outils de Vérification

### 1. WebAIM Contrast Checker

**URL:** https://webaim.org/resources/contrastchecker/

**Utilisation:**

1. Entrer la couleur de texte (hex ou RGB)
2. Entrer la couleur de fond (hex ou RGB)
3. Vérifier le ratio obtenu

### 2. Chrome DevTools

**Méthode:**

1. Ouvrir DevTools (F12)
2. Sélectionner un élément avec l'inspecteur
3. Dans le panneau "Computed", chercher "color" et "background-color"
4. Utiliser l'outil de contraste intégré

### 3. axe DevTools Extension

**Installation:**

```bash
# Extension Chrome
https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd
```

**Utilisation:**

1. Ouvrir l'extension
2. Lancer l'audit
3. Vérifier les violations de contraste

### 4. WAVE Browser Extension

**Installation:**

```bash
# Extension Chrome
https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh
```

---

## 📊 Checklist de Vérification

### Composants à Vérifier

- [ ] `product-price.tsx` - Badges et prix
- [ ] `cart-button.tsx` - Badge rouge
- [ ] `wishlist-count.tsx` - Badge amber
- [ ] `stock-gauge.tsx` - Couleurs de statut
- [ ] `stock-alert-indicator.tsx` - Indicateurs
- [ ] `button.tsx` - Variants de boutons
- [ ] `badge.tsx` - Badges génériques
- [ ] `alert-dialog.tsx` - Dialogs d'alerte
- [ ] `toast.tsx` - Notifications toast

### Couleurs Tailwind à Vérifier

**Rouge:**

- `text-red-50` sur `bg-red-600` ❌ (trop faible)
- `text-red-600` sur `bg-red-50` ✅ (OK)
- `text-red-700` sur `bg-white` ✅ (OK)

**Orange:**

- `text-orange-50` sur `bg-orange-600` ❌ (trop faible)
- `text-orange-600` sur `bg-orange-50` ✅ (OK)
- `text-orange-700` sur `bg-white` ✅ (OK)

**Amber/Yellow:**

- `text-amber-50` sur `bg-amber-600` ❌ (trop faible)
- `text-amber-600` sur `bg-amber-50` ⚠️ (vérifier)
- `text-amber-700` sur `bg-white` ✅ (OK)

**Vert:**

- `text-green-50` sur `bg-green-600` ❌ (trop faible)
- `text-green-600` sur `bg-green-50` ✅ (OK)
- `text-green-700` sur `bg-white` ✅ (OK)

---

## 🔧 Corrections Recommandées

### Pattern Général

**❌ Mauvais (contraste faible):**

```typescript
<div className="bg-red-600 text-red-50">  // Ratio ~2.5:1
  Texte peu lisible
</div>
```

**✅ Bon (contraste suffisant):**

```typescript
<div className="bg-red-600 text-white">  // Ratio ~5.6:1
  Texte lisible
</div>
```

### Exemples de Corrections

#### 1. Badges sur Fond Coloré

**Avant:**

```typescript
<span className="bg-red-50 text-red-600">  // OK mais peut être amélioré
```

**Après (si nécessaire):**

```typescript
<span className="bg-red-100 text-red-700">  // Meilleur contraste
```

#### 2. Textes sur Fond Clair

**Avant:**

```typescript
<div className="bg-yellow-50 text-yellow-500">  // Vérifier ratio
```

**Après (si nécessaire):**

```typescript
<div className="bg-yellow-100 text-yellow-700">  // Meilleur contraste
```

---

## 📝 Actions à Effectuer

### Phase 1 : Audit Complet

1. ⏳ Installer axe DevTools ou WAVE
2. ⏳ Auditer toutes les pages principales
3. ⏳ Lister toutes les violations de contraste
4. ⏳ Prioriser par fréquence d'utilisation

### Phase 2 : Corrections

1. ⏳ Corriger les contrastes < 4.5:1 (texte normal)
2. ⏳ Corriger les contrastes < 3:1 (grand texte)
3. ⏳ Tester visuellement chaque correction
4. ⏳ Vérifier avec les outils d'audit

### Phase 3 : Validation

1. ⏳ Relancer l'audit Lighthouse
2. ⏳ Vérifier le score Accessibility
3. ⏳ Tester avec lecteurs d'écran (optionnel)

---

## 🎯 Résultats Attendus

Après corrections :

- ✅ Score Accessibility : 87 → 90+ (+3 points)
- ✅ Conformité WCAG AA complète
- ✅ Meilleure lisibilité pour tous les utilisateurs
- ✅ Conformité légale améliorée

---

## 📚 Ressources

- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Contrast Ratio Calculator:** https://contrast-ratio.com/
- **Tailwind Color Palette:** https://tailwindcss.com/docs/customizing-colors

---

**Document créé le:** 2025-01-05  
**Dernière mise à jour:** 2025-01-05

