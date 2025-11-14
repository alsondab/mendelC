# DIAGRAMMES UML - VÉRIFICATION PAR EMAIL

## 1. DIAGRAMME D'ACTIVITÉ - PROCESSUS D'INSCRIPTION AVEC VÉRIFICATION EMAIL (Version Simplifiée)

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

## 2. DIAGRAMME DE SÉQUENCE - CRÉATION DE COMPTE AVEC VÉRIFICATION EMAIL (Version Simplifiée)

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

## 3. DIAGRAMME D'ACTIVITÉ - PROCESSUS DE VÉRIFICATION EMAIL (Détaillé)

```plantuml
@startuml
title Processus de vérification de l'email

start

:Utilisateur reçoit email de vérification;

:Utilisateur clique sur le lien de vérification;

:Redirection vers /verify-email?token=xxx;

:Extraire le token depuis l'URL;

if (Token présent dans l'URL ?) then (Oui)
    
    :Appeler verifyEmail(token);
    
    :Se connecter à MongoDB;
    
    :Rechercher utilisateur avec verificationToken;
    
    if (Utilisateur trouvé ?) then (Oui)
        
        :Vérifier expiration du token\n(verificationTokenExpiry > maintenant);
        
        if (Token non expiré ?) then (Oui)
            
            :Mettre emailVerified = true;
            
            :Supprimer verificationToken;
            
            :Supprimer verificationTokenExpiry;
            
            :Générer sessionToken temporaire\n(crypto.randomBytes, 5 minutes);
            
            :Sauvegarder sessionToken et sessionTokenExpiry;
            
            :Nettoyer tokens de session expirés;
            
            :Rediriger vers /api/auth/verify-and-signin;
            
            :Vérifier sessionToken dans la base;
            
            if (SessionToken valide ?) then (Oui)
                
                :Créer session JWT via NextAuth;
                
                :Supprimer sessionToken (consommé);
                
                :Rediriger vers page d'accueil;
                
                :Afficher message "Email vérifié !\nVous êtes connecté";
                
                stop
                
            else (Non)
                :Afficher erreur "Session invalide";
                
                :Rediriger vers page de connexion;
                
                stop
            endif
            
        else (Non - Token expiré)
            :Afficher message "Token expiré";
            
            :Proposer de renvoyer l'email;
            
            stop
        endif
        
    else (Non - Utilisateur non trouvé)
        :Afficher message "Token invalide";
        
        :Proposer de renvoyer l'email;
        
        stop
    endif
    
else (Non - Token absent)
    :Afficher erreur "Lien invalide";
    
    :Rediriger vers page d'inscription;
    
    stop
endif

@enduml
```

## 4. DIAGRAMME DE SÉQUENCE - RENVOI D'EMAIL DE VÉRIFICATION

```plantuml
@startuml
title Interaction - Renvoi d'email de vérification

actor "Utilisateur" as U
participant "Page\nVérification" as Page
participant "Server Action" as Server
participant "Resend API" as Email
database "MongoDB" as DB

U -> Page : 1. Clique "Renvoyer email de vérification"

Page -> Server : 2. Appeler resendVerificationEmail(email)

Server -> DB : 3. Rechercher utilisateur par email

alt Utilisateur trouvé
    
    DB --> Server : 4. Utilisateur trouvé
    
    if (emailVerified == false ?) then (Oui)
        
        Server -> Server : 5. Générer nouveau token\n(crypto.randomBytes)
        
        Server -> Server : 6. Définir nouvelle expiration\n(24 heures)
        
        Server -> DB : 7. Mettre à jour verificationToken\net verificationTokenExpiry
        
        DB --> Server : 8. Token mis à jour
        
        Server -> Email : 9. Envoyer email de vérification\n(sendVerificationEmail)
        
        alt Email envoyé avec succès
            
            Email --> Server : 10. Email envoyé (id)
            
            Server --> Page : 11. Retourner success: true\nmessage: "Email renvoyé"
            
            Page -> U : 12. Afficher toast "Email renvoyé\navec succès"
            
        else Échec envoi email
            
            Email --> Server : 13. Erreur d'envoi
            
            Server --> Page : 14. Retourner erreur\n"Erreur lors de l'envoi"
            
            Page -> U : 15. Afficher message d'erreur
            
        end
        
    else (Non - Email déjà vérifié)
        
        Server --> Page : 16. Retourner erreur\n"Email déjà vérifié"
        
        Page -> U : 17. Afficher message\n"Votre email est déjà vérifié"
        
    endif
    
else Utilisateur non trouvé
    
    DB --> Server : 18. Aucun utilisateur trouvé
    
    Server --> Page : 19. Retourner erreur\n"Aucun compte trouvé"
    
    Page -> U : 20. Afficher message d'erreur
    
end

@enduml
```

## NOTES D'UTILISATION

Ces diagrammes peuvent être utilisés avec :
- **PlantUML** (recommandé pour génération automatique)
- **StarUML** (importation manuelle)
- **Draw.io** (création manuelle basée sur les diagrammes)

Pour utiliser avec PlantUML :
1. Copier le code dans un fichier `.puml`
2. Utiliser un éditeur PlantUML ou un plugin VS Code
3. Générer les images PNG/SVG

Pour StarUML :
1. Créer manuellement les diagrammes en suivant les interactions décrites
2. Utiliser les éléments : Actor, Participant, Database, Lifeline, Messages, Alt blocks

