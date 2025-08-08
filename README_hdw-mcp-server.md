# HDW MCP Server
[![smithery badge](https://smithery.ai/badge/@horizondatawave/hdw-mcp-server)](https://smithery.ai/server/@horizondatawave/hdw-mcp-server)

A Model Context Protocol (MCP) server that provides comprehensive access to LinkedIn data and functionalities using the HorizonDataWave API, enabling not only data retrieval but also robust management of user accounts.
---

## Features

- **LinkedIn Users Search:** Filter and search for LinkedIn users by keywords, name, title, company, location, industry, and education.
- **Profile Lookup:** Retrieve detailed profile information for a LinkedIn user.
- **Email Lookup:** Find LinkedIn user details by email address.
- **Posts & Reactions:** Retrieve a user's posts and associated reactions.
- **Post Reposts, Comments & Reactions:** Retrieve reposts, comments, and reactions for a specific LinkedIn post.
- **Account Management:**
  - **Chat Functionality:** Retrieve and send chat messages via the LinkedIn management API.
  - **Connection Management:** Send connection invitations to LinkedIn users.
  - **Post Commenting:** Create comments on LinkedIn posts or replies.
  - **User Connections:** Retrieve a list of a user's LinkedIn connections.
- **Company Search & Details:**  
  - **Google Company Search:** Find LinkedIn companies using Google search – the first result is typically the best match.  
  - **Company Lookup:** Retrieve detailed information about a LinkedIn company.  
  - **Company Employees:** Retrieve employees for a given LinkedIn company.
  
- **Google Search**
- **Reddit Search:** Search for Reddit posts with various filters including query, sort options, time filters, and result count.

---

## Tools

HDW MCP Server exposes several tools through the MCP protocol. Each tool is defined with its name, description, and input parameters:

1. **Search LinkedIn Users**  
   **Name:** `search_linkedin_users`  
   **Description:** Search for LinkedIn users with various filters.  
   **Parameters:**  
   - `keywords` (optional): Any keyword for search.  
   - `first_name`, `last_name`, `title`, `company_keywords`, `school_keywords` (optional).  
   - `current_company`, `past_company`, `location`, `industry`, `education` (optional).  
   - `count` (optional, default: 10): Maximum number of results (max 1000).  
   - `timeout` (optional, default: 300): Timeout in seconds (20–1500).

2. **Get LinkedIn Profile**  
   **Name:** `get_linkedin_profile`  
   **Description:** Retrieve detailed profile information about a LinkedIn user.  
   **Parameters:**  
   - `user` (required): User alias, URL, or URN.  
   - `with_experience`, `with_education`, `with_skills` (optional, default: true).

3. **Get LinkedIn Email User**  
   **Name:** `get_linkedin_email_user`  
   **Description:** Look up LinkedIn user details by email.  
   **Parameters:**  
   - `email` (required): Email address.  
   - `count` (optional, default: 5).  
   - `timeout` (optional, default: 300).

4. **Get LinkedIn User Posts**  
   **Name:** `get_linkedin_user_posts`  
   **Description:** Retrieve posts for a LinkedIn user by URN.  
   **Parameters:**  
   - `urn` (required): User URN (must include prefix, e.g. `fsd_profile:...`).  
   - `count` (optional, default: 10).  
   - `timeout` (optional, default: 300).

5. **Get LinkedIn User Reactions**  
   **Name:** `get_linkedin_user_reactions`  
   **Description:** Retrieve reactions for a LinkedIn user by URN.  
   **Parameters:**  
   - `urn` (required).  
   - `count` (optional, default: 10).  
   - `timeout` (optional, default: 300).

6. **Get LinkedIn Chat Messages**  
   **Name:** `get_linkedin_chat_messages`  
   **Description:** Retrieve top chat messages from the LinkedIn management API.  
   **Parameters:**  
   - `user` (required): User URN (with prefix).  
   - `count` (optional, default: 20).  
   - `timeout` (optional, default: 300).

7. **Send LinkedIn Chat Message**  
   **Name:** `send_linkedin_chat_message`  
   **Description:** Send a chat message using the LinkedIn management API.  
   **Parameters:**  
   - `user` (required): Recipient user URN (with prefix).  
   - `text` (required): Message text.  
   - `timeout` (optional, default: 300).

8. **Send LinkedIn Connection Request**  
   **Name:** `send_linkedin_connection`  
   **Description:** Send a connection invitation to a LinkedIn user.  
   **Parameters:**  
   - `user` (required).  
   - `timeout` (optional, default: 300).

9. **Send LinkedIn Post Comment**  
   **Name:** `send_linkedin_post_comment`  
   **Description:** Create a comment on a LinkedIn post or reply.  
   **Parameters:**  
   - `text` (required): Comment text.  
   - `urn` (required): Activity or comment URN.  
   - `timeout` (optional, default: 300).

10. **Get LinkedIn User Connections**  
    **Name:** `get_linkedin_user_connections`  
    **Description:** Retrieve a list of LinkedIn user connections.  
    **Parameters:**  
    - `connected_after` (optional): Timestamp filter.  
    - `count` (optional, default: 20).  
    - `timeout` (optional, default: 300).

11. **Get LinkedIn Post Reposts**  
    **Name:** `get_linkedin_post_reposts`  
    **Description:** Retrieve reposts for a LinkedIn post.  
    **Parameters:**  
    - `urn` (required): Post URN (must start with `activity:`).  
    - `count` (optional, default: 10).  
    - `timeout` (optional, default: 300).

12. **Get LinkedIn Post Comments**  
    **Name:** `get_linkedin_post_comments`  
    **Description:** Retrieve comments for a LinkedIn post.  
    **Parameters:**  
    - `urn` (required): Post URN (must start with `activity:`).  
    - `sort` (optional, default: `"relevance"`; allowed values: `"relevance"`, `"recent"`).  
    - `count` (optional, default: 10).  
    - `timeout` (optional, default: 300).

13. **Get LinkedIn Post Reactions**  
    **Name:** `get_linkedin_post_reactions`  
    **Description:** Retrieve reactions for a LinkedIn post.  
    **Parameters:**  
    - `urn` (required): Post URN (must start with `activity:`).  
    - `count` (optional, default: 50).  
    - `timeout` (optional, default: 300).

14. **Get LinkedIn Google Company**  
    **Name:** `get_linkedin_google_company`  
    **Description:** Search for LinkedIn companies via Google – the first result is typically the best match.  
    **Parameters:**  
    - `keywords` (required): Array of company keywords.  
    - `with_urn` (optional, default: false).  
    - `count_per_keyword` (optional, default: 1; range 1–10).  
    - `timeout` (optional, default: 300).

15. **Get LinkedIn Company**  
    **Name:** `get_linkedin_company`  
    **Description:** Retrieve detailed information about a LinkedIn company.  
    **Parameters:**  
    - `company` (required): Company alias, URL, or URN.  
    - `timeout` (optional, default: 300).

16. **Get LinkedIn Company Employees**  
    **Name:** `get_linkedin_company_employees`  
    **Description:** Retrieve employees of a LinkedIn company.  
    **Parameters:**  
    - `companies` (required): Array of company URNs.  
    - `keywords`, `first_name`, `last_name` (optional).  
    - `count` (optional, default: 10).  
    - `timeout` (optional, default: 300).

17. **Search Reddit Posts**  
    **Name:** `search_reddit_posts`  
    **Description:** Search for Reddit posts with various filters.  
    **Parameters:**  
    - `query` (required): Main search query.  
    - `sort` (optional, default: `"relevance"`; allowed values: `"relevance"`, `"hot"`, `"top"`, `"new"`, `"comments"`).  
    - `time_filter` (optional, default: `"all"`; allowed values: `"all"`, `"year"`, `"month"`, `"week"`, `"day"`, `"hour"`).  
    - `count` (required): Max result count.  
    - `timeout` (optional, default: 300).

---

## Endpoints HTTP (Express local)

Le serveur MCP lance aussi un serveur HTTP local (par défaut sur `http://localhost:4000`) pour faciliter l’intégration front-end.

- `POST /prospect`  
  Cherche un profil selon `nom`, `secteur` et `localisation`, puis renvoie le profil détaillé du premier résultat.

- `POST /prospects`  
  Renvoie une liste simplifiée (top 5) avec `nom`, `headline`, `localisation`, `url`, `image`, `urn`, `alias` pour laisser l’utilisateur choisir le bon profil.

- `POST /prospect/detail`  
  Récupère le profil complet d’un utilisateur à partir de `identifier`/`alias`/`url`/`urn` (fallback interne). La réponse est un objet profil normalisé (et non un tableau).

- `POST /prospect/posts`  
  Renvoie les posts d’un utilisateur via son `urn` (format `fsd_profile:...`). Paramètres: `urn`, `count?`.

- `POST /prospect/user-activity`  
  Renvoie l’activité de l’utilisateur (ce qu’il a fait): `{ comments, reactions }` où `comments` = derniers commentaires postés par l’utilisateur, `reactions` = dernières réactions laissées par l’utilisateur.  
  Paramètres: `urn` (format `fsd_profile:...`), `comments_count?` (par défaut 10), `reactions_count?` (par défaut 50).

Note: Cette route consomme exclusivement les outils MCP alignés « utilisateur » (`get_linkedin_user_comments` et `get_linkedin_user_reactions`). Aucun contenu de « dernier post » n’est renvoyé ici.

---

## Setup Guide

### Installing via Smithery

To install HDW MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@horizondatawave/hdw-mcp-server):

```bash
npx -y @smithery/cli install @horizondatawave/hdw-mcp-server --client claude
```

### 1. Clone the Repository (macOS)

Open your terminal and run the following commands:

```bash
# Clone the repository
git clone https://github.com/horizondatawave/hdw-mcp-server.git

# Change directory to the project folder
cd hdw-mcp-server

# Install dependencies
npm install
```
### 2. Obtain Your API Credentials

Register at [app.horizondatawave.ai](https://app.horizondatawave.ai) to get your API key and 100 free credits. You will receive your **HDW_ACCESS_TOKEN** and **HDW_ACCOUNT_ID**.

---

### 3. Configure the Environment

Create a `.env` file in the root of your project with the following content:

```env
HDW_ACCESS_TOKEN=YOUR_HD_W_ACCESS_TOKEN
HDW_ACCOUNT_ID=YOUR_HD_W_ACCOUNT_ID
```

The server also auto-loads a user-level env file if present: `~/.hdw-mcp.env`. This is convenient to avoid committing secrets.

Minimum required: `HDW_ACCESS_TOKEN`. Some management endpoints also require `HDW_ACCOUNT_ID`.
### 4. Client Configuration

#### 4.1 Claude Desktop

Update your Claude configuration file (`claude_desktop_config.json`) with the following content:

```json
{
  "mcpServers": {
    "hdw": {
      "command": "npx",
      "args": ["-y","@horizondatawave/mcp"],
      "env": {
        "HDW_ACCESS_TOKEN": "YOUR_HD_W_ACCESS_TOKEN",
        "HDW_ACCOUNT_ID": "YOUR_HD_W_ACCOUNT_ID"
      }
    }
  }
}
```
*Configuration file location:*

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

---

#### 4.2 Cursor

**Easy way:**  
Open Cursor Settings and add a new MCP server with the command:

```bash
env HDW_ACCESS_TOKEN=your-access-token HDW_ACCOUNT_ID=your-account-id node /path/to/your/build/index.js
```
**Safe way:**  
Copy the provided template `run.template.sh` to a new file (e.g. `run.sh`), update it with your credentials, and configure Cursor to run:

```bash
sh /path/to/your/run.sh
```
#### 4.3 Windsurf

Update your Windsurf configuration file (`mcp_config.json`) with the following content:

```json
{
  "mcpServers": {
    "hdw": {
      "command": "npx",
      "args": ["-y","@horizondatawave/mcp"],
      "env": {
        "HDW_ACCESS_TOKEN": "YOUR_HD_W_ACCESS_TOKEN",
        "HDW_ACCOUNT_ID": "YOUR_HD_W_ACCOUNT_ID"
      }
    }
  }
}
```
**Note:** After configuration, you can disable official web tools to conserve your API credits.

---

### MCP Client Example Configuration

Below is an example configuration for an MCP client (e.g., a custom integration):

```json
{
  "mcpServers": {
    "hdw": {
      "command": "npx",
      "args": ["-y","@horizondatawave/mcp"],
      "env": {
        "HDW_ACCESS_TOKEN": "YOUR_HD_W_ACCESS_TOKEN",
        "HDW_ACCOUNT_ID": "YOUR_HD_W_ACCOUNT_ID"
      }
    }
  }
}
```
Replace the paths and credentials with your own values.

---

## Spécifications Techniques & Fonctionnelles (Single Source of Truth)

### Architecture
- **MCP (stdio)**: serveur MCP accessible par les clients (Cursor/Claude/Windsurf) via stdio. Entrée: `backend-local/hdw-mcp-server/src/index.ts` (transpilé en `build/index.js`).
- **HTTP (Express)**: serveur local sur `:4000` exposant des routes pour intégration front Web/JS.
- **HDW API**: backend externe HorizonDataWave (`https://api.horizondatawave.ai`). Auth par header `access-token`.

Flux type:
1) Client MCP → Tool name + payload → serveur MCP.
2) Serveur MCP → `makeRequest()` → HDW API.
3) Réponse HDW → renvoyée à MCP client et/ou aux routes Express.

