import React, { useState } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const CATEGORIES = [
  { id: 'restaurant', label: '🍽️ Restaurant' },
  { id: 'hotel', label: '🏨 Hotel' },
  { id: 'store', label: '🛍️ Store' },
  { id: 'beach', label: '🏖️ Beach' }
];

const SIDES = [
  { id: 'dutch', label: '🇳🇱 Dutch Side' },
  { id: 'french', label: '🇫🇷 French Side' }
];

const EditPlace = ({ user, place, onClose }) => {
  const [form, setForm] = useState({
    name: place.name || '',
    category: place.category || 'restaurant',
    side: place.side || 'dutch',
    location: place.location || '',
    phone: place.phone || '',
    hours: place.hours || '',
    description: place.description || '',
    price: place.price || '$',
    cuisine: place.cuisine || '',
    amenities: place.amenities || '',
    specialty: place.specialty || '',
    features: place.features || '',
    image: place.image || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(place.image || null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.description) {
      alert('Please fill in name, location and description');
      return;
    }
    setLoading(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        const storageRef = ref(storage, `places/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (place.status === 'pending') {
        // For pending places, just update directly in pendingPlaces
        await updateDoc(doc(db, 'pendingPlaces', place.docId), {
          ...form,
          image: imageUrl,
          updatedAt: new Date().toISOString()
        });
      } else {
        // For approved places, create a pending edit
        await addDoc(collection(db, 'pendingEdits'), {
          ...form,
          image: imageUrl,
          originalId: place.docId,
          originalCollection: place.collection || 'approvedPlaces',
          submittedBy: user.email,
          submittedAt: new Date().toISOString(),
          status: 'pending_edit'
        });
      }
      setSubmitted(true);
    } catch (e) {
      alert('Error submitting edit: ' + e.message);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="modal-overlay">
        <div className="booking-modal" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✏️</div>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem' }}>Edit Submitted!</h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {place.status === 'pending'
              ? 'Your changes have been saved and are awaiting approval.'
              : 'Your edit has been submitted for admin review. The current listing stays live until approved.'}
          </p>
          <button onClick={onClose} style={{
            background: '#000', color: 'white', border: 'none',
            borderRadius: '50px', padding: '12px 32px', fontWeight: '600', cursor: 'pointer'
          }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
          position: 'sticky', top: 0, background: 'white', zIndex: 1
        }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>✏️ Edit Place</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {place.status === 'approved' && (
            <div style={{
              background: '#e0f2fe', borderRadius: '8px', padding: '12px',
              fontSize: '13px', color: '#0369a1'
            }}>
              ℹ️ Your current listing stays live while your edit is reviewed by an admin.
            </div>
          )}

          {/* Category */}
          <div>
            <label className="form-label">Category</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setForm({ ...form, category: cat.id })}
                  style={{
                    padding: '8px 16px', borderRadius: '50px', border: '2px solid',
                    borderColor: form.category === cat.id ? '#000' : '#e5e7eb',
                    background: form.category === cat.id ? '#000' : 'white',
                    color: form.category === cat.id ? 'white' : '#000',
                    cursor: 'pointer', fontWeight: '600', fontSize: '13px'
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Side */}
          <div>
            <label className="form-label">Side of the Island</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {SIDES.map(side => (
                <button key={side.id} onClick={() => setForm({ ...form, side: side.id })}
                  style={{
                    padding: '8px 16px', borderRadius: '50px', border: '2px solid',
                    borderColor: form.side === side.id ? '#000' : '#e5e7eb',
                    background: form.side === side.id ? '#000' : 'white',
                    color: form.side === side.id ? 'white' : '#000',
                    cursor: 'pointer', fontWeight: '600', fontSize: '13px'
                  }}>
                  {side.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Name *</label>
            <input type="text" className="form-input" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Location *</label>
            <input type="text" className="form-input" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Price Range</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {['$', '$$', '$$$', '$$$$', 'Free'].map(p => (
                <button key={p} onClick={() => setForm({ ...form, price: p })}
                  style={{
                    padding: '6px 14px', borderRadius: '50px', border: '2px solid',
                    borderColor: form.price === p ? '#000' : '#e5e7eb',
                    background: form.price === p ? '#000' : 'white',
                    color: form.price === p ? 'white' : '#000',
                    cursor: 'pointer', fontWeight: '600', fontSize: '13px'
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {form.category === 'restaurant' && (
            <div>
              <label className="form-label">Cuisine Type</label>
              <input type="text" className="form-input" value={form.cuisine}
                onChange={e => setForm({ ...form, cuisine: e.target.value })} />
            </div>
          )}
          {form.category === 'hotel' && (
            <div>
              <label className="form-label">Amenities</label>
              <input type="text" className="form-input" value={form.amenities}
                onChange={e => setForm({ ...form, amenities: e.target.value })} />
            </div>
          )}
          {form.category === 'store' && (
            <div>
              <label className="form-label">Specialty</label>
              <input type="text" className="form-input" value={form.specialty}
                onChange={e => setForm({ ...form, specialty: e.target.value })} />
            </div>
          )}
          {form.category === 'beach' && (
            <div>
              <label className="form-label">Features</label>
              <input type="text" className="form-input" value={form.features}
                onChange={e => setForm({ ...form, features: e.target.value })} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Hours</label>
              <input type="text" className="form-input" value={form.hours}
                onChange={e => setForm({ ...form, hours: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="form-label">Photo</label>
            {imagePreview && (
              <img src={imagePreview} alt="preview"
                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading} className="booking-submit-btn">
            {loading ? 'Submitting...' : 'Submit Edit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlace;