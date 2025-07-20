// Fonction serverless Vercel pour la recherche de prospects LinkedIn
module.exports = async function handler(req, res) {
  try {
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

    // Log pour debug
    console.log('Requête reçue:', { method: req.method, body: req.body });

    const { nom } = req.body || {};

    // Configuration de l'API Horizon Data Wave
    const API_KEY = process.env.HDW_ACCESS_TOKEN;
    const ACCOUNT_ID = process.env.HDW_ACCOUNT_ID;

    console.log('Variables env:', { 
      hasApiKey: !!API_KEY, 
      hasAccountId: !!ACCOUNT_ID 
    });

    if (!API_KEY) {
      console.error('HDW_ACCESS_TOKEN manquant');
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

      console.log('Appel API HDW:', { url, data });

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur API HDW:', { status: response.status, errorData });
        throw new Error(`API error: ${response.status} ${errorData.message || response.statusText}`);
      }

      return await response.json();
    }

    const searchParams = {
      keywords: nom || '',
      count: 1,
      timeout: 300
    };

    console.log('Paramètres de recherche:', searchParams);

    const results = await makeRequest(API_CONFIG.ENDPOINTS.SEARCH_USERS, searchParams);

    console.log('Résultats reçus:', results);

    if (results && results.length > 0) {
      const user = results[0];
      const response = {
        nom: user.name,
        email: "", // LinkedIn ne fournit pas l'email
        telephone: "", // LinkedIn ne fournit pas le téléphone
        description: user.headline,
        url: user.url,
        image: user.image
      };
      
      console.log('Réponse envoyée:', response);
      res.status(200).json(response);
    } else {
      console.log('Aucun prospect trouvé');
      res.status(200).json({ message: "Aucun prospect trouvé." });
    }
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(500).json({ 
      error: "Erreur lors de la recherche LinkedIn", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 