# MISE À JOUR DU MÉMOIRE - VÉRIFICATION PAR EMAIL

## Modifications à apporter au mémoire

### 1. CHAPITRE 3 : ANALYSE FONCTIONNELLE ET MODÉLISATION DU SYSTÈME

#### Section I.1 : Besoins fonctionnels

**À ajouter dans la section "Gestion des comptes utilisateurs" :**

```
Gestion des comptes utilisateurs : création et sécurisation des comptes avec vérification par email obligatoire, authentification classique ou via Google OAuth, gestion des sessions JWT, et accès à un espace personnel pour la consultation et la mise à jour du profil.

Le processus d'inscription comprend désormais une étape de vérification par email : après la création du compte, un email contenant un lien de vérification unique est automatiquement envoyé à l'utilisateur. Ce lien, valide pendant 24 heures, permet d'activer le compte. L'utilisateur ne peut se connecter qu'après avoir vérifié son adresse email. Un système de renvoi d'email de vérification est également disponible pour les utilisateurs n'ayant pas reçu le premier email ou dont le lien a expiré.
```

#### Section 2.1 : Rôles et permissions

**À modifier dans la section "Visiteurs (non authentifiés)" :**

```
Les visiteurs peuvent consulter le catalogue des produits publiés, constituer un panier d'achat et ajouter des articles à leur liste de souhaits (wishlist), laquelle est stockée localement. Toutefois, la création d'un compte est obligatoire pour pouvoir finaliser une commande. Après l'inscription, l'utilisateur doit vérifier son adresse email avant de pouvoir se connecter et utiliser pleinement la plateforme.
```

**À modifier dans la section "Clients (authentifiés)" :**

```
En plus des fonctionnalités offertes aux visiteurs, les clients authentifiés et ayant vérifié leur email peuvent modifier les informations de leur profil, gérer plusieurs adresses de livraison, passer des commandes, consulter leur historique d'achats et suivre le statut de leurs commandes. Les comptes non vérifiés ont un accès limité et ne peuvent pas finaliser de commandes.
```

### 2. CHAPITRE 5 : MISE EN ŒUVRE ET DÉVELOPPEMENT DE LA PLATEFORME

#### Section II.1 : Authentification et gestion des comptes

**À remplacer la section "Formulaire de création de compte" par :**

```
Formulaire de création de compte avec vérification par email

Pour devenir client, le visiteur doit remplir un formulaire d'inscription simple et intuitif, garantissant la validation des informations avant leur enregistrement. Les champs requis incluent le nom complet, l'adresse email et le mot de passe avec confirmation. Le système vérifie l'unicité de l'email et applique des règles strictes sur le mot de passe afin d'assurer la sécurité des comptes.

Après validation du formulaire, le système procède à la création du compte avec les étapes suivantes :

1. Validation des données via le schéma Zod pour garantir l'intégrité des informations saisies.
2. Vérification de l'unicité de l'email dans la base de données MongoDB.
3. Génération d'un token de vérification unique et sécurisé (32 bytes) via crypto.randomBytes.
4. Hachage du mot de passe à l'aide de bcrypt avec un coût de 5 itérations pour transformer le mot de passe en clair en empreinte irréversible.
5. Création de l'utilisateur dans la base avec les champs suivants :
   - emailVerified: false (compte non vérifié par défaut)
   - verificationToken: token unique généré
   - verificationTokenExpiry: date d'expiration (24 heures après la création)
6. Envoi automatique d'un email de vérification via Resend API contenant un lien unique vers la page de vérification.
7. Redirection de l'utilisateur vers une page d'attente de vérification (/verify-email-pending) avec possibilité de renvoyer l'email.

Le compte créé reste inactif jusqu'à la vérification de l'email. L'utilisateur reçoit un message de confirmation indiquant qu'un email de vérification lui a été envoyé et qu'il doit cliquer sur le lien pour activer son compte.

Figure 34: Création de compte utilisateur avec vérification par email
```

