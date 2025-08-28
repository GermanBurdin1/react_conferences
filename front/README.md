# CyberConf - Application de Gestion de Conférences

## Description
Application React de gestion de conférences de cybersécurité avec interface d'administration. Permet la consultation des conférences, la gestion des utilisateurs et l'administration complète pour les administrateurs.

## Installation et démarrage

### Étape 1 : Cloner le projet
```bash
git clone https://github.com/GermanBurdin1/react_conferences
cd devoir_react
```

### Étape 2 : Démarrer le backend (API + Base de données)


1. **Lancer l'API et la base de données** :
```bash
docker-compose up
```

L'API sera disponible à : http://localhost:4555
L'interface d'administration MongoDB Express : http://localhost:9555
- Identifiant : `admin`
- Mot de passe : `pass`

### Étape 3 : Démarrer le frontend

1. **Naviguer vers le dossier frontend** :
```bash
cd front
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Démarrer l'application React** :
```bash
npm run dev
```

L'application sera accessible à : http://localhost:5173

## Utilisation

### Première connexion
1. Créer un compte via "S'inscrire"
2. Se connecter avec les identifiants créés
3. Le premier utilisateur peut être promu administrateur via l'interface MongoDB Express

### Interface Administrateur
- **Gestion des conférences** : `/admin/conferences`
  - Création avec formulaire complet
  - Upload d'images (URL ou fichier local)
  - Sélection de couleurs avec aperçu
  - Modification et suppression

- **Gestion des utilisateurs** : `/admin/users`
  - Liste de tous les utilisateurs
  - Promotion au rôle administrateur
  - Suppression d'utilisateurs

### Navigation
- **🎆 Conférences** : Page d'accueil avec toutes les conférences
- **👑 Admin** : Menu déroulant pour les administrateurs
- **⚙️ Paramètres** : Changement de mot de passe
- **👤 Mon Compte** : Menu utilisateur avec déconnexion

## Structure du projet

```
devoir_react/
├── docker-compose.yml          # Configuration Docker pour l'API
├── README.md                   # Ce fichier
└── front/                      # Application React
    ├── src/
    │   ├── api/                # Services API
    │   ├── components/         # Composants React
    │   ├── pages/              # Pages de l'application
    │   ├── state/              # Gestion d'état (AuthContext)
    │   └── styles.css          # Styles CSS
    ├── package.json
    └── vite.config.js
```

## Fonctionnalités techniques

### Sécurité
- Authentification JWT
- Routes protégées par rôle
- Validation côté frontend et backend
- Gestion des erreurs

### Interface utilisateur
- Design moderne avec gradients
- Animations CSS fluides
- Interface française complète
- Feedback visuel pour toutes les actions

### Gestion des images
- Support URL et upload de fichiers
- Conversion automatique en Base64
- Aperçu en temps réel
- Gestion d'erreurs de chargement

## Comptes de test

Pour tester l'application, vous pouvez :
1. Créer un nouveau compte via l'inscription
2. Ou utiliser l'interface MongoDB Express pour créer/modifier des utilisateurs directement

## Dépannage

### Problèmes courants

**L'API ne répond pas** :
- Vérifier que Docker est en cours d'exécution
- S'assurer que les ports 4555 et 9555 sont libres
- Redémarrer avec `docker-compose down && docker-compose up`

**L'application React ne se lance pas** :
- Vérifier la version de Node.js (≥14)
- Supprimer `node_modules` et relancer `npm install`
- Vérifier que le port 5173 est libre

**Problèmes de connexion** :
- Vérifier que l'API backend est accessible
- Contrôler les logs dans la console du navigateur

## Informations de développement

### Scripts disponibles
```bash
npm run dev        # Démarrage en mode développement
npm run build      # Build de production
npm run preview    # Aperçu du build de production
```

### APIs utilisées
- `GET /conferences` - Liste des conférences
- `POST /conferences` - Création de conférence
- `PUT /conferences/:id` - Modification de conférence
- `DELETE /conferences/:id` - Suppression de conférence
- `GET /users` - Liste des utilisateurs
- `PATCH /usertype` - Promotion d'utilisateur
- `POST /login` - Authentification
- `POST /signup` - Inscription
