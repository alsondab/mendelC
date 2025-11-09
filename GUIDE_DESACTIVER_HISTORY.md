# 🗑️ Guide : Désactiver l'extension Local History dans VS Code

## ✅ Étape 1 : Dossier supprimé

Le dossier `.history` a été supprimé avec succès (7.05 MB libérés).

---

## 🔧 Étape 2 : Désactiver l'extension VS Code

### Méthode 1 : Via l'interface VS Code (Recommandé)

1. **Ouvrir les Extensions**
   - Appuyez sur `Ctrl + Shift + X` (Windows/Linux)
   - Ou cliquez sur l'icône Extensions dans la barre latérale

2. **Rechercher l'extension**
   - Dans la barre de recherche, tapez : `Local History`
   - Cherchez l'extension "Local History" par **xyzlocal** ou similaire

3. **Désactiver l'extension**
   - Cliquez sur l'extension trouvée
   - Cliquez sur le bouton **"Désactiver"** (Disable)
   - Ou cliquez sur l'icône ⚙️ (engrenage) → **"Désactiver"**

4. **Optionnel : Désinstaller**
   - Si vous ne voulez plus l'extension du tout
   - Cliquez sur **"Désinstaller"** (Uninstall)

---

### Méthode 2 : Via les paramètres VS Code

1. **Ouvrir les paramètres**
   - Appuyez sur `Ctrl + ,` (virgule)
   - Ou : Fichier → Préférences → Paramètres

2. **Rechercher "local history**
   - Dans la barre de recherche des paramètres, tapez : `local history`

3. **Désactiver les paramètres**
   - Décochez toutes les options liées à "Local History"
   - Ou désactivez l'extension complètement

---

### Méthode 3 : Via le fichier settings.json

1. **Ouvrir settings.json**
   - Appuyez sur `Ctrl + Shift + P`
   - Tapez : `Preferences: Open User Settings (JSON)`
   - Appuyez sur Entrée

2. **Ajouter la configuration**
   ```json
   {
     "local-history.enabled": false,
     "local-history.path": null
   }
   ```

3. **Sauvegarder** (`Ctrl + S`)

---

## 🎯 Vérification

Après avoir désactivé l'extension :

1. **Fermez et rouvrez VS Code**
2. **Modifiez un fichier** dans votre projet
3. **Vérifiez** qu'aucun dossier `.history` n'est recréé

---

## 📝 Note importante

Le dossier `.history` est maintenant dans :
- ✅ `.gitignore` → Ne sera pas commité dans Git
- ✅ `.prettierignore` → Ne sera pas formaté par Prettier

Même si l'extension est réactivée par erreur, le dossier ne sera pas traité par Git ou Prettier.

---

## 🔍 Extensions VS Code qui créent `.history`

Les extensions courantes qui créent ce dossier :
- **Local History** (xyzlocal)
- **Local History** (ryu1kn)
- **File History** (autres variantes)

Si vous avez plusieurs extensions similaires, désactivez-les toutes.

---

**Date de création :** 2025-01-05


