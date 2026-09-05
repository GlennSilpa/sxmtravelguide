import React, { useState } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const CATEGORIES = [
  { id: 'restaurant', label: '🍽️ Restaurant' },
  { id: 'hotel', label: '🏨 Hotel' },
  { id: 'store', label: '🛍️ Store' },
  { id: 'beach', label: '🏖️ Beach' },
  { id: 'taxi', label: '🚕 Taxi' }
];

const SIDES = [
  { id: 'dutch', label: '🇳🇱 Dutch Side' },
  { id: 'french', label: '🇫🇷 French Side' }
];

const emptyForm = {
  name: '', category: 'restaurant', side: 'dutch', location: '',
  phone: '', hours: '', description: '', price: '$',
  cuisine: '', amenities: '', specialty: '', features: '', specs: ''
};

const AddPlace = ({ user, onClose, onAdd }) => {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.description) { alert('Please fill in name, location and description'); return; }
    if (!imageFile) { alert('Please upload an image'); return; }
    setLoading(true);
    try {
      const storageRef = ref(storage, `places/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'pendingPlaces'), { ...form, image: imageUrl, rating: 0, reviews: 0, status: 'pending', submittedBy: user.email, submittedAt: new Date().toISOString(), id: Date.now() });
      setSubmitted(true);
    } catch (e) { alert('Error submitting place: ' + e.message); }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={() => { setSubmitted(false); onClose(); }}>
        <div className="booking-modal" style={{ textAlign: 'center', padding: '40px 24px' }} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem' }}>Submission Received!</h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your place has been submitted for review.</p>
          <button onClick={() => { setSubmitted(false); onClose(); }} style={{ background: '#000', color: 'white', border: 'none', borderRadius: '50px', padding: '12px 32px', fontWeight: '600', cursor: 'pointer' }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => { setSubmitted(false); onClose(); }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>➕ Add a Place</h3>
          <button onClick={() => { setSubmitted(false); onClose(); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Category</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setForm({ ...form, category: cat.id })}
                  style={{ padding: '8px 16px', borderRadius: '50px', border: '2px solid', borderColor: form.category === cat.id ? '#000' : '#e5e7eb', background: form.category === cat.id ? '#000' : 'white', color: form.category === cat.id ? 'white' : '#000', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Side of the Island</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {SIDES.map(side => (
                <button key={side.id} onClick={() => setForm({ ...form, side: side.id })}
                  style={{ padding: '8px 16px', borderRadius: '50px', border: '2px solid', borderColor: form.side === side.id ? '#000' : '#e5e7eb', background: form.side === side.id ? '#000' : 'white', color: form.side === side.id ? 'white' : '#000', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  {side.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Name *</label>
            <input type="text" className="form-input" placeholder={form.category === 'taxi' ? 'e.g. John\'s Taxi Service' : 'Place name'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Location *</label>
            <input type="text" className="form-input" placeholder={form.category === 'taxi' ? 'e.g. Covers all of Sint Maarten' : 'e.g. Simpson Bay'} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" rows={3} placeholder={form.category === 'taxi' ? 'Describe your taxi service...' : 'Describe this place...'} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="form-label">{form.category === 'taxi' ? 'Starting Price' : 'Price Range'}</label>
            {form.category === 'taxi' ? (
              <input type="text" className="form-input" placeholder="e.g. From $10" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {['$', '$$', '$$$', '$$$$', 'Free'].map(p => (
                  <button key={p} onClick={() => setForm({ ...form, price: p })}
                    style={{ padding: '6px 14px', borderRadius: '50px', border: '2px solid', borderColor: form.price === p ? '#000' : '#e5e7eb', background: form.price === p ? '#000' : 'white', color: form.price === p ? 'white' : '#000', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {form.category === 'restaurant' && <div><label className="form-label">Cuisine Type</label><input type="text" className="form-input" placeholder="e.g. French Creole" value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} /></div>}
          {form.category === 'hotel' && <div><label className="form-label">Amenities</label><input type="text" className="form-input" placeholder="e.g. Pool, Spa" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} /></div>}
          {form.category === 'store' && <div><label className="form-label">Specialty</label><input type="text" className="form-input" placeholder="e.g. Jewelry" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} /></div>}
          {form.category === 'beach' && <div><label className="form-label">Features</label><input type="text" className="form-input" placeholder="e.g. Snorkeling" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} /></div>}
          {form.category === 'taxi' && <div><label className="form-label">Service Details</label><input type="text" className="form-input" placeholder="e.g. Airport transfers, island tours, AC" value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} /></div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" placeholder="+1 721-555-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label">{form.category === 'taxi' ? 'Availability' : 'Hours'}</label>
              <input type="text" className="form-input" placeholder={form.category === 'taxi' ? 'e.g. 24/7' : '9:00 AM - 6:00 PM'} value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="form-label">Photo *</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
            {imagePreview && <img src={imagePreview} alt="preview" style={{ marginTop: '10px', width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />}
          </div>

          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>📋 Your submission will be reviewed by an admin before appearing on the site.</p>
          <button onClick={handleSubmit} disabled={loading} className="booking-submit-btn">{loading ? 'Submitting...' : 'Submit for Review'}</button>
        </div>
      </div>
    </div>
  );
};

export default AddPlace;