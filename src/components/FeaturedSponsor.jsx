import React from 'react';
import { Star, MapPin, Phone, Clock, Utensils, Hotel, ShoppingBag, Car } from 'lucide-react';

const FeaturedSponsor = ({ place, onSelect }) => {
  if (!place) return null;

  return (
    <div
      onClick={() => onSelect(place)}
      className="featured-sponsor-card"
      style={{
        gridColumn: '1 / -1',
        background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
        border: '2px solid #f59e0b',
        borderRadius: '20px',
        padding: '24px',
        cursor: 'pointer',
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(245,158,11,0.15)',
        transition: 'all 0.2s',
        marginBottom: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Gold top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)' }} />

      {/* Image */}
      <div className="featured-sponsor-image" style={{ width: '200px', height: '140px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
        <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', color: 'white', fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            ⭐ Featured Sponsor
          </span>
          <span style={{ background: 'white', color: '#374151', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
            {place.price}
          </span>
        </div>

        <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: '800', color: '#1f2937' }}>
          {place.name}
        </h2>

        <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>
          {place.description}
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star style={{ fill: '#fbbf24', color: '#fbbf24' }} size={16} />
            <span style={{ fontWeight: '700', fontSize: '14px' }}>{place.rating}</span>
            <span style={{ color: '#6b7280', fontSize: '13px' }}>({place.reviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '13px' }}>
            <MapPin size={14} color="#3b82f6" />
            <span>{place.location}</span>
          </div>
          {place.phone && place.phone !== 'N/A' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '13px' }}>
              <Phone size={14} color="#10b981" />
              <span>{place.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="featured-sponsor-cta" style={{ flexShrink: 0 }}>
        <button
          onClick={e => e.stopPropagation()}
          style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', color: 'white', border: 'none', borderRadius: '50px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}
        >
          {place.category === 'hotel' ? 'Book Now'
            : place.category === 'restaurant' ? 'Reserve Table'
            : place.category === 'car' ? 'Rent Now'
            : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default FeaturedSponsor;