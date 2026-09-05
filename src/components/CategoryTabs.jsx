import React from 'react';
import { MapPin, Utensils, Hotel, ShoppingBag, Car, BookOpen } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', icon: MapPin },
  { id: 'restaurant', name: 'Restaurants', icon: Utensils },
  { id: 'hotel', name: 'Hotels', icon: Hotel },
  { id: 'store', name: 'Stores', icon: ShoppingBag },
  { id: 'beach', name: 'Beaches', icon: MapPin },
  { id: 'taxi', name: 'Taxi', icon: Car },
  { id: 'history', name: 'History', icon: BookOpen }
];

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-tabs-wrapper" style={{ marginBottom: '24px' }}>
      <div className="category-tabs-container" style={{
        display: 'flex',
        gap: '24px',
        justifyContent: 'center'
      }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="category-tab-btn"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeCategory === cat.id ? '3px solid #000' : '3px solid transparent',
                padding: '16px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                color: '#000',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={20} />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;