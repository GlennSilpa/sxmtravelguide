import React from 'react';
import { Search } from 'lucide-react';
 
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div
      className="search-container"
      style={{ maxWidth: '800px', margin: '0 auto 30px', position: 'relative' }}
    >
      <div
        className="search-input-wrapper-main"
        style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      >
        <Search
          size={24}
          style={{ position: 'absolute', left: '20px', color: '#999', zIndex: 1 }}
        />
        <input
          type="text"
          placeholder="Places to go, things to do, hotels..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="main-search-input"
          style={{
            width: '100%',
            padding: '16px 16px 16px 56px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '50px',
            outline: 'none'
          }}
        />
        <button
          className="search-btn-main"
          style={{
            position: 'absolute',
            right: '8px',
            background: '#34e0a1',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};
 
export default SearchBar;