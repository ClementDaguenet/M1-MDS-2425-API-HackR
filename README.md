# M1-MDS-2425-API-HackR

Ce projet est une API pour hacker développée dans le cadre de mon MBA Développeur Fullstack à MyDigitalSchool

## Prérequis et installation locale

- Assurez-vous d'avoir les dernières versions de Node.js, npm et git installées :
```
sudo apt update
sudo apt install git
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
```

- Vérifier les versions installées
```
node -v
npm -v
git -v
```

- Clôner le dépôt git dans un répertoire de votre choix :
```
git clone https://github.com/ClementDaguenet/M1-MDS-2425-API-HackR.git
cd M1-MDS-2425-API-HackR
```

- Installer les dépendances et lancer l'API :
```
npm install
npm start
```

- Si `npm start` ne lance pas automatiquement l'application, utilisez  :
```
node app.js
```

- Pour utiliser les requêtes avec Postman, se connecter sur [le site](https://web.postman.co) et importer la collection présente dans le fichier `HackR.postman_collection.json` sur le [Github](https://github.com/ClementDaguenet/M1-MDS-2425-API-HackR.git).

- Tester les fonctionnalités décrites avec les **exemples** ci-dessous.

## Fonctionnalités

- *Outil de vérification d'existence d'adresse mail*
- *Spammer de mail*
- *Service de phising*
- *Est-ce que le MDP est sur la liste des plus courants*
- *Récupérer tous domaines & sous-domaines associés à un Nom De Domaine*
- *DDoS*
- *Génération d'identité fictive*
- *Crawler d'information sur une personne*
- *Générateur de mot de passe sécurisé*

## Connexion (À faire en premier !)

Admin = Accède à tout (préférer celui-ci pour tout tester)
Secrétariat = Accède aux fonctions de mail
Développeur = Accède aux fonctions de MDP
Hacker = Accède à tout sauf mail

- Postman : Login - Admin : login/admin | Secrétariat : login/secretariat | Développeur : login/dev | Hacker : login/hacker

### Vérification mail

- Postman : Mail existant = mailChecker/valid | Mail inexistant = mailChecker/invalid

- URL : Mail existant = [mailChecker/valid](https://clement.daguenet.angers.mds-project.fr/check-email?email=patrick@stripe.com) | Mail inexistant = [mailChecker/invalid](https://clement.daguenet.angers.mds-project.fr/check-email?email=aaa@bbb.com)

**Possibilité de changer le mail en paramètre**

### Spammer mail

- Postman : Envoie 1 mail = mailSpammer/oneTime | Envoie 3 mails = mailSpammer/threeTimes

- URL : Envoie 1 mail = [mailSpammer/oneTime](https://clement.daguenet.angers.mds-project.fr/send-email?recipient=clement.dgt72@gmail.com&subject=Sujet+très+important&body=Message+hyper+urgent&times=1) | Envoie 3 mails = [mailSpammer/threeTimes](https://clement.daguenet.angers.mds-project.fr/send-email?recipient=clement.dgt72@gmail.com&subject=Sujet+très+important&body=Message+hyper+urgent&times=3)

**Possibilité de changer le destinataire, le sujet, le corps et le nombre d'envois**

### Phishing

- Postman : Facebook = phishing/facebook | LinkedIn = phishing/linkedin

### MDP courant ou non

- Postman : Courant = passwordChecker/Used | Peu courant = passwordChecker/Unused

- URL : Courant = [passwordChecker/Used](https://clement.daguenet.angers.mds-project.fr/check-password?password=fuckme) | Peu courant = [passwordChecker/Unused](https://clement.daguenet.angers.mds-project.fr/check-password?password=brgeviuuyre)

**Possibilité de changer le mot de passe à check**

### Récupérateur nom de domaine

- Postman : NDD Valide = domainChecker/valid | NDD Invalide = domainChecker/invalid

- URL : NDD Valide = [domainChecker/valid](https://clement.daguenet.angers.mds-project.fr/check-domain?domain=mds-project.fr) | NDD Invalide = [domainChecker/invalid](https://clement.daguenet.angers.mds-project.fr/check-domain?domain=aaazzz.fr)

**Possibilité de changer le NDD à check**

### DDoS

- Postman : DDoS Google = ddos/ddos

**Possibilité de changer le NDD et le nombre d'envois**

### Fake Identité

- Postman : Générateur = identity/generate

- URL : Générateur = [identity/generate](https://clement.daguenet.angers.mds-project.fr/generate-identity)

### Crawler

- Postman : Derniers posts Instagram de HugoDecrypte = crawler/instagram | Dernières vidéos Youtube de HugoDecrypte = crawler/youtube | Derniers posts TikTok de HugoDecrypte = crawler/tiktok

**Possibilité de changer le compte à check**

### Générateur MDP

- Postman : Générateur = passwordGenerator/generate

 URL : [passwordGenerator/generate](https://clement.daguenet.angers.mds-project.fr/generate-password)

### Logs

- Postman : Derniers logs = logs/all | Clear des logs = logs/clear | Logs de Géraldine = logs/userGeraldine | Logs de Kevin = logs/userKevin | Logs de Jean-Titouan = logs/userJeanTitouan | Logs d'Archibald = logs/userArchibald | Logs de mailChecker = logs/actMailChecker | Logs de passwordChecker = logs/actPasswordChecker | Logs de logsChecker = logs/actLogsChecker | Logs de logsClearer = logs/actLogsClearer | Logs de mailSpammer = logs/actMailSpammer

- URL : Derniers logs = [logs/all](https://clement.daguenet.angers.mds-project.fr/check-logs) | Clear des logs = [logs/clear](https://clement.daguenet.angers.mds-project.fr/clear-logs) | Logs de Géraldine = [logs/userGeraldine](https://clement.daguenet.angers.mds-project.fr/check-logs/users?user=geraldine) | Logs de Kevin = [logs/userKevin](https://clement.daguenet.angers.mds-project.fr/check-logs/users?user=kevin) | Logs de Jean-Titouan = [logs/userJeanTitouan](https://clement.daguenet.angers.mds-project.fr/check-logs/users?user=jean-titouan) | Logs d'Archibald = [logs/userArchibald](https://clement.daguenet.angers.mds-project.fr/check-logs/users?user=archibald) | Logs de mailChecker = [logs/actMailChecker](https://clement.daguenet.angers.mds-project.fr/check-logs/users?action=check-mail) | Logs de passwordChecker = [logs/actPasswordChecker](https://clement.daguenet.angers.mds-project.fr/check-logs/users?action=check-password) | Logs de logsChecker = [logs/actLogsChecker](https://clement.daguenet.angers.mds-project.fr/check-logs) | Logs de logsClearer = [logs/actLogsClearer](https://clement.daguenet.angers.mds-project.fr/clear-logs) | Logs de mailSpammer = [logs/actMailSpammer](https://clement.daguenet.angers.mds-project.fr/check-logs/users?action=send-mail)

### Utilisateurs

- Postman : Lister les utilisateurs et rôles = users/all

- URL : Lister les utilisateurs et rôles = [users/all](https://clement.daguenet.angers.mds-project.fr/users)

## Auteur 

- **Daguenet Clément**
