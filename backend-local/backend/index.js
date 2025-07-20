const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Route mockée pour tester le flux
app.post('/prospect', (req, res) => {
  const { nom, secteur, localisation } = req.body;
  // Fiche fictive pour test
  const fiche = {
    nom: nom || 'Jean Dupont',
    secteur: secteur || 'Informatique',
    localisation: localisation || 'Paris',
    email: 'jean.dupont@email.com',
    telephone: '06 12 34 56 78',
    description: "Prospect fictif pour test MVP."
  };
  res.json(fiche);
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
}); 