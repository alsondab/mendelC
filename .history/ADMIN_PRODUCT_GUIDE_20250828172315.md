# 📋 Guide d'Administration - Gestion des Produits

## 🏷️ Tags (Mots-clés)

Les tags permettent de catégoriser et promouvoir vos produits dans différentes sections du site.

### Tags Disponibles

| Tag           | Description           | Section d'affichage                                        |
| ------------- | --------------------- | ---------------------------------------------------------- |
| `todays-deal` | Produit en promotion  | Affiche "Offre à durée limitée" + pourcentage de réduction |
| `best-seller` | Produit populaire     | Section "Best Sellers"                                     |
| `featured`    | Produit mis en avant  | Section "Featured Products"                                |
| `new-arrival` | Nouveau produit       | Section "New Arrivals"                                     |
| `premium`     | Produit haut de gamme | Section spéciale (si implémentée)                          |

### Comment utiliser les tags

1. **Dans le formulaire de produit**, section "Tags (Mots-clés)"
2. **Entrez un tag par ligne** dans le champ texte
3. **Exemple :**
   ```
   todays-deal
   best-seller
   featured
   ```

## 💰 Gestion des Réductions

### Comment créer une réduction

1. **Prix Original (List Price)** : Définissez le prix avant réduction
2. **Prix de Vente (Net Price)** : Définissez le prix actuel
3. **Tag `todays-deal`** : Ajoutez ce tag pour activer l'affichage promotionnel

### Exemple de réduction

- **Prix Original** : 100.00€
- **Prix de Vente** : 69.00€
- **Résultat** : 31% de réduction affichée automatiquement

### Affichage automatique

- ✅ **Pourcentage de réduction** calculé automatiquement
- ✅ **"Offre à durée limitée"** affiché avec le tag `todays-deal`
- ✅ **Prix barré** (prix original) affiché à côté du prix actuel
- ✅ **Mise en forme** en rouge pour attirer l'attention

---

## ⏰ **PROMOTIONS TEMPORAIRES AVEC EXPIRATION AUTOMATIQUE**

### 🎯 **Système Intelligent de Gestion des Promotions**

Votre système gère maintenant **automatiquement** l'expiration des promotions et ajuste les tags selon les performances !

#### **Comment créer une promotion temporaire :**

1. **Dans le formulaire de produit**, section "Promotions Temporaires"
2. **Définissez une date d'expiration** (obligatoire)
3. **Optionnel :** Définissez une date de début
4. **Le système expire automatiquement** la promotion à la date fixée

#### **Champs ajoutés au formulaire :**

- **📅 Date de début de promotion** : Quand la promotion commence
- **⏰ Date d'expiration de promotion** : Quand la promotion se termine
- **🏷️ Tags originaux** : Sauvegardés automatiquement
- **🔄 Statut de promotion** : Actif/Inactif

#### **🔄 Cycle automatique d'une promotion :**

```
Jour 1-7 : Produit en promotion avec tag "todays-deal"
    ↓
Jour 8 : Promotion expirée automatiquement
    ↓
Système analyse les performances et ajuste les tags :
    • Si +10 ventes → devient "best-seller" + "featured"
    • Si bien vendu → devient "featured"
    • Si produit récent → garde "new-arrival"
    • Si prix élevé → devient "premium"
```

#### **🎯 Logique intelligente des tags :**

| Performance                       | Tags attribués automatiquement |
| --------------------------------- | ------------------------------ |
| **+10 ventes** pendant promotion  | `best-seller` + `featured`     |
| **Bien vendu**                    | `featured`                     |
| **Produit récent** (&lt;30 jours) | `new-arrival`                  |
| **Prix élevé** (&gt;500€)         | `premium`                      |

#### **📊 Interface d'administration :**

- **Page dédiée** : `/admin/promotions`
- **Statistiques en temps réel** : Promotions actives, expirées, total
- **Actions rapides** : Activer/désactiver des promotions
- **Guide intégré** : Explications et bonnes pratiques

#### **🔧 Configuration technique :**

- **Vérification automatique** : Via API `/api/cron/check-promotions`
- **Sécurité** : Authentification par token pour les appels cron
- **Logs détaillés** : Suivi de toutes les actions automatiques
- **Gestion d'erreurs** : Récupération automatique en cas de problème

#### **📈 Avantages du système :**

- ✅ **Promotions temporaires** avec expiration automatique
- ✅ **Tags ajustés intelligemment** selon les performances
- ✅ **Promotion automatique** des produits performants
- ✅ **Gestion centralisée** des promotions
- ✅ **Statistiques détaillées** des performances
- ✅ **Interface intuitive** pour les administrateurs

## 🎨 Gestion des Couleurs

### Comment ajouter des couleurs

1. **Dans le formulaire de produit**, section "Couleurs"
2. **Entrez une couleur par ligne**
3. **Exemple :**
   ```
   White
   Red
   Black
   Blue
   ```

### Utilisation des couleurs

- Les couleurs apparaissent dans le sélecteur de variantes sur la page produit
- Permettent aux clients de choisir la couleur souhaitée
- Sont affichées dans le panier et les commandes

## 🔍 Filtres de Recherche

Les tags sont automatiquement utilisés dans la page de recherche :

- **Section "Tag"** dans les filtres
- **Filtrage par mot-clé** (Best Seller, Featured, etc.)
- **Recherche avancée** par catégorie de produit

## 📱 Sections d'Affichage

### Page d'accueil

- **Catégories à explorer** : Basé sur la catégorie du produit
- **New Arrivals** : Produits avec le tag `new-arrival`
- **Best Sellers** : Produits avec le tag `best-seller`
- **Featured Products** : Produits avec le tag `featured`

### Page de recherche

- **Filtres par tag** disponibles dans la sidebar
- **Tri automatique** par popularité, prix, nouveauté
- **Affichage des réductions** pour les produits en promotion

## ⚠️ Bonnes Pratiques

1. **Tags cohérents** : Utilisez toujours les mêmes tags pour maintenir la cohérence
2. **Réductions réalistes** : Évitez les réductions excessives qui peuvent sembler suspectes
3. **Mise à jour régulière** : Actualisez les tags selon les saisons et promotions
4. **Vérification** : Testez l'affichage après avoir créé/modifié un produit

## 🚀 Prochaines Étapes

- [x] ✅ Gestion des promotions temporaires
- [x] ✅ Système automatique d'expiration
- [x] ✅ Ajustement intelligent des tags
- [ ] A/B testing des promotions
- [ ] Planification avancée des promotions

---

_Dernière mise à jour : $(date)_
