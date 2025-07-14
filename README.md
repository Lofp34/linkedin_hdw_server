# hdw-server-front-back

Ce dépôt contient une application complète permettant d'exploiter la puissance du serveur HDW MCP (Model Context Protocol) pour accéder aux données LinkedIn via l'API Horizon Data Wave, avec une interface frontend React clé en main.

---

## Fonctionnalités principales
- Recherche de prospects LinkedIn par mots-clés, secteur, localisation
- Affichage d'une fiche prospect enrichie (nom, secteur, localisation, description, photo, lien LinkedIn)
- Architecture modulaire :
  - **Backend** : Serveur MCP HDW (Node.js/Express) qui fait le lien avec l'API Horizon Data Wave
  - **Frontend** : Application React (Create React App)
- Prêt à être déployé ou étendu pour d'autres usages (chat, gestion de connexions, etc.)

---

## Structure du projet

```
/hdw-mcp-server         # Backend MCP + Express (Node.js, TypeScript)
  /src                  # Code source principal
  /frontend             # Frontend React (Create React App)
.cursor/rules           # Règles Cursor pour l'intégration et la navigation
README.md               # Ce guide
```

---

## Prérequis
- Node.js >= 18
- Un compte sur https://app.horizondatawave.ai pour obtenir :
  - `HDW_ACCESS_TOKEN`
  - `HDW_ACCOUNT_ID`

---

## Installation et configuration

1. **Clone du dépôt**
   ```bash
git clone https://github.com/Lofp34/hdw-server-front-back.git
cd hdw-server-front-back
```

2. **Configuration des variables d'environnement**
   - Crée un fichier `.env` dans `hdw-mcp-server` :
     ```env
     HDW_ACCESS_TOKEN=ton_token
     HDW_ACCOUNT_ID=ton_account_id
     ```

3. **Installation des dépendances**
   ```bash
cd hdw-mcp-server
npm install
cd frontend
npm install
```

---

## Lancement de l'application

1. **Lancer le backend (depuis `hdw-mcp-server`)**
   ```bash
npm run build
node build/index.js
```
   - Le backend écoute sur le port 4000 (Express) et gère les requêtes MCP.

2. **Lancer le frontend (depuis `hdw-mcp-server/frontend`)**
   ```bash
npm start
```
   - L'application React sera accessible sur [http://localhost:3000](http://localhost:3000) (ou 3001/3002 selon disponibilité).

---

## Utilisation
- Saisir un nom, secteur ou localisation dans le formulaire de recherche.
- Cliquer sur "Rechercher" : le frontend envoie une requête au backend, qui interroge LinkedIn via MCP HDW et renvoie la fiche prospect.
- Les champs affichés sont adaptés à la réponse LinkedIn (nom, secteur, localisation, description, etc.).

---

## Bonnes pratiques & extension
- Pour exploiter d'autres outils MCP (chat, posts, entreprises, etc.), ajouter de nouvelles routes Express dans `src/index.ts` et adapter le frontend.
- Toujours adapter la réponse backend pour correspondre aux besoins du frontend.
- Voir `.cursor/rules/serveur-hdw-mcp.mdc` pour un guide d'intégration avancé.

---

## Dépannage
- Si le port 4000 est occupé, tuer le processus ou modifier le port dans le code.
- Vérifier les logs backend pour diagnostiquer les appels MCP ou les erreurs de mapping.
- Toujours relancer le backend après modification du code TypeScript.

---

## Licence
MIT

---

## Auteur
Laurent Serre & Horizon Data Wave

---

## Ressources utiles
- [Documentation HDW MCP Server](https://github.com/horizondatawave/hdw-mcp-server)
- [API Horizon Data Wave](https://app.horizondatawave.ai)
- [Create React App](https://github.com/facebook/create-react-app) 