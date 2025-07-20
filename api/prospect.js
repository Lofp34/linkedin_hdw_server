// Fonction serverless Vercel pour la recherche de prospects LinkedIn
export default async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  const { nom, secteur, localisation } = req.body;

  // Configuration de l'API Horizon Data Wave
  const API_KEY = process.env.HDW_ACCESS_TOKEN;
  const ACCOUNT_ID = process.env.HDW_ACCOUNT_ID;

  if (!API_KEY) {
    res.status(500).json({ error: 'HDW_ACCESS_TOKEN manquant' });
    return;
  }

  const API_CONFIG = {
    BASE_URL: "https://api.horizondatawave.ai",
    ENDPOINTS: {
      SEARCH_USERS: "/api/linkedin/search/users"
    }
  };

  // Fonction pour faire les requêtes vers l'API HDW
  async function makeRequest(endpoint, data) {
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, "");
    const url = baseUrl + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`);
    const headers = {
      "Content-Type": "application/json",
      "access-token": API_KEY
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} ${errorData.message || response.statusText}`);
    }

    return await response.json();
  }

  try {
    const searchParams = {
      keywords: nom,
      industry: secteur,
      location: localisation,
      count: 1,
      timeout: 300
    };

    const results = await makeRequest(API_CONFIG.ENDPOINTS.SEARCH_USERS, searchParams);

    if (results && results.length > 0) {
      const user = results[0];
      res.status(200).json({
        nom: user.name,
        secteur: user.headline,
        localisation: user.location,
        email: "", // LinkedIn ne fournit pas l'email
        telephone: "", // LinkedIn ne fournit pas le téléphone
        description: user.headline,
        url: user.url,
        image: user.image
      });
    } else {
      res.status(200).json({ message: "Aucun prospect trouvé." });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche LinkedIn:', error);
    res.status(500).json({ 
      error: "Erreur lors de la recherche LinkedIn", 
      details: error.message 
    });
  }
} 