### Authentification
- `HDW_ACCESS_TOKEN` obligatoire (header `access-token`).
- `HDW_ACCOUNT_ID` requis pour certaines routes de management (chat, conversations, post…).
- Chargement d’`env` depuis `.env` et `~/.hdw-mcp.env`.

### Endpoints MCP (Tools)
Voir section « Tools » ci-dessus. Chaque tool valide ses paramètres (fonctions `isValid*` dans `src/types.ts`) et appelle l’endpoint HDW correspondant via `makeRequest`.

### Endpoints HTTP (Express)
Voir section dédiée. 4 routes principales: `/prospect`, `/prospects`, `/prospect/detail`, `/prospect/posts`, `/prospect/user-activity`.

### Modèles de données (extraits clés)
- Utilisateur (simplifié, retour `/prospects`): `{ nom, headline, localisation, url, image, urn, alias }`.
- Profil détaillé: structure complète HDW (profil + éventuellement expériences/éducation/skills si fournis par HDW). NB: l’API peut parfois renvoyer un tableau mono-élément.
- Posts utilisateur: tableau d’objets post (champ `urn` type `activity:...`, `text`, `images`, `video_url`, `reactions`, etc.).
- Activité utilisateur: `{ comments: Comment[], reactions: Reaction[] }` (commentaires et réactions FAITS par l’utilisateur, avec `post.urn` source, `url`, `created_at`, etc.).

