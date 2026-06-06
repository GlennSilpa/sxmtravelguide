import React, { useState } from 'react';
import { Star, MapPin, Utensils, Hotel, ShoppingBag, Car, Edit2, Trash2, Crown } from 'lucide-react';

const PlaceCard = ({ place, onSelect, onBook, isAdmin, onAdminEdit, onAdminDelete, onAdminFeature, isFeatured }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="place-card"
      onClick={() => onSelect(place)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <div className="place-card-image">
        <img src={place.image} alt={place.name} />
        <div className="place-card-price">{place.price}</div>
        {isFeatured && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: 'linear-gradient(90deg, #f59e0b, #d97706)',
            color: 'white', fontSize: '11px', fontWeight: '800',
            padding: '3px 10px', borderRadius: '20px'
          }}>
            ⭐ Featured
          </div>
        )}
      </div>

      <div className="place-card-content">
        <div className="place-card-header">
          <h3>{place.name}</h3>
          {place.category === 'restaurant' && <Utensils style={{ color: '#f97316' }} size={20} />}
          {place.category === 'hotel' && <Hotel style={{ color: '#3b82f6' }} size={20} />}
          {place.category === 'store' && <ShoppingBag style={{ color: '#a855f7' }} size={20} />}
          {place.category === 'beach' && <span style={{ fontSize: '24px' }}>🏖️</span>}
          {place.category === 'car' && <Car style={{ color: '#10b981' }} size={20} />}
        </div>

        <div className="place-card-rating">
          <div className="rating-badge">
            <Star style={{ fill: '#fbbf24', color: '#fbbf24' }} size={16} />
            <span>{place.rating}</span>
          </div>
          <span className="reviews-count">({place.reviews} reviews)</span>
        </div>

        <div className="place-card-location">
          <MapPin style={{ color: '#3b82f6' }} size={16} />
          <span>{place.location}</span>
        </div>

        {place.cuisine && <p className="place-card-info">{place.cuisine}</p>}
        {place.amenities && <p className="place-card-info">{place.amenities}</p>}
        {place.specialty && <p className="place-card-info">{place.specialty}</p>}
        {place.features && <p className="place-card-info">🏖️ {place.features}</p>}
        {place.specs && <p className="place-card-info">🚗 {place.specs}</p>}

        <button
          className="place-card-btn"
          onClick={(e) => { e.stopPropagation(); onBook(place); }}
        >
          {place.category === 'hotel' ? 'Book Room'
            : place.category === 'restaurant' ? 'Reserve Table'
            : place.category === 'beach' ? 'View Details'
            : place.category === 'car' ? 'Rent Now'
            : 'Visit Store'}
        </button>
      </div>

      {/* Admin hover controls */}
      {isAdmin && hovered && (
        <div
          style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 10 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onAdminFeature(place)}
            title={isFeatured ? 'Remove Featured' : 'Set as Featured'}
            style={{
              background: isFeatured ? '#fef3c7' : 'white',
              border: `1px solid ${isFeatured ? '#f59e0b' : '#e5e7eb'}`,
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
            <Crown size={16} color={isFeatured ? '#f59e0b' : '#374151'} />
          </button>
          <button onClick={() => onAdminEdit(place)} title="Edit"
            style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Edit2 size={16} color="#374151" />
          </button>
          <button onClick={() => onAdminDelete(place)} title="Delete"
            style={{ background: '#ef4444', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Trash2 size={16} color="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceCard;