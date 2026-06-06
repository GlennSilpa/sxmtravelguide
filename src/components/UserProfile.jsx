import React, { useState, useEffect } from 'react';
import { X, Heart, MapPin, Star } from 'lucide-react';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const UserProfile = ({ user, onClose, onSelectPlace }) => {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [myPlaces, setMyPlaces] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Fetch user profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile(data);

        // Fetch favorited places
        if (data.favorites?.length > 0) {
          const snap = await getDocs(collection(db, 'approvedPlaces'));
          const all = snap.docs.map(d => ({ ...d.data(), docId: d.id }));
          setFavorites(all.filter(p => data.favorites.includes(p.docId)));
        }
      }

      // Fetch user's submitted places
      const pendingSnap = await getDocs(collection(db, 'pendingPlaces'));
      const approvedSnap = await getDocs(collection(db, 'approvedPlaces'));

      const pending = pendingSnap.docs
        .map(d => ({ ...d.data(), docId: d.id, status: 'pending' }))
        .filter(p => p.submittedBy === user.email);

      const approved = approvedSnap.docs
        .map(d => ({ ...d.data(), docId: d.id, status: 'approved' }))
        .filter(p => p.submittedBy === user.email);

      setMyPlaces([...pending, ...approved]);
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
    setLoading(false);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: { background: '#fef3c7', color: '#d97706', label: '⏳ Pending' },
      approved: { background: '#dcfce7', color: '#16a34a', label: '✅ Live' }
    };
    const s = styles[status] || styles.pending;
    return (
      <span style={{ background: s.background, color: s.color, fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px' }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '700' }}>
              {(profile?.displayName || user.email)[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{profile?.displayName || user.email.split('@')[0]}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>{myPlaces.length}</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>Places Submitted</p>
          </div>
          <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>{favorites.length}</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>Saved Places</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { id: 'favorites', label: `❤️ Saved (${favorites.length})` },
            { id: 'places', label: `📍 My Places (${myPlaces.length})` }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, padding: '12px', background: 'none', border: 'none',
              borderBottom: activeTab === t.id ? '3px solid #000' : '3px solid transparent',
              fontWeight: '600', cursor: 'pointer', fontSize: '14px'
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '20px 24px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>Loading...</p>
          ) : (

            // FAVORITES TAB
            activeTab === 'favorites' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {favorites.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❤️</div>
                    <p style={{ margin: 0, fontWeight: '600' }}>No saved places yet</p>
                    <p style={{ margin: '8px 0 0', fontSize: '14px' }}>Tap the heart on any place to save it</p>
                  </div>
                ) : favorites.map(place => (
                  <div key={place.docId}
                    onClick={() => { onSelectPlace(place); onClose(); }}
                    style={{ display: 'flex', gap: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                    {place.image && <img src={place.image} alt={place.name} style={{ width: '90px', height: '90px', objectFit: 'cover', flexShrink: 0 }} />}
                    <div style={{ padding: '12px', flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>{place.name}</h4>
                      <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {place.location}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>{place.rating}</span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>• {place.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* MY PLACES TAB */}
          {!loading && activeTab === 'places' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myPlaces.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
                  <p style={{ margin: 0, fontWeight: '600' }}>No submissions yet</p>
                  <p style={{ margin: '8px 0 0', fontSize: '14px' }}>Use Add Place to contribute!</p>
                </div>
              ) : myPlaces.map(place => (
                <div key={place.docId} style={{ display: 'flex', gap: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  {place.image && <img src={place.image} alt={place.name} style={{ width: '90px', height: '90px', objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ padding: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px' }}>{place.name}</h4>
                      <StatusBadge status={place.status} />
                    </div>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#6b7280' }}>{place.category} • {place.location}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#374151' }}>{place.description?.substring(0, 60)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;