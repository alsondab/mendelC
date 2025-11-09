# 📦 Guide : Dossiers `.next` et `node_modules`

## 📊 Taille Actuelle

| Dossier        | Taille       | Description              |
| -------------- | ------------ | ------------------------ |
| `.next`        | **~1.09 GB** | Dossier de build Next.js |
| `node_modules` | **~1.05 GB** | Dépendances npm          |
| **Total**      | **~2.14 GB** |                          |

---

## 🗂️ Qu'est-ce que `.next` ?

### Description

Le dossier `.next` est créé automatiquement par Next.js lors de la compilation (`npm run build` ou `npm run dev`).

### Contenu

- Fichiers JavaScript compilés
- Pages statiques générées
- Assets optimisés
- Cache de build

### Peut-on le supprimer ?

✅ **OUI, sans problème !**

- ✅ Il sera recréé automatiquement lors du prochain build
- ✅ Déjà dans `.gitignore` (ne sera pas commité)
- ✅ Libère ~1 GB d'espace disque

### Quand le supprimer ?

- 🧹 **Nettoyage d'espace disque**
- 🔄 **Après des erreurs de build** (pour repartir à zéro)
- 📦 **Avant de partager le projet** (il sera recréé par les autres développeurs)
- 🚀 **Avant un déploiement** (le build sera fait sur le serveur)

### Comment le recréer ?

```bash
npm run build    # Build de production
# ou
npm run dev      # Build de développement
```

---

## 📚 Qu'est-ce que `node_modules` ?

### Description

Le dossier `node_modules` contient toutes les dépendances npm installées (packages, bibliothèques).

### Contenu

- Toutes les bibliothèques listées dans `package.json`
- Dépendances des dépendances (dépendances transitives)
- Fichiers binaires et sources des packages

### Peut-on le supprimer ?

✅ **OUI, sans problème !**

- ✅ Il sera recréé avec `npm install`
- ✅ Déjà dans `.gitignore` (ne sera pas commité)
- ✅ Libère ~1 GB d'espace disque

### Quand le supprimer ?

- 🧹 **Nettoyage d'espace disque**
- 🔄 **Après des erreurs d'installation** (pour réinstaller proprement)
- 📦 **Avant de partager le projet** (les autres devront faire `npm install`)
- 🐛 **Résolution de problèmes de dépendances**

### Comment le recréer ?

```bash
npm install      # Réinstalle toutes les dépendances depuis package.json
```

---

## ⚠️ Important : Ces dossiers sont déjà protégés

Les deux dossiers sont déjà dans `.gitignore` :

- ✅ `/node_modules` (ligne 4)
- ✅ `/.next/` (ligne 17)

Ils ne seront **jamais commités** dans Git, c'est normal et souhaitable.

---

## 🗑️ Comment supprimer ces dossiers ?

### Méthode 1 : PowerShell (Windows)

```powershell
# Supprimer .next
Remove-Item -Path ".next" -Recurse -Force

# Supprimer node_modules
Remove-Item -Path "node_modules" -Recurse -Force
```

### Méthode 2 : Command Prompt (Windows)

```cmd
rmdir /s /q .next
rmdir /s /q node_modules
```

### Méthode 3 : Via l'explorateur Windows

- Sélectionner le dossier
- Appuyer sur `Suppr` ou `Shift + Suppr` (suppression définitive)

---

## 🔄 Comment les recréer après suppression ?

### 1. Recréer `node_modules`

```bash
npm install
```

⏱️ **Temps estimé :** 2-5 minutes selon la connexion

### 2. Recréer `.next`

```bash
# Pour développement
npm run dev

# Pour production
npm run build
```

⏱️ **Temps estimé :** 1-3 minutes

---

## 💡 Recommandations

### ✅ À faire régulièrement

- Supprimer `.next` si vous avez des problèmes de build
- Supprimer `node_modules` si vous avez des problèmes de dépendances

### ❌ À ne PAS faire

- ❌ Ne pas commit ces dossiers dans Git (déjà protégé ✅)
- ❌ Ne pas les supprimer si vous êtes en train de développer (ils seront recréés automatiquement)

### 🎯 Quand les garder

- ✅ Pendant le développement actif
- ✅ Si vous avez besoin de tester rapidement

### 🧹 Quand les supprimer

- ✅ Avant de partager le projet
- ✅ Pour libérer de l'espace disque
- ✅ Après des erreurs de build/installation
- ✅ Avant un déploiement

---

## 📝 Script de nettoyage rapide

Vous pouvez créer un script pour nettoyer facilement :

**`package.json` :**

```json
{
  "scripts": {
    "clean": "rm -rf .next node_modules",
    "clean:build": "rm -rf .next",
    "clean:deps": "rm -rf node_modules",
    "fresh": "npm run clean && npm install"
  }
}
```

**Utilisation :**

```bash
npm run clean        # Supprime .next et node_modules
npm run clean:build  # Supprime seulement .next
npm run clean:deps   # Supprime seulement node_modules
npm run fresh        # Nettoie tout et réinstalle
```

---

## 🎯 Résumé

| Dossier        | Supprimable ? | Recréation                       | Taille |
| -------------- | ------------- | -------------------------------- | ------ |
| `.next`        | ✅ Oui        | `npm run build` ou `npm run dev` | ~1 GB  |
| `node_modules` | ✅ Oui        | `npm install`                    | ~1 GB  |

**Total libérable :** ~2 GB d'espace disque

---

**Date de création :** 2025-01-05