**À ajouter une nouvelle sous-section :**

```
Page d'attente de vérification email

Après l'inscription, l'utilisateur est redirigé vers une page dédiée (/verify-email-pending) qui l'informe que :
- Un email de vérification a été envoyé à son adresse
- Il doit cliquer sur le lien dans l'email pour activer son compte
- Le lien est valide pendant 24 heures
- Il peut demander un renvoi de l'email s'il ne l'a pas reçu

Cette page propose également un bouton "Renvoyer l'email de vérification" qui permet de générer un nouveau token et d'envoyer un nouvel email, utile en cas de non-réception du premier email ou d'expiration du lien.

Processus de vérification de l'email

Lorsque l'utilisateur clique sur le lien de vérification dans l'email, il est redirigé vers la page /verify-email qui :

1. Récupère le token de vérification depuis l'URL
2. Vérifie la validité du token (existence, non-expiration)
3. Active le compte en mettant à jour emailVerified à true
4. Supprime le token de vérification et sa date d'expiration
5. Génère un token de session temporaire (valide 5 minutes) pour la connexion automatique
6. Redirige l'utilisateur vers la page de connexion avec le token de session
7. Connecte automatiquement l'utilisateur après vérification du token de session

En cas d'échec (token invalide ou expiré), l'utilisateur est informé et peut demander un nouvel email de vérification.

Sécurité de la vérification

Le système de vérification par email intègre plusieurs mesures de sécurité :
- Tokens cryptographiquement sécurisés générés via crypto.randomBytes
- Expiration automatique des tokens après 24 heures
- Validation stricte des tokens avant activation du compte
- Nettoyage automatique des tokens expirés
- Protection contre les attaques par force brute via limitation des tentatives
- Session temporaire sécurisée pour la connexion automatique après vérification
```

**À modifier la section "Page de connexion" :**

```
Page de connexion avec vérification obligatoire

Les utilisateurs déjà enregistrés peuvent se connecter via leur identifiant ou par OAuth 2.0 (Google). Toutefois, pour les comptes créés avec email/mot de passe, la vérification de l'email est obligatoire avant la première connexion.

Le système vérifie automatiquement le statut de vérification de l'email lors de la tentative de connexion :
- Si emailVerified = false : l'utilisateur est informé qu'il doit d'abord vérifier son email et est redirigé vers la page de renvoi d'email de vérification
- Si emailVerified = true : la connexion se poursuit normalement

Cette vérification garantit que seuls les utilisateurs ayant confirmé leur adresse email peuvent accéder à la plateforme, réduisant ainsi les risques de création de comptes frauduleux et améliorant la qualité de la base de données utilisateurs.
```

### 3. CHAPITRE 4 : ENVIRONNEMENT TECHNOLOGIQUE ET CONCEPTION TECHNIQUE

#### Section II.2 : Technologies Backend

**À ajouter dans la liste des technologies :**

```
crypto (Node.js) : module natif de Node.js utilisé pour générer des tokens de vérification cryptographiquement sécurisés. Il permet de créer des tokens aléatoires uniques (32 bytes) pour la vérification des emails, garantissant la sécurité et l'unicité de chaque lien de vérification.
```

### 4. CHAPITRE 6 : RÉSULTATS, ÉVALUATION ET PERSPECTIVES D'AMÉLIORATION

#### Section I.1 : Résultats fonctionnels et validation technique

**À ajouter dans la liste "Fonctionnalités validées et opérationnelles" :**

```
• Système de vérification par email : lors de l'inscription, un email de vérification est automatiquement envoyé à l'utilisateur. Le compte reste inactif jusqu'à la vérification de l'email via un lien unique valide 24 heures. Un système de renvoi d'email est disponible pour les utilisateurs n'ayant pas reçu le premier email. Cette fonctionnalité améliore la sécurité en garantissant la validité des adresses email et réduit les risques de création de comptes frauduleux.
```

### 5. TABLEAUX DES CAS D'UTILISATION

