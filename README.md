# M1-MDS-2425-API-HackR

## Fonctionnalités

- *Outil de vérification d'existence d'adresse mail*
- *Spammer de mail (contenu + nombre d'envoi)*
- *Service de phising (création d'une page web de phishing sur mesure)*
- *Est-ce que le MDP est sur la liste des plus courants (https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt)*
- *Récupérer tous domaines & sous-domaines associés à un Nom De Domaine*
- *DDoS*
- Changement d'image random (trouver une API qui fait ça ^^)
- *Génération d'identité fictive*
- *Crawler d'information sur une personne (à partir d'un username)*
- *Générateur de mot de passe sécurisé*

## Obligations

- Contrôler l'accès à votre API grâce à un système de connexion basé sur JWT
- Mettre en place un système de droits, gérable par des administrateurs, qui permet de définir quelles fonctionnalités peuvent être utilisées par quel utilisateur
- Vous allez mettre en place un système de logs, interne à l'API, et consultable uniquement par les admins, qui permet de savoir quelles sont :
    - les dernières actions réalisées
    - les dernières actions d'un utilisateur spécifique
    - les dernières actions d'une fonctionnalité spécifique
- Respect scrupuleux des conventions RESTful
- Intégrer un fichier Swagger.json pour la partie documentation. Le fichier doit être exploitable sur "https://swagger.io/tools/swagger-ui/"
- Respecter le modèle de maturité de Richardson
- Vous devrez obligatoirement tester votre API via POSTMAN. En y incluant :
- Organiser vos routes en collection et dans un projet
- Automatisant la génération du bearer et sa transmission dans toutes les requêtes. (Bearer = JWT)
