import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PopupBanner = ({ banner }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (banner && banner.active) {
      const dismissed = sessionStorage.getItem('popupDismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [banner]);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem('popupDismissed', 'true');
  };

  if (!visible || !banner || !banner.active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1,
            color: 'white'
          }}
        >
          <X size={18} />
        </button>

        {banner.image && (
          <img
            src={banner.image}
            alt={banner.title}
            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
          />
        )}

        <div style={{ padding: '24px' }}>
          <span style={{
            background: '#34e0a1',
            color: '#000',
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '4px',
            marginBottom: '10px',
            display: 'inline-block'
          }}>
            SPONSORED
          </span>
          {banner.title && (
            <h2 style={{ margin: '8px 0', fontSize: '1.4rem', fontWeight: 'bold' }}>
              {banner.title}
            </h2>
          )}
          {banner.text && (
            <p style={{ color: '#6b7280', margin: '8px 0 16px', lineHeight: 1.5 }}>
              {banner.text}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            {banner.buttonLabel && banner.buttonLink && (
              <a
                href={banner.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#34e0a1',
                  color: '#000',
                  padding: '10px 24px',
                  borderRadius: '50px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                {banner.buttonLabel}
              </a>
            )}
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: '1px solid #e5e7eb',
                padding: '10px 24px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#6b7280'
              }}
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupBanner;
 