**À modifier le Tableau 3 : Description du cas d'utilisation « Créer un compte »**

Élément	Description

Acteur principal	Client

Préconditions	Le client n'a pas encore de compte.

Déclencheur	Le client clique sur « Créer un compte ».

Scénario nominal	1. Saisie des champs (nom, email, mot de passe, confirmation).

2. Validation Zod (formats, correspondances).

3. Vérification unicité email.

4. Génération d'un token de vérification unique (crypto.randomBytes).

5. Hachage mot de passe (bcrypt).

6. Enregistrement en base avec emailVerified = false.

7. Envoi automatique d'un email de vérification via Resend API.

8. Redirection vers la page d'attente de vérification.

9. L'utilisateur clique sur le lien dans l'email.

10. Vérification du token et activation du compte (emailVerified = true).

11. Connexion automatique via token de session temporaire.

Scénario alternatif	(A1) Email déjà utilisé → message "Email déjà enregistré", champ email surligné → possibilité de corriger

(A2) Données invalides : erreurs précises affichées, correction et resoumission.

(A3) Email non reçu : possibilité de demander un renvoi depuis la page d'attente.

(A4) Token expiré : message d'erreur, possibilité de demander un nouvel email de vérification.

Postconditions	-Succès : Compte créé, email de vérification envoyé, compte activé après vérification, utilisateur connecté automatiquement.

-Échec : Aucun enregistrement, erreurs visibles, possibilité de réessayer.

### 6. DIAGRAMME DE SÉQUENCE

**Note :** Le diagramme de séquence "Créer un compte" (Figure 8) devrait être mis à jour pour inclure :
- L'envoi de l'email de vérification
- La page d'attente de vérification
- Le processus de vérification du token
- La connexion automatique après vérification

### 7. DIAGRAMME D'ACTIVITÉ

**Note :** Le diagramme d'activité "Créer un compte" (Figure 12) devrait être mis à jour pour inclure :
- La génération du token de vérification
- L'envoi de l'email
- La vérification du token
- L'activation du compte

### 8. RÉSUMÉ

**À modifier dans la section des fonctionnalités développées :**

```
Les fonctionnalités développées incluent un système de gestion des produits, un mécanisme d'authentification sécurisée avec vérification par email obligatoire, un panier d'achat dynamique, une interface d'administration complète et un support multilingue. Nous avons particulièrement mis l'accent sur l'expérience utilisateur, la responsivité, le respect des bonnes pratiques de sécurité et la validation des adresses email pour garantir l'intégrité de la base de données utilisateurs.
```

### 9. ABSTRACT

**À modifier dans la section des fonctionnalités développées :**

```
The features developed include a product management system, a secure authentication mechanism with mandatory email verification, a dynamic shopping cart, a comprehensive administration interface, and multilingual support. We placed particular emphasis on user experience, responsiveness, and compliance with security best practices, including email verification to ensure the integrity of the user database.
```

### 10. LISTE DES FIGURES

**À ajouter :**

```
FIGURE 46 : PAGE D'ATTENTE DE VÉRIFICATION EMAIL
FIGURE 47 : EMAIL DE VÉRIFICATION
FIGURE 48 : PAGE DE VÉRIFICATION EMAIL
```

---

## Notes importantes

1. **Sécurité renforcée** : La vérification par email ajoute une couche de sécurité supplémentaire en garantissant que seuls les utilisateurs ayant confirmé leur adresse email peuvent accéder à la plateforme.

2. **Amélioration de la qualité des données** : Cette fonctionnalité réduit les risques de création de comptes avec des adresses email invalides ou frauduleuses.

3. **Expérience utilisateur** : Le processus est fluide avec des messages clairs et une possibilité de renvoi d'email en cas de problème.

4. **Technologies utilisées** : 
   - Resend API pour l'envoi des emails
   - React Email pour les templates d'emails
   - crypto (Node.js) pour la génération de tokens sécurisés
   - MongoDB pour le stockage des tokens et statuts de vérification

