import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { X, Plus, Trash2, Edit2, Check, Calendar, Upload } from 'lucide-react';
import placesData from '../../data/places';
 
const BANNER_TYPES = [
  { id: 'top', label: 'Top Banner (full-width)' },
  { id: 'card', label: 'Card Banner (between cards)' },
  { id: 'sidebar', label: 'Sidebar Banner' },
  { id: 'popup', label: 'Popup Banner' }
];
 
const emptyBannerForm = {
  type: 'top', title: '', text: '', buttonLabel: '', buttonLink: '',
  image: '', active: true, startDate: '', endDate: ''
};
 
const getDaysRemaining = (endDate) => {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
};
 
const ExpiryBadge = ({ endDate }) => {
  const days = getDaysRemaining(endDate);
  if (days === null) return null;
  if (days < 0) return <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '700' }}>● EXPIRED</span>;
  if (days === 0) return <span style={{ color: '#f97316', fontSize: '11px', fontWeight: '700' }}>● EXPIRES TODAY</span>;
  if (days <= 3) return <span style={{ color: '#f97316', fontSize: '11px', fontWeight: '700' }}>● {days}d left</span>;
  return <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '700' }}>● {days}d left</span>;
};
 
const AdminPanel = ({ onClose, onImportDone }) => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [banners, setBanners] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [pendingEdits, setPendingEdits] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const [bannerForm, setBannerForm] = useState(emptyBannerForm);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerTab, setBannerTab] = useState('list');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
 
  useEffect(() => { fetchAll(); }, []);
 
  const fetchAll = async () => {
    await Promise.all([fetchBanners(), fetchSubmissions(), fetchPendingEdits(), fetchPendingDeletes(), checkImportStatus()]);
  };
 
  const checkImportStatus = async () => {
    const snap = await getDocs(collection(db, 'approvedPlaces'));
    if (snap.docs.length >= placesData.length) setImportDone(true);
  };
 
  const fetchBanners = async () => {
    const snap = await getDocs(collection(db, 'banners'));
    const fetched = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (const banner of fetched) {
      if (banner.endDate && banner.active) {
        const end = new Date(banner.endDate); end.setHours(0, 0, 0, 0);
        if (end < today) { await updateDoc(doc(db, 'banners', banner.id), { active: false }); banner.active = false; }
      }
    }
    setBanners(fetched);
  };
 
  const fetchSubmissions = async () => {
    const snap = await getDocs(collection(db, 'pendingPlaces'));
    setSubmissions(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
  };
 
  const fetchPendingEdits = async () => {
    const snap = await getDocs(collection(db, 'pendingEdits'));
    setPendingEdits(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
  };
 
  const fetchPendingDeletes = async () => {
    const snap = await getDocs(collection(db, 'pendingDeletes'));
    setPendingDeletes(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
  };
 
  const handleImportPlaces = async () => {
    if (!confirm(`This will import all ${placesData.length} built-in places into Firestore. Do this only once. Continue?`)) return;
    setImporting(true);
    try {
      for (const place of placesData) {
        await addDoc(collection(db, 'approvedPlaces'), {
          ...place,
          status: 'approved',
          submittedBy: 'system',
          importedAt: new Date().toISOString()
        });
      }
      setImportDone(true);
      onImportDone();
      alert(`✅ Successfully imported ${placesData.length} places to Firestore!`);
    } catch (e) {
      alert('Error importing: ' + e.message);
    }
    setImporting(false);
  };
 
  const handleApprove = async (submission) => {
    try {
      await addDoc(collection(db, 'approvedPlaces'), { ...submission, status: 'approved', approvedAt: new Date().toISOString() });
      await deleteDoc(doc(db, 'pendingPlaces', submission.docId));
      await fetchSubmissions();
      alert(`✅ "${submission.name}" approved and is now live!`);
    } catch (e) { alert('Error: ' + e.message); }
  };
 
  const handleReject = async (submission) => {
    if (!confirm(`Reject "${submission.name}"?`)) return;
    await deleteDoc(doc(db, 'pendingPlaces', submission.docId));
    await fetchSubmissions();
  };
 
  const handleApproveEdit = async (edit) => {
    try {
      await updateDoc(doc(db, edit.originalCollection || 'approvedPlaces', edit.originalId), {
        name: edit.name, category: edit.category, side: edit.side,
        location: edit.location, phone: edit.phone, hours: edit.hours,
        description: edit.description, price: edit.price, image: edit.image,
        cuisine: edit.cuisine, amenities: edit.amenities,
        specialty: edit.specialty, features: edit.features,
        updatedAt: new Date().toISOString()
      });
      await deleteDoc(doc(db, 'pendingEdits', edit.docId));
      await fetchPendingEdits();
      alert(`✅ Edit for "${edit.name}" approved!`);
    } catch (e) { alert('Error: ' + e.message); }
  };
 
  const handleRejectEdit = async (edit) => {
    if (!confirm(`Reject edit for "${edit.name}"?`)) return;
    await deleteDoc(doc(db, 'pendingEdits', edit.docId));
    await fetchPendingEdits();
  };
 
  const handleApproveDelete = async (request) => {
    try {
      await deleteDoc(doc(db, 'approvedPlaces', request.placeId));
      await deleteDoc(doc(db, 'pendingDeletes', request.docId));
      await fetchPendingDeletes();
      alert(`✅ "${request.placeName}" has been deleted.`);
    } catch (e) { alert('Error: ' + e.message); }
  };
 
  const handleRejectDelete = async (request) => {
    if (!confirm(`Reject delete request for "${request.placeName}"?`)) return;
    await deleteDoc(doc(db, 'pendingDeletes', request.docId));
    await fetchPendingDeletes();
  };
 
  const handleImageUpload = async () => {
    if (!imageFile) return bannerForm.image;
    const storageRef = ref(storage, `banners/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };
 
  const handleBannerSubmit = async () => {
    if (!bannerForm.title) { alert('Title is required'); return; }
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload();
      let isActive = bannerForm.active;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (bannerForm.startDate) { const s = new Date(bannerForm.startDate); s.setHours(0,0,0,0); if (s > today) isActive = false; }
      if (bannerForm.endDate) { const e = new Date(bannerForm.endDate); e.setHours(0,0,0,0); if (e < today) isActive = false; }
      const data = { ...bannerForm, image: imageUrl, active: isActive };
      if (editingBannerId) { await updateDoc(doc(db, 'banners', editingBannerId), data); }
      else { await addDoc(collection(db, 'banners'), data); }
      setBannerForm(emptyBannerForm); setEditingBannerId(null); setImageFile(null); setBannerTab('list');
      await fetchBanners();
    } catch (e) { alert('Error saving banner: ' + e.message); }
    setLoading(false);
  };
 
  const today = new Date().toISOString().split('T')[0];
  const totalPending = submissions.length + pendingEdits.length + pendingDeletes.length;
 
  const TABS = [
    { id: 'submissions', label: `📋 New${submissions.length > 0 ? ` (${submissions.length})` : ''}` },
    { id: 'edits', label: `✏️ Edits${pendingEdits.length > 0 ? ` (${pendingEdits.length})` : ''}` },
    { id: 'deletes', label: `🗑️ Deletes${pendingDeletes.length > 0 ? ` (${pendingDeletes.length})` : ''}` },
    { id: 'banners', label: '🎯 Banners' },
    { id: 'import', label: '📦 Import' }
  ];
 
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
 
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>⚙️ Admin Panel</h2>
            {totalPending > 0 && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#ef4444' }}>{totalPending} item{totalPending > 1 ? 's' : ''} need your attention</p>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
 
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, padding: '12px 8px', background: 'none', border: 'none', whiteSpace: 'nowrap',
              borderBottom: activeTab === t.id ? '3px solid #000' : '3px solid transparent',
              fontWeight: '600', cursor: 'pointer', fontSize: '13px', minWidth: '70px'
            }}>{t.label}</button>
          ))}
        </div>
 
        <div style={{ padding: '24px' }}>
 
          {/* IMPORT TAB */}
          {activeTab === 'import' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
              <h3 style={{ margin: '0 0 12px' }}>Import Built-in Places to Firestore</h3>
              <p style={{ color: '#6b7280', marginBottom: '8px', maxWidth: '400px', margin: '0 auto 16px' }}>
                This imports all {placesData.length} built-in places into Firestore so they can be edited and deleted from the admin panel. <strong>Do this only once.</strong>
              </p>
              {importDone ? (
                <div style={{ background: '#dcfce7', borderRadius: '10px', padding: '16px', color: '#166534', fontWeight: '600' }}>
                  ✅ All places have already been imported to Firestore!
                </div>
              ) : (
                <button onClick={handleImportPlaces} disabled={importing}
                  style={{ background: '#000', color: 'white', border: 'none', borderRadius: '10px', padding: '14px 32px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} />
                  {importing ? `Importing...` : `Import ${placesData.length} Places`}
                </button>
              )}
            </div>
          )}
 
          {/* SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {submissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem' }}>🎉</div><p>No pending submissions!</p>
                </div>
              ) : submissions.map(sub => (
                <div key={sub.docId} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex' }}>
                    {sub.image && <img src={sub.image} alt={sub.name} style={{ width: '110px', height: '110px', objectFit: 'cover', flexShrink: 0 }} />}
                    <div style={{ padding: '12px', flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px' }}>{sub.name}</h4>
                      <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#6b7280' }}>{sub.category} • {sub.side === 'dutch' ? '🇳🇱' : '🇫🇷'} {sub.location}</p>
                      <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#6b7280' }}>By: {sub.submittedBy}</p>
                      <p style={{ margin: '0 0 10px', fontSize: '13px' }}>{sub.description?.substring(0, 80)}...</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApprove(sub)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>✅ Approve</button>
                        <button onClick={() => handleReject(sub)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>❌ Reject</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
 
          {/* PENDING EDITS */}
          {activeTab === 'edits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingEdits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem' }}>✏️</div><p>No pending edits!</p>
                </div>
              ) : pendingEdits.map(edit => (
                <div key={edit.docId} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex' }}>
                    {edit.image && <img src={edit.image} alt={edit.name} style={{ width: '110px', height: '110px', objectFit: 'cover', flexShrink: 0 }} />}
                    <div style={{ padding: '12px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0 }}>{edit.name}</h4>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>EDIT</span>
                      </div>
                      <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#6b7280' }}>{edit.category} • {edit.side === 'dutch' ? '🇳🇱' : '🇫🇷'} {edit.location}</p>
                      <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#6b7280' }}>By: {edit.submittedBy}</p>
                      <p style={{ margin: '0 0 10px', fontSize: '13px' }}>{edit.description?.substring(0, 80)}...</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApproveEdit(edit)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>✅ Approve</button>
                        <button onClick={() => handleRejectEdit(edit)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>❌ Reject</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
 
          {/* PENDING DELETES */}
          {activeTab === 'deletes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingDeletes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem' }}>🗑️</div><p>No delete requests!</p>
                </div>
              ) : pendingDeletes.map(request => (
                <div key={request.docId} style={{ border: '1px solid #fee2e2', borderRadius: '12px', padding: '16px', background: '#fff5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0 }}>{request.placeName}</h4>
                    <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>DELETE REQUEST</span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>By: {request.submittedBy}</p>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#6b7280' }}>{new Date(request.requestedAt).toLocaleDateString()}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleApproveDelete(request)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>✅ Approve Delete</button>
                    <button onClick={() => handleRejectDelete(request)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>❌ Keep Listing</button>
                  </div>
                </div>
              ))}
            </div>
          )}
 
          {/* BANNERS */}
          {activeTab === 'banners' && (
            <>
              <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                {['list', 'form'].map(t => (
                  <button key={t} onClick={() => { setBannerTab(t); if (t === 'form' && !editingBannerId) setBannerForm(emptyBannerForm); }}
                    style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: bannerTab === t ? '3px solid #000' : '3px solid transparent', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                    {t === 'list' ? '📋 All Banners' : editingBannerId ? '✏️ Edit Banner' : '➕ New Banner'}
                  </button>
                ))}
              </div>
 
              {bannerTab === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {banners.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>No banners yet.</p>}
                  {banners.map(banner => (
                    <div key={banner.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
                      {banner.image && <img src={banner.image} alt={banner.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{banner.title}</p>
                        <p style={{ margin: '2px 0', fontSize: '12px', color: '#6b7280' }}>
                          {BANNER_TYPES.find(t => t.id === banner.type)?.label} • <span style={{ color: banner.active ? '#10b981' : '#ef4444' }}>{banner.active ? 'Active' : 'Inactive'}</span>
                        </p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '2px' }}>
                          {banner.startDate && <span style={{ fontSize: '11px', color: '#6b7280' }}>📅 {new Date(banner.startDate).toLocaleDateString()}</span>}
                          {banner.endDate && <span style={{ fontSize: '11px', color: '#6b7280' }}>→ {new Date(banner.endDate).toLocaleDateString()}</span>}
                          <ExpiryBadge endDate={banner.endDate} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={async () => { await updateDoc(doc(db, 'banners', banner.id), { active: !banner.active }); fetchBanners(); }}
                          style={{ background: banner.active ? '#dcfce7' : '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}>
                          <Check size={16} color={banner.active ? '#10b981' : '#ef4444'} />
                        </button>
                        <button onClick={() => { setBannerForm(banner); setEditingBannerId(banner.id); setBannerTab('form'); }}
                          style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={async () => { if (!confirm('Delete?')) return; await deleteDoc(doc(db, 'banners', banner.id)); fetchBanners(); }}
                          style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}>
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { setBannerForm(emptyBannerForm); setEditingBannerId(null); setBannerTab('form'); }}
                    style={{ marginTop: '8px', background: '#000', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Plus size={18} /> Add New Banner
                  </button>
                </div>
              )}
 
              {bannerTab === 'form' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Banner Type</label>
                    <select value={bannerForm.type} onChange={e => setBannerForm({ ...bannerForm, type: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}>
                      {BANNER_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Title *</label>
                    <input type="text" value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Banner title"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Text</label>
                    <textarea value={bannerForm.text} onChange={e => setBannerForm({ ...bannerForm, text: e.target.value })} placeholder="Banner description" rows={3}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Button Label</label>
                      <input type="text" value={bannerForm.buttonLabel} onChange={e => setBannerForm({ ...bannerForm, buttonLabel: e.target.value })} placeholder="e.g. Learn More"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Button Link</label>
                      <input type="text" value={bannerForm.buttonLink} onChange={e => setBannerForm({ ...bannerForm, buttonLink: e.target.value })} placeholder="https://..."
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Calendar size={18} /><span style={{ fontWeight: '600', fontSize: '14px' }}>Schedule</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Start Date</label>
                        <input type="date" value={bannerForm.startDate} min={today} onChange={e => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>End Date</label>
                        <input type="date" value={bannerForm.endDate} min={bannerForm.startDate || today} onChange={e => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    {bannerForm.endDate && (
                      <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#6b7280' }}>
                        ⏱ Auto-deactivates on {new Date(bannerForm.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Image</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                    {bannerForm.image && !imageFile && (
                      <img src={bannerForm.image} alt="current" style={{ marginTop: '8px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="active" checked={bannerForm.active} onChange={e => setBannerForm({ ...bannerForm, active: e.target.checked })} />
                    <label htmlFor="active" style={{ fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Active (show on site)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={handleBannerSubmit} disabled={loading}
                      style={{ flex: 1, background: '#000', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
                      {loading ? 'Saving...' : editingBannerId ? 'Update Banner' : 'Create Banner'}
                    </button>
                    <button onClick={() => { setBannerForm(emptyBannerForm); setEditingBannerId(null); setBannerTab('list'); }}
                      style={{ background: '#f3f4f6', border: 'none', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontWeight: '600' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default AdminPanel;