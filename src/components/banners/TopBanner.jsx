import React from 'react';
 
const TopBanner = ({ banner }) => {
  if (!banner || !banner.active) return null;
 
  return (
    <div style={{
      width: '100%',
      background: '#000',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
            opacity: 0.4
          }}
        />
      )}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: '24px 16px'
      }}>
        {banner.title && (
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 8px' }}>
            {banner.title}
          </h2>
        )}
        {banner.text && (
          <p style={{ fontSize: '1rem', margin: '0 0 16px', opacity: 0.9 }}>
            {banner.text}
          </p>
        )}
        {banner.buttonLabel && banner.buttonLink && (
          <a
            href={banner.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#34e0a1',
              color: '#000',
              padding: '10px 28px',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '15px'
            }}
          >
            {banner.buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
};
 
export default TopBanner;