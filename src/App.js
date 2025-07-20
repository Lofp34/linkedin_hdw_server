import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({ nom: '' });
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
    <div style={{ 
      maxWidth: 500, 
      margin: '40px auto', 
      fontFamily: 'sans-serif',
      padding: '0 20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#0077b5',
        marginBottom: '30px',
        fontSize: '2rem'
      }}>🔍 Recherche de prospect</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input 
          name="nom" 
          placeholder="Nom, entreprise, secteur, localisation..." 
          value={form.nom} 
          onChange={handleChange}
          style={{
            padding: '15px',
            fontSize: '16px',
            border: '2px solid #0077b5',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '15px',
            fontSize: '16px',
            backgroundColor: '#0077b5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '🔍 Recherche...' : '🔍 Rechercher'}
        </button>
      </form>
      {fiche && (
        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          border: '2px solid #0077b5', 
          borderRadius: 12,
          backgroundColor: '#f8f9fa',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            color: '#0077b5', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>📋 Fiche prospect</h2>
          <p><b>Nom :</b> {fiche.nom}</p>
          <p><b>Email :</b> {fiche.email}</p>
          <p><b>Téléphone :</b> {fiche.telephone}</p>
          <p><b>Description :</b> {fiche.description}</p>
          {fiche.url && (
            <p><b>Lien LinkedIn :</b> <a href={fiche.url} target="_blank" rel="noopener noreferrer">{fiche.url}</a></p>
          )}
          {fiche.image && (
            <div style={{ marginTop: 16 }}>
              <img src={fiche.image} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
