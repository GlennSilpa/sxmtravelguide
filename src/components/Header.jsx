import React, { useState } from 'react';
import { Plus, Settings, MapPin, Megaphone, User, Menu, X } from 'lucide-react';

const Header = ({ user, isAdmin, onShowAuth, onShowAddPlace, onShowAdmin, onShowMyPlaces, onShowProfile, onShowAdvertise, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: 'white', padding: '16px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000', margin: 0 }}>
          🏝️ Cheap People
        </h1>

        {/* Desktop buttons */}
        <div className="header-desktop-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={onShowAdvertise} style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)', color: 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Megaphone size={15} /> Advertise
          </button>
          {user ? (
            <>
              {isAdmin && (
                <button onClick={onShowAdmin} style={{ background: '#7c3aed', color: 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Settings size={16} /> Admin
                </button>
              )}
              <button onClick={onShowProfile} style={{ background: '#f3f4f6', color: '#000', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={16} /> {user.displayName || user.email.split('@')[0]}
              </button>
              <button onClick={onShowMyPlaces} style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} /> My Places
              </button>
              <button onClick={onShowAddPlace} style={{ background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={16} /> Add Place
              </button>
              <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={onShowAuth} style={{ background: '#000', color: 'white', padding: '8px 24px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              Sign in
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="header-mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="header-mobile-dropdown" style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white', borderTop: '1px solid #e5e7eb',
          padding: '16px', zIndex: 100,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          <button onClick={() => { onShowAdvertise(); setMenuOpen(false); }}
            style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)', color: 'white', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={18} /> Advertise with Us
          </button>

          {user ? (
            <>
              {isAdmin && (
                <button onClick={() => { onShowAdmin(); setMenuOpen(false); }}
                  style={{ background: '#7c3aed', color: 'white', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={18} /> Admin Panel
                </button>
              )}
              <button onClick={() => { onShowProfile(); setMenuOpen(false); }}
                style={{ background: '#f3f4f6', color: '#000', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> {user.displayName || user.email.split('@')[0]}
              </button>
              <button onClick={() => { onShowMyPlaces(); setMenuOpen(false); }}
                style={{ background: '#3b82f6', color: 'white', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} /> My Places
              </button>
              <button onClick={() => { onShowAddPlace(); setMenuOpen(false); }}
                style={{ background: '#10b981', color: 'white', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Add Place
              </button>
              <button onClick={() => { onLogout(); setMenuOpen(false); }}
                style={{ background: '#fee2e2', color: '#ef4444', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => { onShowAuth(); setMenuOpen(false); }}
              style={{ background: '#000', color: 'white', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;