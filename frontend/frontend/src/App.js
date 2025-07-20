import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({ nom: '', secteur: '', localisation: '' });
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFiche(null);
    try {
      // URL adaptée pour Vercel (API serverless) vs développement local
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/prospect' 
        : 'http://localhost:4000/prospect';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setFiche(data);
    } catch (err) {
      alert('Erreur lors de la recherche du prospect.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Recherche de prospect</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} />
        <input name="secteur" placeholder="Secteur" value={form.secteur} onChange={handleChange} />
        <input name="localisation" placeholder="Localisation" value={form.localisation} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Recherche...' : 'Rechercher'}</button>
      </form>
      {fiche && (
        <div style={{ marginTop: 32, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
          <h2>Fiche prospect</h2>
          <p><b>Nom :</b> {fiche.nom}</p>
          <p><b>Secteur :</b> {fiche.secteur}</p>
          <p><b>Localisation :</b> {fiche.localisation}</p>
          <p><b>Email :</b> {fiche.email}</p>
          <p><b>Téléphone :</b> {fiche.telephone}</p>
          <p><b>Description :</b> {fiche.description}</p>
          {fiche.url && (
            <p><b>Lien LinkedIn :</b> <a href={fiche.url} target="_blank" rel="noopener noreferrer">{fiche.url}</a></p>
          )}
          {fiche.image && (
            <div style={{ marginTop: 16 }}>
              <img src={fiche.image} alt="Photo de profil" style={{ width: 100, height: 100, borderRadius: '50%' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