### Gestion des erreurs
- Niveau MCP: toute erreur HDW (`!response.ok`) est transformée en `Error` avec message explicite (`API error: <status> <message>`), loguée et renvoyée comme contenu d’erreur MCP.
- Niveau Express: erreurs renvoyées en JSON `{ error, details }` avec codes: 400 (mauvais paramètres), 502 (échec tiers), 500 (erreur interne).
- Cas connus: `500 Internal Server Error` sur `post/reactions` (selon plan/jeton); préférer les routes « user-* » pour l’activité utilisateur.

### Guides pas à pas
1) Démarrer en local
   - `cd backend-local/hdw-mcp-server && npm install && npm run build && node build/index.js`
   - Vérifier: logs `Serveur HTTP Express lancé sur le port 4000`.
2) Rechercher top 5 profils (HTTP)
   - `POST http://localhost:4000/prospects` body: `{ "nom": "laurent serre", "secteur": "", "localisation": "" }`.
3) Obtenir profil détaillé (HTTP)
   - `POST http://localhost:4000/prospect/detail` body: `{ "identifier":"alias|url|urn" }`.
4) Posts (HTTP)
   - `POST http://localhost:4000/prospect/posts` body: `{ "urn": "fsd_profile:...", "count": 5 }`.
5) Commentaires & Réactions FAITS par l’utilisateur (HTTP)
   - `POST http://localhost:4000/prospect/user-activity` body: `{ "urn": "fsd_profile:...", "comments_count": 10, "reactions_count": 50 }`.
6) Côté MCP (exemples)
   - `search_linkedin_users` → `{ keywords: "laurent serre", count: 5 }`.
   - `get_linkedin_profile` → `{ user: "laurentserre34", with_experience: true, with_education: true, with_skills: true }`.
   - `get_linkedin_user_posts` → `{ urn: "fsd_profile:...", count: 5 }`.
   - `get_linkedin_user_reactions` → `{ urn: "fsd_profile:...", count: 50 }`.

### Cas d’usage typiques
- Recherche + sélection d’un profil, puis affichage exhaustif du profil, et navigation par onglets: Profil | Posts | Commentaires & Réactions (faits par l’utilisateur).
- Monitoring d’activité utilisateur (derniers commentaires/réactions) sans dépendre des endpoints « post-* ».

### Glossaire
- **MCP**: protocole de dialogue outil-assistant par stdio.
- **HDW**: Horizon Data Wave, fournisseur API LinkedIn/Google/Reddit.
- **URN**: identifiant de ressource (ex: `fsd_profile:...` pour user, `activity:...` pour post).
- **Activity**: URN de post LinkedIn (`activity:<id>`).
- **Management API**: endpoints d’actions (messages, connexions, posts, etc.).
## License

This project is licensed under the [MIT License](LICENSE.md).
