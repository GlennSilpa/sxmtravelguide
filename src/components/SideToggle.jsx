import React from 'react';
 
const SideToggle = ({ activeSide, onSideChange }) => {
  return (
    <div className="side-toggle" style={{ marginBottom: '30px' }}>
      <button
        onClick={() => onSideChange('all')}
        className={`side-btn ${activeSide === 'all' ? 'active-all' : 'inactive'}`}
      >
        🏝️ All SXM
      </button>
      <button
        onClick={() => onSideChange('dutch')}
        className={`side-btn ${activeSide === 'dutch' ? 'active-dutch' : 'inactive'}`}
      >
        🇳🇱 Dutch Side
      </button>
      <button
        onClick={() => onSideChange('french')}
        className={`side-btn ${activeSide === 'french' ? 'active-french' : 'inactive'}`}
      >
        🇫🇷 French Side
      </button>
    </div>
  );
};
 
export default SideToggle;