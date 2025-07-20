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
      // URL de l'API Vercel (serverless function)
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/prospect' 
        : 'https://hdw-server-front-back-58kqvlice.vercel.app/api/prospect';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      setFiche(data);
    } catch (err) {
      console.error('❌ Erreur lors de la recherche:', err);
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
          }}>📋 Fiche prospect complète</h2>
          
          {/* Informations de base */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#0077b5', borderBottom: '2px solid #0077b5', paddingBottom: '5px' }}>
              👤 Informations de base
            </h3>
            <p><b>Nom :</b> {fiche.nom}</p>
            <p><b>Headline :</b> {fiche.headline}</p>
            <p><b>Localisation :</b> {fiche.location}</p>
            <p><b>Email :</b> {fiche.email || 'Non disponible'}</p>
            <p><b>Téléphone :</b> {fiche.telephone || 'Non disponible'}</p>
            {fiche.url && (
              <p><b>Lien LinkedIn :</b> <a href={fiche.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}>{fiche.url}</a></p>
            )}
            {fiche.image && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <img src={fiche.image} alt="Avatar" style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid #0077b5' }} />
              </div>
            )}
          </div>

          {/* Expérience professionnelle */}
          {fiche.experience && fiche.experience.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#0077b5', borderBottom: '2px solid #0077b5', paddingBottom: '5px' }}>
                💼 Expérience professionnelle ({fiche.experienceCount})
              </h3>
              {fiche.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <p><b>Poste :</b> {exp.title}</p>
                  <p><b>Entreprise :</b> {exp.company}</p>
                  <p><b>Période :</b> {exp.startDate} - {exp.endDate || 'Présent'}</p>
                  {exp.description && <p><b>Description :</b> {exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Formation */}
          {fiche.education && fiche.education.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#0077b5', borderBottom: '2px solid #0077b5', paddingBottom: '5px' }}>
                🎓 Formation ({fiche.educationCount})
              </h3>
              {fiche.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <p><b>Diplôme :</b> {edu.degree}</p>
                  <p><b>Établissement :</b> {edu.school}</p>
                  <p><b>Période :</b> {edu.startDate} - {edu.endDate || 'Présent'}</p>
                </div>
              ))}
            </div>
          )}

          {/* Compétences */}
          {fiche.skills && fiche.skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#0077b5', borderBottom: '2px solid #0077b5', paddingBottom: '5px' }}>
                🛠️ Compétences ({fiche.skillsCount})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fiche.skills.map((skill, index) => (
                  <span key={index} style={{ 
                    backgroundColor: '#0077b5', 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '15px', 
                    fontSize: '14px' 
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Posts récents */}
          {fiche.posts && fiche.posts.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#0077b5', borderBottom: '2px solid #0077b5', paddingBottom: '5px' }}>
                📝 Posts récents ({fiche.postCount})
              </h3>
              {fiche.posts.map((post, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <p><b>Date :</b> {new Date(post.createdAt).toLocaleDateString('fr-FR')}</p>
                  <p><b>Contenu :</b> {post.text?.substring(0, 200)}...</p>
                  <p><b>Likes :</b> {post.likes || 0} | <b>Commentaires :</b> {post.comments || 0}</p>
                </div>
              ))}
            </div>
          )}

          {/* Réactions récentes */}
          {fiche.reactions && fiche.reactions.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#0077b5', borderBottom: '2px solid #0077b5', paddingBottom: '5px' }}>
                👍 Réactions récentes ({fiche.reactionCount})
              </h3>
              {fiche.reactions.map((reaction, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <p><b>Type :</b> {reaction.type}</p>
                  <p><b>Date :</b> {new Date(reaction.createdAt).toLocaleDateString('fr-FR')}</p>
                  <p><b>Sur le post de :</b> {reaction.postAuthor}</p>
                </div>
              ))}
            </div>
          )}

          {/* Métadonnées */}
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '8px', fontSize: '12px' }}>
            <p><b>Dernière mise à jour :</b> {fiche.lastUpdated ? new Date(fiche.lastUpdated).toLocaleString('fr-FR') : 'Non disponible'}</p>
            <p><b>Recherche effectuée :</b> "{fiche.searchQuery || 'Aucune'}"</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
