# 📚 Guide Complet de la Structure du Projet MendelCorp

**Date de création:** 2025-01-05  
**Version:** 1.0

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure Racine](#structure-racine)
3. [Dossier `/app` - Routes et Pages](#dossier-app---routes-et-pages)
4. [Dossier `/components` - Composants React](#dossier-components---composants-react)
5. [Dossier `/lib` - Logique Métier](#dossier-lib---logique-métier)
6. [Dossier `/hooks` - Hooks React Personnalisés](#dossier-hooks---hooks-react-personnalisés)
7. [Dossier `/types` - Définitions TypeScript](#dossier-types---définitions-typescript)
8. [Dossier `/messages` - Traductions i18n](#dossier-messages---traductions-i18n)
9. [Dossier `/public` - Assets Statiques](#dossier-public---assets-statiques)
10. [Fichiers de Configuration](#fichiers-de-configuration)

---

## 🎯 Vue d'ensemble

Ce projet est une **application e-commerce** construite avec **Next.js 15** (App Router), **TypeScript**, **MongoDB**, et **NextAuth.js**. Il utilise une architecture moderne avec :

- **Server Components** par défaut
- **Server Actions** pour les mutations de données
- **Internationalisation** (i18n) avec `next-intl`
- **Authentification** avec NextAuth.js
- **Gestion d'état** avec Zustand
- **Validation** avec Zod
- **Styling** avec Tailwind CSS

---

## 📁 Structure Racine

### Fichiers Principaux

#### `package.json`

**Rôle:** Définit les dépendances et scripts du projet.

**Scripts importants:**

- `dev`: Lance le serveur de développement
- `build`: Compile l'application pour la production
- `start`: Lance le serveur de production
- `seed`: Peuple la base de données avec des données de test
- `analyze`: Analyse la taille du bundle JavaScript

**Dépendances clés:**

- `next`: Framework React
- `react`, `react-dom`: Bibliothèque React
- `next-intl`: Internationalisation
- `next-auth`: Authentification
- `mongoose`: ODM pour MongoDB
- `zod`: Validation de schémas
- `zustand`: Gestion d'état légère
- `framer-motion`: Animations
- `tailwindcss`: Framework CSS

---

#### `next.config.ts`

**Rôle:** Configuration de Next.js pour optimisations et fonctionnalités.

**Optimisations configurées:**

- ✅ Bundle Analyzer (analyse du bundle JS)
- ✅ Optimisation des images (AVIF, WebP)
- ✅ Code splitting personnalisé (webpack)
- ✅ Optimisation CSS (inline CSS critique)
- ✅ Modularisation des imports (framer-motion, lucide-react)
- ✅ Suppression des console.log en production

**Points clés:**

- Configuration de `next-intl` pour l'i18n
- Configuration des images UploadThing
- Optimisations webpack pour réduire la taille du bundle

---

#### `middleware.ts`

**Rôle:** Intercepte les requêtes HTTP avant qu'elles n'atteignent les pages.

**Fonctionnalités:**

1. **Internationalisation:** Ajoute le préfixe de locale (`/fr`, `/en`) aux URLs
2. **Authentification:** Vérifie si l'utilisateur est connecté pour les pages protégées
3. **Redirection:** Redirige vers `/sign-in` si accès non autorisé

**Pages publiques:** `/`, `/search`, `/sign-in`, `/sign-up`, `/cart`, `/product/*`

**Pages protégées:** `/account/*`, `/admin/*`, `/checkout/*`

---

#### `tsconfig.json`

**Rôle:** Configuration TypeScript pour le projet.

**Points importants:**

- Path aliases (`@/` pointe vers la racine)
- Configuration stricte pour la sécurité des types
- Support des imports JSX

---

#### `tailwind.config.ts`

**Rôle:** Configuration de Tailwind CSS (couleurs, thèmes, plugins).

**Personnalisations:**

- Palette de couleurs luxueuse (or et rouge)
- Thème dark mode
- Animations personnalisées
- Classes utilitaires personnalisées

---

#### `auth.config.ts` et `auth.ts`

**Rôle:** Configuration de NextAuth.js pour l'authentification.

**Fonctionnalités:**

- Authentification par email/mot de passe
- Authentification OAuth (Google)
- Gestion des sessions
- Protection des routes

---

#### `i18n-config.ts`

**Rôle:** Configuration de l'internationalisation.

**Langues supportées:**

- Français (`fr`) - par défaut
- Anglais (`en`)

---

## 📁 Dossier `/app` - Routes et Pages

**Rôle:** Contient toutes les routes de l'application (App Router de Next.js 15).

### Structure `/app/[locale]`

Le dossier `[locale]` est un **segment dynamique** qui capture la langue (`fr` ou `en`).

#### `layout.tsx` (Layout Principal)

**Rôle:** Layout racine qui enveloppe toutes les pages.

**Fonctionnalités:**

- Configuration des métadonnées SEO
- Initialisation des providers (NextIntl, ClientProviders)
- Structure HTML de base

**Composants inclus:**

- `<ClientProviders>`: Providers React (Session, Theme, etc.)
- `<FloatingCartButton>`: Bouton panier flottant
- `<MobileBottomNav>`: Navigation mobile

---

#### `loading.tsx`

**Rôle:** Composant de chargement affiché pendant le chargement des pages.

**Optimisation:** Utilise CSS animations au lieu de framer-motion pour réduire le bundle.

---

#### `error.tsx` et `not-found.tsx`

**Rôle:** Pages d'erreur personnalisées.

- `error.tsx`: Erreurs générales
- `not-found.tsx`: Page 404

---

### Route Groups (Groupes de Routes)

Les **route groups** sont des dossiers entre parenthèses `()` qui organisent les routes sans affecter l'URL.

#### `(auth)` - Routes d'Authentification

**Dossier:** `/app/[locale]/(auth)/`

**Pages:**

- `sign-in/page.tsx`: Page de connexion
- `sign-up/page.tsx`: Page d'inscription

**Layout:** `layout.tsx` - Layout spécifique pour l'authentification

---

#### `(home)` - Page d'Accueil

**Dossier:** `/app/[locale]/(home)/`

**Pages:**

- `page.tsx`: Page d'accueil principale

**Composants:**

- `<HomeCarousel>`: Carousel principal (lazy-loaded)
- `<ProductSlider>`: Sliders de produits (lazy-loaded)
- `<HomeCard>`: Cartes de catégories

---

#### `(root)` - Routes Publiques Principales

**Dossier:** `/app/[locale]/(root)/`

**Pages principales:**

##### `/account/*` - Gestion du Compte

- `page.tsx`: Tableau de bord du compte
- `addresses/page.tsx`: Gestion des adresses
- `orders/page.tsx`: Liste des commandes
- `orders/[id]/page.tsx`: Détails d'une commande
- `manage/name/page.tsx`: Modifier le nom
- `manage/email/page.tsx`: Modifier l'email
- `manage/password/page.tsx`: Modifier le mot de passe
- `settings/page.tsx`: Paramètres du compte

##### `/search` - Recherche de Produits

- `page.tsx`: Page de recherche avec filtres et tri

##### `/product/[slug]` - Page Produit

- `page.tsx`: Détails d'un produit
- `review-list.tsx`: Liste des avis clients

##### `/cart` - Panier

- `page.tsx`: Page du panier
- `[itemId]/page.tsx`: Ajouter un article au panier

##### `/wishlist` - Liste de Souhaits

- `page.tsx`: Liste des produits favoris

##### Pages Légales

- `/aide`: Aide
- `/conditions-utilisation`: CGV
- `/politique-confidentialite`: Politique de confidentialité
- `/questions-frequentes`: FAQ
- `/retours-remplacements`: Retours
- `/tarifs-expedition`: Tarifs d'expédition

---

### `/admin` - Dashboard Administrateur

**Dossier:** `/app/[locale]/admin/`

**Pages principales:**

#### `/admin/overview` - Vue d'Ensemble

- `page.tsx`: Tableau de bord avec statistiques
- `overview-report.tsx`: Rapport détaillé
- `sales-area-chart.tsx`: Graphique des ventes (lazy-loaded Recharts)
- `sales-category-pie-chart.tsx`: Graphique par catégorie (lazy-loaded Recharts)

#### `/admin/products` - Gestion des Produits

- `page.tsx`: Liste des produits
- `product-list.tsx`: Composant de liste
- `product-form.tsx`: Formulaire de création/édition
- `create/page.tsx`: Page de création
- `[id]/page.tsx`: Page d'édition

#### `/admin/categories` - Gestion des Catégories

- `page.tsx`: Liste des catégories
- `category-list.tsx`: Composant de liste
- `category-form.tsx`: Formulaire de création/édition
- `create/page.tsx`: Page de création
- `[id]/page.tsx`: Page d'édition

#### `/admin/orders` - Gestion des Commandes

- `page.tsx`: Liste des commandes
- `orders-list.tsx`: Composant de liste
- `[id]/page.tsx`: Détails d'une commande

#### `/admin/users` - Gestion des Utilisateurs

- `page.tsx`: Liste des utilisateurs
- `users-list.tsx`: Composant de liste
- `[id]/page.tsx`: Page d'édition utilisateur

#### `/admin/stock` - Gestion des Stocks

- `page.tsx`: Vue d'ensemble des stocks
- `history/page.tsx`: Historique des mouvements de stock

#### `/admin/notifications` - Notifications

- `page.tsx`: Gestion des notifications de stock

#### `/admin/settings` - Paramètres Globaux

- `page.tsx`: Page principale des paramètres
- `settings-page.tsx`: Composant principal
- `setting-form.tsx`: Formulaire général
- `common-form.tsx`: Paramètres communs
- `site-info-form.tsx`: Informations du site
- `currency-form.tsx`: Gestion des devises
- `language-form.tsx`: Gestion des langues
- `delivery-date-form.tsx`: Dates de livraison
- `payment-method-form.tsx`: Méthodes de paiement
- `carousel-form.tsx`: Configuration du carousel

**Layout:** `layout.tsx` - Layout admin avec navigation

**Navigation:** `admin-nav.tsx` - Barre de navigation admin

---

### `/checkout` - Processus de Commande

**Dossier:** `/app/[locale]/checkout/`

**Pages:**

- `page.tsx`: Page de checkout principale
- `checkout-form.tsx`: Formulaire de commande
- `checkout-footer.tsx`: Footer du checkout
- `[id]/page.tsx`: Confirmation de commande
- `[id]/payment-form.tsx`: Formulaire de paiement

**Layout:** `layout.tsx` - Layout spécifique au checkout

---

### `/api` - Routes API

**Dossier:** `/app/api/`

**Routes API:**

#### `/api/auth/[...nextauth]/route.ts`

**Rôle:** Endpoint NextAuth.js pour l'authentification.

**Fonctionnalités:**

- Connexion/déconnexion
- Gestion des sessions
- Callbacks OAuth

---

#### `/api/search/suggestions/route.ts`

**Rôle:** API pour les suggestions de recherche.

**Fonctionnalités:**

- Recherche de produits en temps réel
- Suggestions de recherche

---

#### `/api/stock/notifications/route.ts`

**Rôle:** API pour les notifications de stock.

**Fonctionnalités:**

- Vérification des stocks faibles
- Envoi de notifications

---

#### `/api/uploadthing/route.ts` et `core.ts`

**Rôle:** Configuration UploadThing pour l'upload d'images.

**Fonctionnalités:**

- Upload d'images de produits
- Upload d'images de catégories
- Optimisation automatique

---

### `globals.css`

**Rôle:** Styles CSS globaux de l'application.

**Contenu:**

- Configuration Tailwind CSS
- Variables CSS personnalisées (couleurs, thèmes)
- Styles de scrollbar personnalisés
- Animations CSS (ripple effect, etc.)

---

## 📁 Dossier `/components` - Composants React

**Rôle:** Contient tous les composants React réutilisables.

### Structure `/components/shared`

Composants partagés utilisés dans plusieurs pages.

#### `/components/shared/header/` - En-tête

**Rôle:** Composants de la barre de navigation principale.

**Composants:**

- `index.tsx`: Header principal
- `cart-button.tsx`: Bouton panier (CSS animations ✅)
- `wishlist-count.tsx`: Compteur de favoris (CSS animations ✅)
- `search.tsx`: Barre de recherche
- `user-button.tsx`: Menu utilisateur
- `logout-button.tsx`: Bouton de déconnexion
- `language-switcher.tsx`: Sélecteur de langue
- `menu.tsx`: Menu de navigation
- `sidebar.tsx`: Menu latéral mobile
- `category-accordion.tsx`: Accordéon des catégories
- `floating-cart-button.tsx`: Bouton panier flottant
- `sidebar-scroll-indicator.tsx`: Indicateur de scroll

---

#### `/components/shared/footer.tsx`

**Rôle:** Pied de page avec liens légaux et informations.

---

#### `/components/shared/product/` - Composants Produit

**Rôle:** Composants liés aux produits.

**Composants:**

- `product-card.tsx`: Carte produit (optimisé avec React.memo ✅)
- `product-price.tsx`: Affichage du prix
- `product-gallery.tsx`: Galerie d'images
- `image-hover.tsx`: Effet hover sur les images
- `add-to-cart.tsx`: Bouton "Ajouter au panier" (React.memo ✅)
- `wishlist-button.tsx`: Bouton favoris (React.memo ✅)
- `rating.tsx`: Système de notation (animations optimisées ✅)
- `rating-summary.tsx`: Résumé des notes
- `select-variant.tsx`: Sélection de variantes
- `product-sort-selector.tsx`: Tri des produits
- `product-slider.tsx`: Slider de produits (Embla Carousel)
- `product-loading.tsx`: Skeleton de chargement
- `product-edit-dialog.tsx`: Dialog d'édition produit
- `product-view-dialog.tsx`: Dialog de visualisation
- `stock-status.tsx`: Statut du stock
- `stock-product-actions.tsx`: Actions de gestion de stock

---

#### `/components/shared/cart-sidebar.tsx`

**Rôle:** Panier latéral (slider) qui s'ouvre depuis le header.

**Optimisation:** Lazy-loaded avec `dynamic()` ✅

**Fonctionnalités:**

- Affichage des articles du panier
- Modification des quantités
- Suppression d'articles
- Calcul automatique du total

---

#### `/components/shared/wishlist-sidebar.tsx`

**Rôle:** Liste de souhaits latérale (slider).

**Optimisation:** Lazy-loaded avec `dynamic()` ✅

---

#### `/components/shared/home/` - Composants Accueil

**Rôle:** Composants spécifiques à la page d'accueil.

**Composants:**

- `home-card.tsx`: Cartes de catégories (images optimisées ✅)
- `home-carousel.tsx`: Carousel principal (Embla Carousel, lazy-loaded ✅)

---

#### `/components/shared/notifications/` - Notifications

**Rôle:** Système de notifications de stock.

**Composants:**

- `stock-gauge.tsx`: Jauge de stock (animations optimisées ✅)
- `stock-alerts.tsx`: Alertes de stock
- `stock-alert-indicator.tsx`: Indicateur d'alertes
- `stock-persistent-alert.tsx`: Alerte persistante
- `stock-floating-alert.tsx`: Alerte flottante
- `stock-notification-toast.tsx`: Toast de notification
- `stock-threshold-config.tsx`: Configuration des seuils
- `global-stock-thresholds-config.tsx`: Configuration globale
- `notification-settings.tsx`: Paramètres de notifications
- `refresh-stock-button.tsx`: Bouton de rafraîchissement
- `animated-notification.tsx`: Notification animée

---

#### `/components/shared/order/` - Commandes

**Rôle:** Composants liés aux commandes.

**Composants:**

- `order-details-dialog.tsx`: Dialog de détails
- `order-details-form.tsx`: Formulaire de détails
- `order-loading.tsx`: Skeleton de chargement

---

#### `/components/shared/admin/` - Composants Admin

**Rôle:** Composants spécifiques à l'admin.

**Composants:**

- `admin-guard.tsx`: Protection des routes admin
- `admin-logout-button.tsx`: Bouton de déconnexion admin

---

#### Autres Composants Partagés

- `client-providers.tsx`: Providers React (Session, Theme, etc.)
- `app-initializer.tsx`: Initialisation de l'application
- `theme-provider.tsx`: Provider de thème (dark mode)
- `slider-auto-opener.tsx`: Ouverture automatique des sliders
- `slider-store-init.tsx`: Initialisation des stores de sliders
- `image-upload.tsx`: Composant d'upload d'images
- `pagination.tsx`: Composant de pagination
- `currency-selector.tsx`: Sélecteur de devise
- `delete-dialog.tsx`: Dialog de confirmation de suppression
- `mobile-bottom-nav.tsx`: Navigation mobile en bas
- `layout-components.tsx`: Composants de layout
- `network-optimizations.tsx`: Optimisations réseau
- `action-button.tsx`: Bouton d'action réutilisable
- `collapsible-on-mobile.tsx`: Collapsible responsive
- `separator-or.tsx`: Séparateur "OU"

---

### Structure `/components/ui`

Composants UI de base (design system) basés sur Radix UI et shadcn/ui.

**Composants disponibles:**

- `button.tsx`: Bouton (optimisé CSS ✅)
- `card.tsx`: Carte
- `dialog.tsx`: Dialog modal
- `alert-dialog.tsx`: Dialog d'alerte
- `input.tsx`: Champ de saisie
- `textarea.tsx`: Zone de texte
- `select.tsx`: Sélecteur
- `checkbox.tsx`: Case à cocher
- `radio-group.tsx`: Groupe de boutons radio
- `switch.tsx`: Interrupteur
- `label.tsx`: Label
- `form.tsx`: Formulaire (react-hook-form)
- `table.tsx`: Tableau
- `badge.tsx`: Badge
- `skeleton.tsx`: Skeleton de chargement
- `animated-skeleton.tsx`: Skeleton animé
- `toast.tsx` et `toaster.tsx`: Système de toast
- `scroll-area.tsx`: Zone de défilement
- `dropdown-menu.tsx`: Menu déroulant
- `popover.tsx`: Popover
- `sheet.tsx`: Sheet (drawer)
- `drawer.tsx`: Drawer mobile
- `collapsible.tsx`: Collapsible
- `separator.tsx`: Séparateur
- `progress.tsx`: Barre de progression
- `calendar.tsx`: Calendrier
- `carousel.tsx`: Carousel
- `password-input.tsx`: Champ de mot de passe
- `phone-input.tsx`: Champ de téléphone

---

## 📁 Dossier `/lib` - Logique Métier

**Rôle:** Contient toute la logique métier, les utilitaires et les interactions avec la base de données.

### Structure `/lib/actions`

**Rôle:** Server Actions Next.js pour les mutations de données.

**Fichiers:**

#### `product.actions.ts`

**Rôle:** Actions pour la gestion des produits.

**Fonctionnalités:**

- `createProduct()`: Créer un produit
- `updateProduct()`: Mettre à jour un produit
- `deleteProduct()`: Supprimer un produit
- `getProducts()`: Récupérer les produits
- `getProductBySlug()`: Récupérer un produit par slug

**Optimisations:**

- Cache avec `unstable_cache`
- Revalidation avec `revalidateTag` et `revalidatePath`

---

#### `order.actions.ts`

**Rôle:** Actions pour la gestion des commandes.

**Fonctionnalités:**

- `createOrder()`: Créer une commande
- `updateOrderStatus()`: Mettre à jour le statut
- `getOrders()`: Récupérer les commandes
- `getOrderById()`: Récupérer une commande
- `cancelOrder()`: Annuler une commande

---

#### `stock.actions.ts`

**Rôle:** Actions pour la gestion des stocks.

**Fonctionnalités:**

- `updateStock()`: Mettre à jour le stock
- `getStockInfo()`: Récupérer les infos de stock
- `checkLowStock()`: Vérifier les stocks faibles

---

#### `stock-notifications.actions.ts`

**Rôle:** Actions pour les notifications de stock.

**Fonctionnalités:**

- `checkStockNotifications()`: Vérifier les notifications
- `sendStockNotification()`: Envoyer une notification

---

#### `stock-history.actions.ts`

**Rôle:** Actions pour l'historique des stocks.

**Fonctionnalités:**

- `getStockHistory()`: Récupérer l'historique
- `createStockHistoryEntry()`: Créer une entrée

---

#### `category.actions.ts`

**Rôle:** Actions pour la gestion des catégories.

**Fonctionnalités:**

- `createCategory()`: Créer une catégorie
- `updateCategory()`: Mettre à jour
- `deleteCategory()`: Supprimer
- `getCategories()`: Récupérer les catégories

---

#### `user.actions.ts`

**Rôle:** Actions pour la gestion des utilisateurs.

**Fonctionnalités:**

- `updateUser()`: Mettre à jour un utilisateur
- `getUsers()`: Récupérer les utilisateurs
- `deleteUser()`: Supprimer un utilisateur

---

#### `review.actions.ts`

**Rôle:** Actions pour la gestion des avis.

**Fonctionnalités:**

- `createReview()`: Créer un avis
- `getReviews()`: Récupérer les avis
- `updateReview()`: Mettre à jour un avis

---

#### `address.actions.ts`

**Rôle:** Actions pour la gestion des adresses.

**Fonctionnalités:**

- `createAddress()`: Créer une adresse
- `updateAddress()`: Mettre à jour
- `deleteAddress()`: Supprimer
- `getAddresses()`: Récupérer les adresses

---

#### `setting.actions.ts`

**Rôle:** Actions pour la gestion des paramètres globaux.

**Fonctionnalités:**

- `getSetting()`: Récupérer les paramètres
- `updateSetting()`: Mettre à jour les paramètres

---

#### `notification-settings.actions.ts`

**Rôle:** Actions pour les paramètres de notifications.

**Fonctionnalités:**

- `getNotificationSettings()`: Récupérer les paramètres
- `updateNotificationSettings()`: Mettre à jour

---

### Structure `/lib/cache`

**Rôle:** Système de cache pour optimiser les performances.

**Fichiers:**

#### `product-cache.ts`

**Rôle:** Cache pour les produits.

**Fonctions:**

- `getCachedProductsForCard()`: Produits pour les cartes
- `getCachedProductsByTag()`: Produits par tag
- `getCachedProductBySlug()`: Produit par slug

**Stratégie:** Cache avec revalidation par tags

---

#### `category-cache.ts`

**Rôle:** Cache pour les catégories.

**Fonctions:**

- `getCachedCategoryTree()`: Arbre des catégories
- `getCachedCategories()`: Liste des catégories

---

#### `search-cache.ts`

**Rôle:** Cache pour les recherches.

**Fonctions:**

- `getCachedSearchResults()`: Résultats de recherche

---

#### `stock-cache.ts`

**Rôle:** Cache pour les stocks.

**Fonctions:**

- `getCachedStockInfo()`: Informations de stock

---

#### `admin-cache.ts`

**Rôle:** Cache pour les données admin.

**Fonctions:**

- `getCachedAdminStats()`: Statistiques admin

---

### Structure `/lib/db`

**Rôle:** Configuration et modèles de base de données MongoDB.

#### `client.ts`

**Rôle:** Client MongoDB (connexion à la base de données).

**Fonctionnalités:**

- Connexion à MongoDB Atlas
- Gestion des connexions
- Cache de connexion

---

#### `index.ts`

**Rôle:** Export centralisé des modèles.

---

#### `/lib/db/models/` - Modèles Mongoose

**Rôle:** Schémas Mongoose pour chaque entité.

**Modèles:**

##### `product.model.ts`

**Rôle:** Modèle de produit.

**Champs:**

- `name`, `slug`, `description`
- `price`, `salePrice`
- `images`, `category`, `subCategory`
- `countInStock`, `minStockLevel`, `maxStockLevel`
- `variants`, `specifications`
- `isPublished`, `tags`

---

##### `category.model.ts`

**Rôle:** Modèle de catégorie.

**Champs:**

- `name`, `slug`, `description`
- `image`, `parentCategory`
- `isActive`

---

##### `order.model.ts`

**Rôle:** Modèle de commande.

**Champs:**

- `user`, `items`
- `shippingAddress`, `paymentMethod`
- `itemsPrice`, `shippingPrice`, `taxPrice`, `totalPrice`
- `isPaid`, `paidAt`
- `isDelivered`, `deliveredAt`
- `status`

---

##### `user.model.ts`

**Rôle:** Modèle d'utilisateur.

**Champs:**

- `name`, `email`, `password`
- `role` (client/admin)
- `addresses`
- `isEmailVerified`

---

##### `address.model.ts`

**Rôle:** Modèle d'adresse.

**Champs:**

- `fullName`, `phone`, `address`, `city`, `postalCode`, `country`
- `isDefault`

---

##### `review.model.ts`

**Rôle:** Modèle d'avis client.

**Champs:**

- `user`, `product`
- `rating`, `comment`
- `isVerified` (vérifié si acheté)

---

##### `setting.model.ts`

**Rôle:** Modèle de paramètres globaux.

**Champs:**

- `siteInfo` (nom, description, etc.)
- `common` (thème, maintenance, etc.)
- `currency`, `languages`
- `deliveryDates`, `paymentMethods`
- `carousel`

---

##### `stock-history.model.ts`

**Rôle:** Modèle d'historique de stock.

**Champs:**

- `product`, `quantity`
- `type` (in/out/adjustment)
- `reason`, `user`
- `timestamp`

---

#### `seed.ts`

**Rôle:** Script de seed pour peupler la base de données.

**Fonctionnalités:**

- Création d'utilisateurs de test
- Création de catégories
- Création de produits
- Création de commandes

**Utilisation:** `npm run seed`

---

### Structure `/lib/utils`

**Rôle:** Fonctions utilitaires réutilisables.

#### `utils.ts`

**Rôle:** Utilitaires généraux.

**Fonctions:**

- `cn()`: Merge de classes Tailwind
- `formatNumber()`: Formatage de nombres
- `round2()`: Arrondi à 2 décimales
- `generateId()`: Génération d'ID
- `formatDateTime()`: Formatage de dates

---

#### `animations.ts`

**Rôle:** Variants d'animation réutilisables.

**Optimisation:** Type générique `AnimationVariants` au lieu d'importer `Variants` directement ✅

**Animations disponibles:**

- `fadeIn`, `slideUp`, `slideDown`
- `scale`, `shake`
- `staggerContainer`, `staggerItem`
- `buttonVariants`
- `slideFromRight`, `overlayVariants`
- Etc.

---

#### `stock-utils.ts`

**Rôle:** Utilitaires pour la gestion des stocks.

**Fonctions:**

- `calculateStockStatus()`: Calculer le statut
- `checkLowStock()`: Vérifier stock faible
- `formatStockInfo()`: Formater les infos

---

### Autres Fichiers `/lib`

#### `constants.ts`

**Rôle:** Constantes de l'application.

**Contenu:**

- Tailles d'images
- Limites de pagination
- Valeurs par défaut

---

#### `data.ts`

**Rôle:** Données par défaut (dates de livraison, etc.).

---

#### `validator.ts`

**Rôle:** Schémas de validation Zod.

**Schémas:**

- `ProductInputSchema`
- `OrderInputSchema`
- `UserInputSchema`
- `AddressInputSchema`
- `ReviewInputSchema`
- Etc.

---

#### `uploadthing.ts`

**Rôle:** Configuration UploadThing.

**Fonctionnalités:**

- Configuration des uploads
- Validation des fichiers
- Optimisation des images

---

## 📁 Dossier `/hooks` - Hooks React Personnalisés

**Rôle:** Hooks React réutilisables pour la gestion d'état et la logique.

**Hooks disponibles:**

### `use-cart-store.ts`

**Rôle:** Store Zustand pour le panier.

**Fonctionnalités:**

- Ajouter/supprimer des articles
- Modifier les quantités
- Calculer le total
- Persistance locale

---

### `use-wishlist-store.ts`

**Rôle:** Store Zustand pour la liste de souhaits.

**Fonctionnalités:**

- Ajouter/supprimer des favoris
- Persistance locale

---

### `use-cart-slider-store.ts`

**Rôle:** Store pour l'état du slider panier (ouvert/fermé).

---

### `use-wishlist-slider-store.ts`

**Rôle:** Store pour l'état du slider wishlist.

---

### `use-toast.ts`

**Rôle:** Hook pour afficher des toasts.

**Fonctionnalités:**

- `toast()`: Afficher un toast
- Auto-dismiss après 2 secondes ✅

---

### `use-setting-store.ts`

**Rôle:** Store pour les paramètres globaux.

---

### `use-stock-alerts.ts`

**Rôle:** Hook pour gérer les alertes de stock.

**Fonctionnalités:**

- Vérifier les stocks faibles
- Afficher les notifications

---

### `use-notification-level.ts`

**Rôle:** Hook pour gérer les niveaux de notification.

---

### `use-is-mounted.ts`

**Rôle:** Hook pour vérifier si le composant est monté (éviter les erreurs SSR).

---

### `use-device-type.ts`

**Rôle:** Hook pour détecter le type d'appareil (mobile/desktop).

---

### `use-phone-input.ts`

**Rôle:** Hook pour la gestion des champs de téléphone.

---

## 📁 Dossier `/types` - Définitions TypeScript

**Rôle:** Types TypeScript globaux pour l'application.

**Fichier:** `index.ts`

**Types principaux:**

- `IProductInput`: Type de produit
- `IOrderInput`: Type de commande
- `IUserInput`: Type d'utilisateur
- `IReviewInput`: Type d'avis
- `IStockInfo`: Informations de stock
- `IProductWithStock`: Produit avec stock
- `ICategory`: Type de catégorie
- `IAddress`: Type d'adresse
- Etc.

**Source:** Inférés depuis les schémas Zod dans `lib/validator.ts`

---

## 📁 Dossier `/messages` - Traductions i18n

**Rôle:** Fichiers de traduction pour l'internationalisation.

**Fichiers:**

### `fr.json`

**Rôle:** Traductions en français (langue par défaut).

**Structure:**

- `Home`: Traductions de la page d'accueil
- `Header`: Traductions du header
- `Product`: Traductions des produits
- `Cart`: Traductions du panier
- `Account`: Traductions du compte
- `Admin`: Traductions de l'admin
- `Search`: Traductions de la recherche
- Etc.

---

### `en.json`

**Rôle:** Traductions en anglais.

**Structure:** Identique à `fr.json`

---

## 📁 Dossier `/public` - Assets Statiques

**Rôle:** Fichiers statiques servis directement par Next.js.

**Structure:**

### `/public/icons/`

**Rôle:** Icônes et logos.

**Fichiers:**

- `logo.png`: Logo de l'application

---

### `/public/images/`

**Rôle:** Images statiques.

**Sous-dossiers:**

- `/categories/`: Images de catégories
- `/products/`: Images de produits (exemples)

---

## 📁 Dossier `/emails` - Templates d'Emails

**Rôle:** Templates React Email pour les emails transactionnels.

**Templates:**

### `purchase-receipt.tsx`

**Rôle:** Email de confirmation d'achat.

---

### `order-cancellation.tsx`

**Rôle:** Email d'annulation de commande.

---

### `ask-review-order-items.tsx`

**Rôle:** Email pour demander un avis.

---

### `index.tsx`

**Rôle:** Export centralisé des templates.

---

## 📁 Dossier `/scripts` - Scripts Utilitaires

**Rôle:** Scripts Node.js pour des tâches spécifiques.

**Scripts:**

### `fix-stock-status.js`

**Rôle:** Script pour corriger les statuts de stock.

---

### `test-stock-notifications.js`

**Rôle:** Script pour tester les notifications de stock.

---

## 📁 Dossier `/i18n` - Configuration i18n

**Rôle:** Configuration de l'internationalisation.

**Fichiers:**

### `routing.ts`

**Rôle:** Configuration du routing i18n.

**Fonctionnalités:**

- Définition des locales (`fr`, `en`)
- Locale par défaut
- Configuration du routing

---

### `request.ts`

**Rôle:** Configuration pour récupérer les messages i18n côté serveur.

**Fonctionnalités:**

- `getMessages()`: Récupérer les messages traduits
- `getLocale()`: Récupérer la locale actuelle

---

## 📄 Fichiers de Documentation

**Rôle:** Documentation du projet.

**Fichiers:**

- `ARCHITECTURE_ANALYSIS.md`: Analyse architecturale complète
- `OPTIMISATIONS_IMPLÉMENTÉES.md`: Liste des optimisations
- `GUIDE_ANALYSE_BUNDLE_JS.md`: Guide d'analyse du bundle
- `ANALYSE_CONTRASTES_COULEURS.md`: Guide des contrastes
- `RESULTATS_ANALYSE_FINALE.md`: Résultats de l'analyse bundle
- Etc.

---

## 🎯 Concepts Clés à Comprendre

### 1. App Router (Next.js 15)

- Les dossiers dans `/app` créent automatiquement des routes
- `page.tsx` = page accessible
- `layout.tsx` = layout qui enveloppe les pages
- `loading.tsx` = état de chargement
- `error.tsx` = gestion d'erreur
- `not-found.tsx` = page 404

### 2. Route Groups `()`

- Organisent les routes sans affecter l'URL
- Exemple: `(auth)` et `(root)` n'apparaissent pas dans l'URL

### 3. Dynamic Segments `[]`

- `[locale]` = segment dynamique pour la langue
- `[slug]` = segment dynamique pour le slug
- `[id]` = segment dynamique pour l'ID

### 4. Server Components vs Client Components

- **Server Components** (par défaut): Rendu côté serveur
- **Client Components** (`'use client'`): Rendu côté client
- Utiliser Server Components autant que possible pour meilleures performances

### 5. Server Actions

- Fonctions async dans `/lib/actions`
- Appelées directement depuis les composants
- Pas besoin de créer des routes API séparées

### 6. Cache Strategy

- `unstable_cache`: Cache de données
- `revalidateTag`: Revalidation par tag
- `revalidatePath`: Revalidation par chemin

### 7. Internationalisation (i18n)

- `next-intl` pour la gestion multilingue
- Messages dans `/messages`
- Routing automatique avec préfixe de locale

### 8. Optimisations Appliquées

- ✅ CSS au lieu de framer-motion pour animations simples
- ✅ Lazy loading des composants lourds
- ✅ React.memo pour éviter les re-renders
- ✅ Optimisation des images (sizes, quality, lazy loading)
- ✅ Code splitting avec webpack
- ✅ Cache stratégique pour les données

---

## 📚 Ressources Complémentaires

- **Next.js 15 Docs:** https://nextjs.org/docs
- **Next-intl Docs:** https://next-intl-docs.vercel.app
- **Mongoose Docs:** https://mongoosejs.com/docs
- **Zod Docs:** https://zod.dev
- **Zustand Docs:** https://zustand-demo.pmnd.rs

---

**Document créé le:** 2025-01-05  
**Dernière mise à jour:** 2025-01-05

