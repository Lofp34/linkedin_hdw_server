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

    // Fonction pour faire les requêtes vers l'API HDW avec timeout
    async function makeRequest(endpoint, data, timeout = 10000) {
      const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, "");
      const url = baseUrl + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`);
      const headers = {
        "Content-Type": "application/json",
        "access-token": API_KEY
      };

      console.log('🌐 Appel API HDW:', { url, data });

      // Créer un contrôleur d'abandon pour le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Erreur API HDW:', { status: response.status, errorData });
          throw new Error(`API error: ${response.status} ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Réponse API HDW reçue pour:', endpoint);
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error(`Timeout après ${timeout}ms pour ${endpoint}`);
        }
        throw error;
      }
    }

    const searchParams = {
      keywords: nom || '',
      count: 1,
      timeout: 300
    };

    console.log('Paramètres de recherche:', searchParams);

    const results = await makeRequest(API_CONFIG.ENDPOINTS.SEARCH_USERS, searchParams);

    console.log('🔍 Résultats bruts reçus:', JSON.stringify(results, null, 2));
    console.log('📊 Type de résultats:', typeof results);
    console.log('📊 Est-ce un array?', Array.isArray(results));
    console.log('📊 Longueur:', results?.length);

    if (results && results.length > 0) {
      console.log('✅ Utilisateur trouvé, traitement en cours...');
      const user = results[0];
      
      // Récupération du profil détaillé
      let detailedProfile = null;
      let userPosts = null;
      let userReactions = null;
      let emailInfo = null;
      
      try {
        console.log('🔍 Récupération des données détaillées...');
        
        // 1. Profil détaillé avec expérience, éducation, compétences
        const userUrn = user.urn?.value || user.urn;
        console.log('🔍 Vérification URN utilisateur:', userUrn || 'URN manquant');
        if (userUrn) {
          console.log('📋 Récupération du profil détaillé pour:', userUrn);
          try {
            detailedProfile = await makeRequest('/api/linkedin/get/profile', {
              user: userUrn,
              with_experience: true,
              with_education: true,
              with_skills: true
            }, 8000); // Timeout 8 secondes
            console.log('✅ Profil détaillé récupéré:', detailedProfile);
          } catch (error) {
            console.log('⚠️ Erreur profil détaillé:', error.message);
          }
        }
        
        // 2. Posts récents de l'utilisateur
        if (userUrn) {
          console.log('📝 Récupération des posts pour:', userUrn);
          try {
            userPosts = await makeRequest('/api/linkedin/get/user/posts', {
              urn: userUrn,
              count: 5
            }, 6000); // Timeout 6 secondes
            console.log('✅ Posts récupérés:', userPosts?.length || 0);
          } catch (error) {
            console.log('⚠️ Erreur posts:', error.message);
          }
        }
        
        // 3. Réactions récentes
        if (userUrn) {
          console.log('👍 Récupération des réactions pour:', userUrn);
          try {
            userReactions = await makeRequest('/api/linkedin/get/user/reactions', {
              urn: userUrn,
              count: 5
            }, 6000); // Timeout 6 secondes
            console.log('✅ Réactions récupérées:', userReactions?.length || 0);
          } catch (error) {
            console.log('⚠️ Erreur réactions:', error.message);
          }
        }
        
        // 4. Recherche par email si disponible
        if (user.email) {
          console.log('📧 Recherche par email:', user.email);
          try {
            emailInfo = await makeRequest('/api/linkedin/get/email/user', {
              email: user.email,
              count: 1
            });
            console.log('✅ Email info récupéré:', emailInfo);
          } catch (error) {
            console.log('⚠️ Erreur email lookup:', error.message);
          }
        }
        
        console.log('🎉 Récupération des données détaillées terminée');
        
      } catch (error) {
        console.log('❌ Erreur générale lors de la récupération des données détaillées:', error.message);
      }

      // Debug: affichons la structure exacte des données reçues
      console.log('🔍 Structure des données utilisateur:', JSON.stringify(user, null, 2));
      console.log('📋 Structure du profil détaillé:', JSON.stringify(detailedProfile, null, 2));
      console.log('📝 Structure des posts:', JSON.stringify(userPosts, null, 2));
      console.log('👍 Structure des réactions:', JSON.stringify(userReactions, null, 2));
      
      // Construction de la réponse complète avec gestion des champs manquants
      const response = {
        // Informations de base (avec fallbacks)
        nom: user.name || user.fullName || user.displayName || "Nom non disponible",
        headline: user.headline || user.title || user.jobTitle || user.description || "Titre non disponible",
        location: user.location || user.geoLocation || user.area || "Localisation non disponible",
        url: user.url || user.profileUrl || user.linkedinUrl || "",
        image: user.image || user.profileImage || user.avatar || "",
        urn: userUrn || user.urn?.value || user.urn || user.id || "",
        
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
      console.log('❌ Aucun prospect trouvé dans les résultats');
      console.log('🔍 Résultats reçus:', results);
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