# DIAGRAMMES UML SIMPLIFIÉS - VÉRIFICATION PAR EMAIL

## 1. DIAGRAMME D'ACTIVITÉ - PROCESSUS D'INSCRIPTION (Version Simplifiée)

```plantuml
@startuml
title Processus d'inscription avec vérification par email

start

:Utilisateur remplit le formulaire d'inscription;

if (Données valides ?) then (Oui)
    :Générer token de vérification;
    :Hacher le mot de passe (bcrypt);
    :Créer utilisateur (emailVerified = false);
    :Envoyer email de vérification;
    :Rediriger vers page d'attente;
    
    :Utilisateur clique sur le lien dans l'email;
    
    if (Token valide ?) then (Oui)
        :Activer le compte (emailVerified = true);
        :Générer sessionToken temporaire;
        :Connecter automatiquement l'utilisateur;
        stop
    else (Non)
        :Afficher erreur "Token invalide ou expiré";
        :Proposer renvoi d'email;
        stop
    endif
    
else (Non)
    :Afficher erreurs de validation;
    stop
endif

@enduml
```

## 2. DIAGRAMME DE SÉQUENCE - CRÉATION DE COMPTE (Version Simplifiée)

```plantuml
@startuml
title Création de compte avec vérification par email

actor "Utilisateur" as U
participant "Interface" as UI
participant "Server" as Server
participant "Resend API" as Email
database "MongoDB" as DB

== Inscription ==

U -> UI : 1. Soumet formulaire d'inscription
UI -> Server : 2. registerUser(données)
Server -> Server : 3. Valider (Zod)
Server -> DB : 4. Vérifier email unique
Server -> Server : 5. Générer token + Hacher mot de passe
Server -> DB : 6. Créer utilisateur (emailVerified: false)
Server -> Email : 7. Envoyer email de vérification
Email --> Server : 8. Email envoyé
Server --> UI : 9. Success + redirection
UI -> U : 10. Page d'attente de vérification

== Vérification ==

U -> UI : 11. Clique lien dans email
UI -> Server : 12. verifyEmail(token)
Server -> DB : 13. Vérifier token et expiration
alt Token valide
    Server -> DB : 14. Activer compte (emailVerified: true)
    Server -> Server : 15. Générer sessionToken
    Server -> DB : 16. Sauvegarder sessionToken
    Server --> UI : 17. Session créée
    UI -> U : 18. Connexion automatique
else Token invalide
    Server --> UI : 19. Erreur "Token invalide"
    UI -> U : 20. Proposer renvoi email
end

@enduml
```

## NOTES

Ces versions simplifiées conservent les étapes essentielles :
- ✅ Validation des données
- ✅ Génération du token
- ✅ Création du compte non vérifié
- ✅ Envoi de l'email
- ✅ Vérification du token
- ✅ Activation du compte
- ✅ Connexion automatique

Les détails techniques (bcrypt, crypto.randomBytes, etc.) peuvent être ajoutés dans la documentation textuelle si nécessaire.

