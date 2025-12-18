import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddPlace = ({ user, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant',
    side: 'dutch',
    location: '',
    price: '$$',
    phone: '',
    hours: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    cuisine: '',
    amenities: '',
    specialty: '',
    features: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.description) {
      alert('Please fill in required fields: Name, Location, Description');
      return;
    }

    const newPlace = {
      ...formData,
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      userId: user.id,
      userEmail: user.email,
      createdAt: new Date().toISOString()
    };

    onAdd(newPlace);
    alert('Place added successfully! 🎉');
    onClose();
  };

  return (
    <div className="modal-overlay" style={{overflowY: 'auto'}}>
      <div className="modal-content" style={{margin: '20px auto', maxWidth: '600px'}}>
        <div style={{
          position: 'relative',
          padding: '24px',
          background: 'linear-gradient(90deg, #2563eb 0%, #0891b2 100%)',
          borderRadius: '16px 16px 0 0'
        }}>
          <h2 style={{color: 'white', margin: 0, fontSize: '1.5rem'}}>✨ Add New Place</h2>
          <p style={{color: '#bfdbfe', marginTop: '4px', fontSize: '14px'}}>Share your favorite spot in SXM!</p>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'white',
              borderRadius: '50%',
              padding: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="booking-form">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Business/Beach name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="restaurant">🍽️ Restaurant</option>
                <option value="hotel">🏨 Hotel</option>
                <option value="store">🏪 Store</option>
                <option value="beach">🏖️ Beach</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Side *</label>
              <select
                className="form-input"
                value={formData.side}
                onChange={(e) => setFormData({...formData, side: e.target.value})}
              >
                <option value="dutch">🇳🇱 Dutch Side</option>
                <option value="french">🇫🇷 French Side</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                className="form-input"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Maho Beach, Philipsburg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price Range</label>
              <select
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              >
                <option value="Free">Free</option>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
                <option value="$$$$">$$$$ (Luxury)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 721-555-0000 or N/A"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hours</label>
              <input
                className="form-input"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                placeholder="e.g., 9:00 AM - 10:00 PM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL (optional)</label>
              <input
                className="form-input"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
              <p style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>
                💡 Tip: Right-click any image online → Copy image address
              </p>
            </div>

            {formData.category === 'restaurant' && (
              <div className="form-group">
                <label className="form-label">Cuisine</label>
                <input
                  className="form-input"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
                  placeholder="e.g., Caribbean Fusion, Italian"
                />
              </div>
            )}

            {formData.category === 'hotel' && (
              <div className="form-group">
                <label className="form-label">Amenities</label>
                <input
                  className="form-input"
                  value={formData.amenities}
                  onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                  placeholder="e.g., Pool, Spa, Beach Access"
                />
              </div>
            )}

            {formData.category === 'store' && (
              <div className="form-group">
                <label className="form-label">Specialty</label>
                <input
                  className="form-input"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  placeholder="e.g., Local Crafts & Spices"
                />
              </div>
            )}

            {formData.category === 'beach' && (
              <div className="form-group">
                <label className="form-label">Features</label>
                <input
                  className="form-input"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="e.g., Snorkeling, Beach Bars, Calm Waters"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe this place... What makes it special?"
              />
            </div>

            <button onClick={handleSubmit} className="booking-submit-btn">
              ✨ Add Place
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlace;