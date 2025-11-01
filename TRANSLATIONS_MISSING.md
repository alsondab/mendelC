# Traductions Manquantes - Admin Dashboard

Ce document liste toutes les traductions manquantes identifiées dans le système, particulièrement dans le dashboard admin.

## 📋 Sections à ajouter dans `messages/fr.json`

### 1. Section `Admin.Stock` (Gestion des Stocks)

```json
"Stock": {
  "Title": "Gestion des Stocks",
  "Description": "Surveillez et gérez les niveaux de stock de vos produits",
  "TotalProducts": "Total Produits",
  "PublishedProducts": "Produits publiés",
  "InStock": "En Stock",
  "SufficientStock": "Stock suffisant",
  "LowStock": "Stock Faible",
  "AttentionRequired": "Attention requise",
  "OutOfStock": "Rupture",
  "UrgentRestock": "Réapprovisionnement urgent",
  "TotalStockValue": "Valeur Totale du Stock",
  "ValueCalculatedAtCurrentPrice": "Valeur calculée au prix de vente actuel",
  "OutOfStockProducts": "Ruptures de Stock",
  "OutOfStockDescription": "Produits nécessitant un réapprovisionnement urgent",
  "NoOutOfStock": "Aucune rupture de stock",
  "LowStockProducts": "Stock Faible",
  "LowStockDescription": "Produits nécessitant une attention",
  "NoLowStockProducts": "Aucun produit en stock faible",
  "Stock": "Stock",
  "Threshold": "Seuil",
  "QuickActions": "Actions Rapides",
  "QuickActionsDescription": "Gestion rapide des stocks",
  "ManageAllProducts": "Gérer tous les produits",
  "AddProduct": "Ajouter un produit",
  "ViewHistory": "Voir l'historique"
}
```

### 2. Section `Admin.StockHistory` (Historique des Stocks)

```json
"StockHistory": {
  "Title": "Historique des Mouvements de Stock",
  "Description": "Traçabilité complète de tous les mouvements de stock",
  "Back": "Retour",
  "TotalMovements": "Total Mouvements",
  "Movements": "Mouvements",
  "ChronologicalList": "Liste chronologique des modifications de stock",
  "NoMovements": "Aucun mouvement enregistré",
  "MovementType": {
    "Sale": "Vente",
    "Adjustment": "Ajustement",
    "Restock": "Réapprovisionnement",
    "Return": "Retour",
    "Damage": "Dommage",
    "Transfer": "Transfert"
  },
  "Before": "Avant",
  "After": "Après",
  "By": "Par",
  "Order": "Commande",
  "ViewProduct": "Voir produit",
  "DefaultReason": "Mouvement de stock",
  "Units": "unités"
}
```

### 3. Section `Admin.StockThreshold` (Configuration des Seuils)

```json
"StockThreshold": {
  "ConfigureThresholds": "Configurer les seuils",
  "MinStockLevel": "Seuil minimum",
  "MaxStockLevel": "Seuil maximum",
  "MinStockLevelDescription": "Quantité minimale avant alerte de stock faible",
  "MaxStockLevelDescription": "Quantité maximale de stock à maintenir",
  "ValidationError": "Erreur de validation",
  "MinCannotBeNegative": "Le seuil minimum ne peut pas être négatif",
  "MaxMustBeGreaterThanMin": "Le seuil maximum doit être supérieur au seuil minimum",
  "Success": "Succès",
  "Error": "Erreur",
  "UpdateError": "Une erreur est survenue lors de la mise à jour",
  "Cancel": "Annuler",
  "Save": "Sauvegarder",
  "Reset": "Réinitialiser"
}
```

### 4. Section `Admin.Notifications` (Notifications)

```json
"Notifications": {
  "Title": "Notifications de Stock",
  "Description": "Configurez les alertes et notifications pour la gestion des stocks",
  "EmailNotifications": "Notifications par email",
  "EnableEmailNotifications": "Activer les notifications par email",
  "EmailNotificationsDescription": "Recevez des emails automatiques lorsque le stock est faible ou en rupture",
  "NotificationFrequency": "Fréquence des Notifications",
  "FrequencyDescription": "Détermine la fréquence d'envoi des notifications de stock",
  "Realtime": "Temps réel",
  "Hourly": "Toutes les heures",
  "Daily": "Quotidienne",
  "Weekly": "Hebdomadaire",
  "Recommended": "Recommandé",
  "NotificationMethods": "Méthodes de notification",
  "InInterface": "Dans l'interface",
  "Banner": "Bannière",
  "Toast": "Toast",
  "Save": "Sauvegarder",
  "SaveSuccess": "Paramètres sauvegardés avec succès",
  "SaveError": "Erreur lors de la sauvegarde des paramètres"
}
```

### 5. Section `Admin.Products` (Produits Admin)

