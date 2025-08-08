import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({ nom: '' });
  const [fiche, setFiche] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [expandedExperiences, setExpandedExperiences] = useState({});
  const [expandedEducations, setExpandedEducations] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [posts, setPosts] = useState([]);
  const [lastActivity, setLastActivity] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const renderProfile = (profile) => {
    if (!profile) return null;

    const truncate = (text, max = 320) => {
      if (typeof text !== 'string') return '';
      return text.length > max ? `${text.slice(0, max)}…` : text;
    };

    const toArray = (v) => (Array.isArray(v) ? v : []);
    const websites = toArray(profile.websites);
    const experience = toArray(profile.experience).slice(0, 6);
    const education = toArray(profile.education).slice(0, 6);
    const rawSkills = profile.top_skills && profile.top_skills.length
      ? profile.top_skills
      : toArray(profile.skills).map((s) => (typeof s?.name === 'string' ? s.name : null)).filter(Boolean);
    const skills = rawSkills.slice(0, 20);
    const languages = toArray(profile.languages).map((l) => (typeof l === 'string' ? l : null)).filter(Boolean);
    const certificates = toArray(profile.certificates);
    const honors = toArray(profile.honors);
    const patents = toArray(profile.patents);

    const avatarUrl = profile.image;
    const name = profile.name || 'Profil LinkedIn';
    const initials = typeof name === 'string'
      ? name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
      : '?';

    const statChip = (label, value) => (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderRadius: 999, background: '#eef5fb', color: '#0b5cab',
        fontSize: 12, fontWeight: 600
      }}>
        <span>{label}</span>
        <span style={{ background: '#0b5cab', color: 'white', padding: '2px 8px', borderRadius: 999 }}>{value}</span>
      </div>
    );

    const sectionTitle = (text) => (
      <h3 style={{
        margin: '18px 0 10px', fontSize: 16, color: '#0b5cab', borderBottom: '1px solid #e6eef5', paddingBottom: 6
      }}>{text}</h3>
    );

    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e9f2fb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#0b5cab', fontWeight: 700, fontSize: 22 }}>{initials}</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f1d2d' }}>{name}</div>
            {profile.headline && (
              <div style={{ color: '#3b4a5a', marginTop: 4 }}>{profile.headline}</div>
            )}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
              {profile.location && (
                <span style={{ fontSize: 12, color: '#5a6b7b' }}>📍 {profile.location}</span>
              )}
              {typeof profile.email === 'string' && profile.email && (
                <a href={`mailto:${profile.email}`} style={{ fontSize: 12, color: '#0b5cab', textDecoration: 'none' }}>✉️ {profile.email}</a>
              )}
              {profile.url && (
                <a href={profile.url} target="_blank" rel="noreferrer" style={{
                  marginLeft: 'auto', background: '#0b5cab', color: 'white', padding: '8px 12px', borderRadius: 8,
                  fontSize: 13, textDecoration: 'none', fontWeight: 600
                }}>Voir sur LinkedIn</a>
              )}
            </div>
          </div>
        </div>

        {/* Identifiants */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, color: '#3b4a5a', fontSize: 12 }}>
          {profile.alias && <span>Alias: <strong>{profile.alias}</strong></span>}
          {profile.urn && <span>URN: <strong>{typeof profile.urn === 'string' ? profile.urn : `${profile.urn.type}:${profile.urn.value}`}</strong></span>}
          {profile.internal_id?.value && <span>ID: <strong>{profile.internal_id.value}</strong></span>}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          {typeof profile.follower_count === 'number' && statChip('Abonnés', profile.follower_count)}
          {typeof profile.connection_count === 'number' && statChip('Connexions', profile.connection_count)}
        </div>

        {/* À propos */}
        {profile.description && (
          <div>
            {sectionTitle('À propos')}
            <div
              onClick={() => setAboutExpanded((v) => !v)}
              style={{ cursor: 'pointer', userSelect: 'none', border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12 }}
            >
              <div style={{ fontSize: 13, color: '#2a3948', whiteSpace: 'pre-wrap' }}>
                {aboutExpanded ? profile.description : truncate(profile.description, 640)}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#0b5cab' }}>{aboutExpanded ? 'Voir moins' : 'Voir plus'}</div>
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            {sectionTitle('Compétences')}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {skills.map((s, i) => (
                <span key={`skill-${i}`} style={{
                  border: '1px solid #d6e6f5', color: '#0b5cab', padding: '6px 10px', borderRadius: 999, fontSize: 12
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            {sectionTitle('Expérience')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {experience.map((exp, idx) => (
                <div
                  key={`exp-${idx}`}
                  onClick={() => setExpandedExperiences((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  style={{
                    border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12,
                    cursor: 'pointer', userSelect: 'none'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#0f1d2d' }}>
                    {(exp?.position || '').trim()} {exp?.company?.name ? (
                      <span style={{ color: '#3b4a5a', fontWeight: 500 }}> @ {exp.company.name}</span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 12, color: '#5a6b7b', marginTop: 4 }}>
                    {[exp?.interval, exp?.location, exp?.employment].filter(Boolean).join(' • ')}
                  </div>
                  {exp?.description && (
                    <div style={{ fontSize: 13, color: '#2a3948', marginTop: 8, whiteSpace: 'pre-wrap' }}>
                      {expandedExperiences[idx] ? exp.description : truncate(exp.description, 640)}
                    </div>
                  )}
                  {/* Liens entreprise */}
                  {exp?.company?.url && (
                    <div style={{ marginTop: 8 }}>
                      <a href={exp.company.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#0b5cab', textDecoration: 'none' }}>
                        Voir la société
                      </a>
                    </div>
                  )}
                  <div style={{ marginTop: 6, fontSize: 12, color: '#0b5cab' }}>
                    {expandedExperiences[idx] ? 'Voir moins' : 'Voir plus'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            {sectionTitle('Formation')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {education.map((ed, idx) => (
                <div
                  key={`edu-${idx}`}
                  onClick={() => setExpandedEducations((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  style={{
                    border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12,
                    cursor: 'pointer', userSelect: 'none'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#0f1d2d' }}>
                    {ed?.company?.name || 'Établissement'}
                  </div>
                  <div style={{ fontSize: 12, color: '#5a6b7b', marginTop: 4 }}>
                    {[ed?.major, ed?.interval].filter(Boolean).join(' • ')}
                  </div>
                  {expandedEducations[idx] && ed?.company?.url && (
                    <div style={{ marginTop: 8 }}>
                      <a href={ed.company.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#0b5cab', textDecoration: 'none' }}>
                        Voir l’établissement
                      </a>
                    </div>
                  )}
                  <div style={{ marginTop: 6, fontSize: 12, color: '#0b5cab' }}>
                    {expandedEducations[idx] ? 'Voir moins' : 'Voir plus'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <div>
            {sectionTitle('Langues')}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {languages.map((l, i) => (
                <span key={`lang-${i}`} style={{ border: '1px solid #d6e6f5', padding: '6px 10px', borderRadius: 999, fontSize: 12, color: '#3b4a5a' }}>{l}</span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certificates.length > 0 && (
          <div>
            {sectionTitle('Certifications')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {certificates.map((c, i) => (
                <div key={`cert-${i}`} style={{ border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontWeight: 700, color: '#0f1d2d' }}>{c?.name || 'Certification'}</div>
                  <div style={{ fontSize: 12, color: '#5a6b7b', marginTop: 4 }}>
                    {[c?.company?.name, c?.created_at, c?.label].filter(Boolean).join(' • ')}
                  </div>
                  {c?.url && (
                    <div style={{ marginTop: 6 }}>
                      <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#0b5cab', textDecoration: 'none' }}>Voir le certificat</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Websites */}
        {websites.length > 0 && (
          <div>
            {sectionTitle('Liens')}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {websites.map((w, i) => (
                <a key={`web-${i}`} href={w?.url} target="_blank" rel="noreferrer" style={{
                  border: '1px solid #d6e6f5', color: '#0b5cab', padding: '6px 10px', borderRadius: 999,
                  fontSize: 12, textDecoration: 'none'
                }}>{w?.url?.replace(/^https?:\/\//, '') || 'lien'}</a>
              ))}
            </div>
          </div>
        )}

        {/* Divers */}
        {(profile.pronouns || profile.custom_pronouns || profile.birth_date || honors.length > 0 || patents.length > 0) && (
          <div>
            {sectionTitle('Divers')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#2a3948' }}>
              {profile.pronouns && <div>Pronoms: {profile.pronouns}</div>}
              {profile.custom_pronouns && <div>Pronoms (perso): {profile.custom_pronouns}</div>}
              {profile.birth_date && <div>Date de naissance: {profile.birth_date}</div>}
              {honors.length > 0 && <div>Distinctions: {honors.map((h, i) => h?.name || `#${i + 1}`).join(', ')}</div>}
              {patents.length > 0 && <div>Brevets: {patents.map((p, i) => p?.name || `#${i + 1}`).join(', ')}</div>}
            </div>
          </div>
        )}

        {/* JSON brut pour contrôle exhaustif */}
        <div style={{ marginTop: 18 }}>
          <button
            onClick={() => setShowRaw((v) => !v)}
            style={{
              background: '#e9f2fb', color: '#0b5cab', border: '1px solid #cfe3f7', borderRadius: 8,
              padding: '8px 12px', fontSize: 12, cursor: 'pointer'
            }}
          >
            {showRaw ? 'Masquer JSON brut' : 'Afficher JSON brut'}
          </button>
          {showRaw && (
            <div style={{ marginTop: 10, background: '#fff', border: '1px solid #dee2e6', borderRadius: 8, padding: 12, maxHeight: '60vh', overflow: 'auto' }}>
              <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
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
      // reset expansions for new profile
      setShowRaw(false);
      setAboutExpanded(false);
      setExpandedExperiences({});
      setExpandedEducations({});
      setActiveTab('profile');
      setPosts([]);
      setLastActivity(null);
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
          <h2 style={{ color: '#0077b5', marginBottom: 12, textAlign: 'center' }}>📋 Profil LinkedIn</h2>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('profile')} disabled={activeTab==='profile'} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cfe3f7', background: activeTab==='profile' ? '#0b5cab' : '#e9f2fb', color: activeTab==='profile' ? 'white' : '#0b5cab', cursor: activeTab==='profile' ? 'default' : 'pointer' }}>Profil</button>
            <button onClick={async () => {
              setActiveTab('posts');
              if (posts.length === 0) {
                try {
                  const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';
                  const res = await fetch(`${baseUrl}/prospect/posts`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ urn: (typeof fiche.urn === 'string' ? fiche.urn : `${fiche.urn?.type}:${fiche.urn?.value}`), count: 5 })
                  });
                  const data = await res.json();
                  setPosts(Array.isArray(data) ? data : []);
                } catch (e) { console.warn('Posts indisponibles', e); }
              }
            }} disabled={activeTab==='posts'} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cfe3f7', background: activeTab==='posts' ? '#0b5cab' : '#e9f2fb', color: activeTab==='posts' ? 'white' : '#0b5cab', cursor: activeTab==='posts' ? 'default' : 'pointer' }}>Posts</button>
            <button onClick={async () => {
              setActiveTab('activity');
              if (!lastActivity) {
                try {
                  const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';
                  const res = await fetch(`${baseUrl}/prospect/last-activity`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ urn: (typeof fiche.urn === 'string' ? fiche.urn : `${fiche.urn?.type}:${fiche.urn?.value}`), comments_count: 10, reactions_count: 50 })
                  });
                  const data = await res.json();
                  setLastActivity(data);
                } catch (e) { console.warn('Activité indisponible', e); }
              }
            }} disabled={activeTab==='activity'} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cfe3f7', background: activeTab==='activity' ? '#0b5cab' : '#e9f2fb', color: activeTab==='activity' ? 'white' : '#0b5cab', cursor: activeTab==='activity' ? 'default' : 'pointer' }}>Commentaires & Réactions</button>
          </div>

          {activeTab === 'profile' && (
            <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: 12, padding: 18 }}>
              {renderProfile(fiche)}
            </div>
          )}

          {activeTab === 'posts' && (
            <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: 12, padding: 18 }}>
              <h3 style={{ marginTop: 0, color: '#0b5cab' }}>Derniers posts</h3>
              {posts.length === 0 ? (
                <div style={{ color: '#5a6b7b' }}>Aucun post.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {posts.map((post, i) => (
                    <div key={`post-${i}`} style={{ border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 13, color: '#2a3948', whiteSpace: 'pre-wrap' }}>{post?.text || post?.content || 'Post'}</div>
                      <div style={{ marginTop: 6, fontSize: 12, color: '#5a6b7b' }}>{post?.created_at || ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: 12, padding: 18 }}>
              <h3 style={{ marginTop: 0, color: '#0b5cab' }}>Dernier post, commentaires & réactions</h3>
              {!lastActivity ? (
                <div style={{ color: '#5a6b7b' }}>Aucune activité.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontWeight: 700, color: '#0f1d2d' }}>Post</div>
                    <div style={{ fontSize: 13, color: '#2a3948', whiteSpace: 'pre-wrap', marginTop: 6 }}>{lastActivity.post?.text || lastActivity.post?.content || 'Post'}</div>
                  </div>
                  <div style={{ border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontWeight: 700, color: '#0f1d2d' }}>Commentaires</div>
                    {Array.isArray(lastActivity.comments) && lastActivity.comments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                        {lastActivity.comments.map((c, idx) => (
                          <div key={`c-${idx}`} style={{ border: '1px solid #eef2f6', borderRadius: 8, padding: 10 }}>
                            <div style={{ fontSize: 13, color: '#2a3948', whiteSpace: 'pre-wrap' }}>{c?.text || c?.body || ''}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#5a6b7b', marginTop: 6 }}>Aucun commentaire.</div>
                    )}
                  </div>
                  <div style={{ border: '1px solid #e7eef5', background: 'white', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontWeight: 700, color: '#0f1d2d' }}>Réactions</div>
                    {Array.isArray(lastActivity.reactions) && lastActivity.reactions.length > 0 ? (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {lastActivity.reactions.map((r, idx) => (
                          <span key={`r-${idx}`} style={{ border: '1px solid #eef2f6', borderRadius: 999, padding: '6px 10px', fontSize: 12, color: '#3b4a5a' }}>{r?.type || r?.reaction || '👍'}</span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#5a6b7b', marginTop: 6 }}>Aucune réaction.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
