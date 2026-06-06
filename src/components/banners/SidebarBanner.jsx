import React from 'react';
 
const SidebarBanner = ({ banners }) => {
  const active = (banners || []).filter(b => b.active);
  if (active.length === 0) return null;
 
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '260px',
      flexShrink: 0
    }}>
      {active.map(banner => (
        <div
          key={banner.id}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}
        >
          {banner.image && (
            <img
              src={banner.image}
              alt={banner.title}
              style={{ width: '100%', height: '140px', objectFit: 'cover' }}
            />
          )}
          <div style={{ padding: '12px' }}>
            <span style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px',
              marginBottom: '6px',
              display: 'inline-block'
            }}>
              SPONSORED
            </span>
            {banner.title && (
              <h4 style={{ margin: '4px 0', fontSize: '0.95rem', fontWeight: '600' }}>
                {banner.title}
              </h4>
            )}
            {banner.text && (
              <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#6b7280' }}>
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
                  background: '#000',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '50px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '12px'
                }}
              >
                {banner.buttonLabel}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
 
export default SidebarBanner;