```json
"Products": {
  "None": "Aucun",
  "InStock": "En stock",
  "LowStock": "Faible",
  "OutOfStock": "Rupture",
  "Published": "Publié",
  "Draft": "Brouillon",
  "View": "Voir",
  "Edit": "Modifier",
  "Delete": "Supprimer",
  "CreateProduct": "Créer un produit",
  "ProductName": "Nom du produit",
  "EnterProductName": "Entrez le nom du produit",
  "Brand": "Marque",
  "EnterBrand": "Entrez la marque",
  "MissingProductId": "ID du produit manquant",
  "FormSubmissionError": "Une erreur est survenue lors de la soumission du formulaire",
  "CorrectFormErrors": "Veuillez corriger les erreurs dans le formulaire"
}
```

### 6. Section `Admin.Orders` (Commandes Admin)

```json
"Orders": {
  "InProgress": "En cours",
  "Paid": "Payé",
  "Delivered": "Livré",
  "Cancelled": "Annulé"
}
```

### 7. Section `Admin.Users` (Utilisateurs Admin)

```json
"Users": {
  "Admin": "Admin",
  "User": "Utilisateur",
  "EditUser": "Modifier",
  "DeleteUser": "Supprimer"
}
```

### 8. Section `Admin.Categories` (Catégories Admin)

```json
"Categories": {
  "SortByName": "Par nom",
  "NoSort": "Aucun tri",
  "NoDescription": "Aucune description",
  "Delete": "Supprimer",
  "Edit": "Modifier",
  "ImageUrl": "URL de l'image",
  "NameRequired": "Le nom est requis",
  "SlugRequired": "Le slug est requis",
  "Error": "Erreur",
  "ErrorOccurred": "Une erreur est survenue"
}
```

### 9. Section `Admin.Settings` (Paramètres Admin)

```json
"Settings": {
  "SiteInformation": "Informations du site",
  "Carousels": "Carrousels",
  "Languages": "Langues",
  "Currencies": "Devises",
  "PaymentMethods": "Moyens de paiement",
  "DeliveryDates": "Dates de livraison",
  "EnterSiteName": "Entrez le nom du site",
  "EnterUrl": "Entrez l'URL",
  "EnterImageUrl": "Entrez l'URL de l'image",
  "EnterDescription": "Entrez la description",
  "EnterSlogan": "Entrez le slogan",
  "EnterKeywords": "Entrez les mots-clés",
  "EnterPhoneNumber": "Entrez le numéro de téléphone",
  "EnterEmailAddress": "Entrez l'adresse email",
  "EnterAddress": "Entrez l'adresse",
  "EnterCopyright": "Entrez le copyright",
  "EnterPageSize": "Entrez la taille de page",
  "Name": "Nom",
  "Commission": "Commission",
  "Code": "Code",
  "Symbol": "Symbole",
  "ConvertRate": "Taux de conversion",
  "SelectColor": "Sélectionner une couleur",
  "SelectTheme": "Sélectionner un thème",
  "SelectLanguage": "Sélectionner une langue",
  "SelectCurrency": "Sélectionner une devise",
  "SelectRole": "Sélectionner un rôle",
  "EnterUserName": "Entrez le nom d'utilisateur",
  "EnterUserEmail": "Entrez l'email de l'utilisateur",
  "Title": "Titre",
  "Url": "Url",
  "DeliveryPrice": "Prix de livraison"
}
```

### 10. Section `Common` (Commun - déjà existe, à compléter)

```json
"Common": {
  "Close": "Fermer",
  "Retry": "Réessayer",
  "Loading": "Chargement...",
  "Error": "Erreur",
  "Success": "Succès",
  "Save": "Sauvegarder",
  "Cancel": "Annuler",
  "Delete": "Supprimer",
  "Edit": "Modifier",
  "View": "Voir",
  "Back": "Retour",
  "Next": "Suivant",
  "Previous": "Précédent"
}
```

## 🔄 Fichiers à modifier

Les fichiers suivants doivent être mis à jour pour utiliser les traductions :

### Pages Admin :
1. `app/[locale]/admin/stock/page.tsx`
2. `app/[locale]/admin/stock/history/page.tsx`
3. `app/[locale]/admin/notifications/page.tsx`
4. `app/[locale]/admin/products/product-list.tsx`
5. `app/[locale]/admin/products/product-form.tsx`
6. `app/[locale]/admin/orders/orders-list.tsx`
7. `app/[locale]/admin/users/users-list.tsx`
8. `app/[locale]/admin/categories/category-list.tsx`
9. `app/[locale]/admin/categories/category-form.tsx`
10. `app/[locale]/admin/settings/*.tsx` (tous les formulaires)

### Composants :
1. `components/shared/notifications/stock-threshold-config.tsx`
2. `components/shared/notifications/global-stock-thresholds-config.tsx`
3. `components/shared/notifications/notification-settings.tsx`

## ✅ Actions à faire

1. Ajouter toutes les sections ci-dessus dans `messages/fr.json`
2. Créer les mêmes traductions dans `messages/en-US.json` (anglais)
3. Remplacer tous les textes en dur par `t('Clé.Translation')` dans les fichiers listés
4. Tester toutes les pages admin pour s'assurer que les traductions fonctionnent



