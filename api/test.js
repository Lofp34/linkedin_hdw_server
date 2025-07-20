// API de test pour vérifier la configuration Vercel
module.exports = async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const API_KEY = process.env.HDW_ACCESS_TOKEN;
    const ACCOUNT_ID = process.env.HDW_ACCOUNT_ID;

    res.status(200).json({
      message: "API de test fonctionnelle",
      timestamp: new Date().toISOString(),
      hasApiKey: !!API_KEY,
      hasAccountId: !!ACCOUNT_ID,
      apiKeyLength: API_KEY ? API_KEY.length : 0,
      nodeEnv: process.env.NODE_ENV,
      method: req.method,
      body: req.body
    });
  } catch (error) {
    res.status(500).json({
      error: "Erreur dans l'API de test",
      details: error.message
    });
  }
}; 