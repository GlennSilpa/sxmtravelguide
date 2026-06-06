import React from 'react';
 
const CardBanner = ({ banner }) => {
  if (!banner || !banner.active) return null;
 
  return (
    <div style={{
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      position: 'relative',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      border: '2px solid #34e0a1'
    }}>
      {banner.image && (
        <img
          src={banner.image}
          alt={banner.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.5
          }}
        />
      )}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '16px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
      }}>
        <span style={{
          background: '#34e0a1',
          color: '#000',
          fontSize: '11px',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '4px',
          marginBottom: '8px',
          display: 'inline-block'
        }}>
          SPONSORED
        </span>
        {banner.title && (
          <h3 style={{ color: 'white', margin: '4px 0', fontSize: '1.1rem' }}>
            {banner.title}
          </h3>
        )}
        {banner.text && (
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: '4px 0', fontSize: '0.85rem' }}>
            {banner.text}
          </p>
        )}
        {banner.buttonLabel && banner.buttonLink && (
          <a
            href={banner.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              background: '#34e0a1',
              color: '#000',
              padding: '6px 20px',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '13px'
            }}
          >
            {banner.buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
};
 
export default CardBanner;