import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({ nom: '' });
  const [fiche, setFiche] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFiche(null);
    setProspects([]);
    
    try {
      // URL API locale (Express) en dev; en prod, route serverless/edge si définie
      const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';
      const apiListUrl = `${baseUrl}/prospects`;

      // 1) Charger uniquement la liste des 5 profils correspondants
      const resList = await fetch(apiListUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const list = await resList.json();
      setProspects(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('❌ Erreur lors de la recherche:', err);
      alert('Erreur lors de la recherche du prospect.');
    }
    setLoading(false);
  };

  const handleSelectProspect = async (p) => {
    setLoading(true);
    setFiche(null);
    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';
      const detailUrl = `${baseUrl}/prospect/detail`;
      const payload = {
        alias: p.alias,
        url: p.url,
        urn: p.urn,
      };
      const res = await fetch(detailUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const normalized = Array.isArray(data) ? (data[0] || null) : data;
      if (!normalized) throw new Error('Profil vide');
      setFiche(normalized);
    } catch (err) {
      console.error('❌ Erreur lors du chargement du profil détaillé:', err);
      alert("Erreur lors du chargement du profil détaillé.");
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
      {prospects.length > 0 && (
        <div style={{
          marginTop: 24,
          padding: 16,
          border: '2px solid #0077b5',
          borderRadius: 12,
          backgroundColor: 'white'
        }}>
          <h2 style={{ color: '#0077b5', marginBottom: 12 }}>🧑‍💼 Sélectionnez un profil</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {prospects.map((p, idx) => (
              <li key={idx} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 10,
                border: '1px solid #e0e0e0', borderRadius: 8, background: '#f8f9fa'
              }}>
                {p.image && <img src={p.image} alt={p.nom} style={{ width: 48, height: 48, borderRadius: '50%' }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{p.nom}</div>
                  <div style={{ fontSize: 13, color: '#555' }}>{p.headline}</div>
                  <div style={{ fontSize: 12, color: '#777' }}>{p.localisation}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleSelectProspect(p)}
                    disabled={loading}
                    style={{
                      padding: '8px 12px',
                      fontSize: 14,
                      backgroundColor: '#0077b5',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >Afficher profil</button>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}>Voir</a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          }}>📋 Profil LinkedIn (exhaustif)</h2>
          <div style={{ 
            background: '#fff', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px', 
            padding: '15px',
            overflow: 'auto',
            maxHeight: '70vh'
          }}>
            <pre style={{ 
              margin: 0, 
              fontSize: '12px', 
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {JSON.stringify(fiche, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
