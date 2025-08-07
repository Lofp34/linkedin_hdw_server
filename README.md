# HDW MCP Server – Front + Back (React + MCP + Express)

Accédez aux données LinkedIn de manière fiable via l’API Horizon Data Wave (HDW) avec un serveur MCP local et une interface React prête à l’emploi. Ce projet fournit:

- Un serveur MCP local (`backend-local/hdw-mcp-server`) exposant des outils LinkedIn/Google/Reddit
- Un endpoint HTTP Express (`POST /prospect`) pour un usage direct côté frontend
- Une application React (Create React App) pour rechercher un prospect et afficher une fiche enrichie
- Une fonction serverless compatible Vercel (`/api/prospect`) pour la production

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Variables d’environnement](#variables-denvironnement)
- [Installation et démarrage rapide](#installation-et-démarrage-rapide)
- [Exécution locale (développement)](#exécution-locale-développement)
- [Configuration d’un client MCP (Cursor/Claude/Windsurf)](#configuration-dun-client-mcp-cursorclaudewindsurf)
- [API HTTP locale](#api-http-locale)
- [Déploiement sur Vercel](#déploiement-sur-vercel)
- [Dépannage](#dépannage)
- [Licence](#licence)
- [Ressources utiles](#ressources-utiles)

---

## Fonctionnalités

- Recherche d’utilisateurs LinkedIn par mots-clés, nom, titre, entreprise, localisation, industrie, éducation
- Récupération de profil détaillé, expériences, formations, compétences
- Récupération de posts, réactions, commentaires, reposts
- Gestion de compte (via Management API): messages, invitations, connexions
- Recherche d’entreprises (Google -> LinkedIn), informations société, employés
- Recherche Google et Reddit
- Frontend React simple pour tester immédiatement la recherche de prospects

Les outils MCP détaillés sont listés dans: `.cursor/rules/hdw-mcp-tools.mdc` et dans la documentation [README_hdw-mcp-server.md](README_hdw-mcp-server.md).

---

## Architecture

```mermaid
flowchart LR
  subgraph Local Dev
    A[React App :3000] -- POST /prospect --> B[Express :4000]
    B -- API HDW --> C[(Horizon Data Wave API)]
    D[MCP Server (stdio)] -. outils .-> C
  end
```

- Le serveur MCP tourne sur stdio (pour un client MCP comme Cursor/Claude) ET expose un serveur HTTP Express sur `:4000`.
- Le frontend (CRA) écoute sur `:3000` en dev.

---

## Structure du projet

```
hdw-server-front-back/
  api/                      # Fonction serverless (Vercel) /api/prospect
    prospect.js
  backend-local/
    hdw-mcp-server/         # Serveur MCP + Express (local)
      src/
        index.ts            # Entrée principale MCP + Express (POST /prospect)
        types.ts            # Types + validateurs outils
      tsconfig.json
    src/                    # Variante MCP (non utilisée par défaut)
  .cursor/rules/            # Règles Cursor (documentation intégrée MCP)
  public/                   # CRA public
  src/                      # CRA source
  README_hdw-mcp-server.md  # Documentation complète serveur MCP HDW
  README.md                 # Ce fichier
```

---

## Prérequis

- Node.js >= 18 (recommandé: LTS
- Un compte sur `https://app.horizondatawave.ai` pour obtenir:
  - `HDW_ACCESS_TOKEN`
  - `HDW_ACCOUNT_ID` (requis pour les endpoints de gestion)

---

## Variables d’environnement

Créez un fichier `.env` à la racine du repo (ou `~/.hdw-mcp.env`) avec:

```
HDW_ACCESS_TOKEN=VOTRE_CLE
HDW_ACCOUNT_ID=VOTRE_COMPTE
# Optionnel: endpoint personnalisé si fourni par HDW
HDW_BASE_URL=https://api.horizondatawave.ai
```

Le serveur MCP charge automatiquement:
- `.env` à différents emplacements (incluant la racine du repo)
- `~/.hdw-mcp.env` (override utilisateur)

---

## Installation et démarrage rapide

1) Installer les dépendances frontend
```
npm install
```

2) Démarrer le serveur MCP local (HTTP + stdio)
```
cd backend-local/hdw-mcp-server
npm install
npm run build
node build/index.js
```
Le serveur HTTP écoute sur `http://localhost:4000`.

3) Démarrer l’application React (dans un autre terminal)
```
cd /chemin/vers/hdw-server-front-back
npm start
```
Ouvrez `http://localhost:3000`.

---

## Exécution locale (développement)

- Frontend (CRA): `npm start` (port 3000)
- MCP + Express: `node backend-local/hdw-mcp-server/build/index.js` (port 4000)
- En dev, le frontend est configuré pour appeler `http://localhost:4000/prospect` (voir `src/App.js`).

Tester rapidement l’API locale:
```
curl -X POST http://localhost:4000/prospect \
  -H 'Content-Type: application/json' \
  -d '{"nom":"openai"}'
```

---

## Configuration d’un client MCP (Cursor/Claude/Windsurf)

Consultez et suivez `.cursor/rules/hdw-mcp-client-setup.mdc`.

Exemple (Cursor, méthode simple):
```
env HDW_ACCESS_TOKEN=... HDW_ACCOUNT_ID=... \
  node /chemin/vers/hdw-server-front-back/backend-local/hdw-mcp-server/build/index.js
```

Claude Desktop (extrait de `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "hdw": {
      "command": "npx",
      "args": ["-y", "@horizondatawave/mcp"],
      "env": {
        "HDW_ACCESS_TOKEN": "VOTRE_TOKEN",
        "HDW_ACCOUNT_ID": "VOTRE_ACCOUNT_ID"
      }
    }
  }
}
```

Plus de détails dans [README_hdw-mcp-server.md](README_hdw-mcp-server.md).

---

## API HTTP locale

- `POST /prospect` (port 4000)
  - Body: `{ "nom": "<mot-clé>" }`
  - Réponse: fiche prospect enrichie (nom, headline, localisation, lien LinkedIn, image, URN, etc.)

Exemple:
```
curl -X POST http://localhost:4000/prospect \
  -H 'Content-Type: application/json' \
  -d '{"nom":"openai"}'
```

Pour les outils MCP disponibles (recherche utilisateurs, profil, posts, etc.), référez-vous à `.cursor/rules/hdw-mcp-tools.mdc` et au [README_hdw-mcp-server.md](README_hdw-mcp-server.md).

---

## Déploiement sur Vercel

- Frontend: build CRA.
- Backend: fonction serverless `api/prospect.js`.

Étapes:
1) Définissez les variables d’environnement dans le dashboard Vercel:
   - `HDW_ACCESS_TOKEN`, `HDW_ACCOUNT_ID` (et éventuellement `HDW_BASE_URL`)
2) Déployez (connexion GitHub -> Vercel). Vercel détecte `/api/prospect` automatiquement.
3) URLs typiques:
   - Frontend: `https://<votre-projet>.vercel.app`
   - API: `https://<votre-projet>.vercel.app/api/prospect`

---

## Dépannage

- « Cannot find module build/index.js »: lancez `node backend-local/hdw-mcp-server/build/index.js` (pas à la racine), et exécutez `npm run build` dans `hdw-mcp-server` si besoin.
- 4000 occupé: changez le port dans `backend-local/hdw-mcp-server/src/index.ts` ou libérez le port.
- 401/403 API HDW: vérifiez `HDW_ACCESS_TOKEN` et `HDW_ACCOUNT_ID`.
- Données vides: vérifiez la requête (`keywords`, `count`, `URN` préfixé `fsd_profile:` pour les endpoints qui l’exigent).
- Node: utilisez Node >= 18.

---

## Licence

MIT – voir `LICENSE` / `LICENSE.md`.

---

## Ressources utiles

- Documentation MCP HDW: [README_hdw-mcp-server.md](README_hdw-mcp-server.md)
- API Horizon Data Wave: https://app.horizondatawave.ai
- Create React App: https://github.com/facebook/create-react-app
- Cursor Rules (docs internes): `.cursor/rules/*.mdc`
