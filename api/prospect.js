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
      
      // Récupération du profil détaillé
      let detailedProfile = null;
      let userPosts = null;
      let userReactions = null;
      let emailInfo = null;
      
      try {
        // Version simplifiée pour tester d'abord les données de base
        console.log('Test avec données de base uniquement pour le moment');
        
        // On commente temporairement les appels détaillés pour debug
        /*
        // 1. Profil détaillé avec expérience, éducation, compétences
        if (user.urn) {
          console.log('Récupération du profil détaillé pour:', user.urn);
          detailedProfile = await makeRequest('/api/linkedin/get/profile', {
            user: user.urn,
            with_experience: true,
            with_education: true,
            with_skills: true
          });
        }
        
        // 2. Posts récents de l'utilisateur
        if (user.urn) {
          console.log('Récupération des posts pour:', user.urn);
          userPosts = await makeRequest('/api/linkedin/get/user/posts', {
            urn: user.urn,
            count: 5
          });
        }
        
        // 3. Réactions récentes
        if (user.urn) {
          console.log('Récupération des réactions pour:', user.urn);
          userReactions = await makeRequest('/api/linkedin/get/user/reactions', {
            urn: user.urn,
            count: 5
          });
        }
        
        // 4. Recherche par email si disponible
        if (user.email) {
          console.log('Recherche par email:', user.email);
          emailInfo = await makeRequest('/api/linkedin/get/email/user', {
            email: user.email,
            count: 1
          });
        }
        */
        
      } catch (error) {
        console.log('Erreur lors de la récupération des données détaillées:', error.message);
      }

      // Debug: affichons la structure exacte des données reçues
      console.log('Structure des données utilisateur:', JSON.stringify(user, null, 2));
      console.log('Structure du profil détaillé:', JSON.stringify(detailedProfile, null, 2));
      
      // Construction de la réponse complète avec gestion des champs manquants
      const response = {
        // Informations de base (avec fallbacks)
        nom: user.name || user.fullName || user.displayName || "Nom non disponible",
        headline: user.headline || user.title || user.jobTitle || user.description || "Titre non disponible",
        location: user.location || user.geoLocation || user.area || "Localisation non disponible",
        url: user.url || user.profileUrl || user.linkedinUrl || "",
        image: user.image || user.profileImage || user.avatar || "",
        urn: user.urn || user.id || "",
        
        // Informations de contact
        email: emailInfo?.[0]?.email || user.email || "",
        telephone: emailInfo?.[0]?.phone || user.phone || "",
        
        // Profil détaillé (avec gestion des structures différentes)
        experience: detailedProfile?.experience || detailedProfile?.workExperience || detailedProfile?.positions || [],
        education: detailedProfile?.education || detailedProfile?.schools || detailedProfile?.academicBackground || [],
        skills: detailedProfile?.skills || detailedProfile?.endorsements || detailedProfile?.expertise || [],
        
        // Activité récente
        posts: userPosts || [],
        reactions: userReactions || [],
        
        // Statistiques
        postCount: userPosts?.length || 0,
        reactionCount: userReactions?.length || 0,
        experienceCount: (detailedProfile?.experience || detailedProfile?.workExperience || detailedProfile?.positions || []).length,
        educationCount: (detailedProfile?.education || detailedProfile?.schools || detailedProfile?.academicBackground || []).length,
        skillsCount: (detailedProfile?.skills || detailedProfile?.endorsements || detailedProfile?.expertise || []).length,
        
        // Métadonnées
        lastUpdated: new Date().toISOString(),
        searchQuery: nom || ""
      };
      
      console.log('Réponse complète envoyée:', response);
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