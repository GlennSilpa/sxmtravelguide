import React from 'react';
import PlaceCard from './PlaceCard';
import CardBanner from './banners/CardBanner';
import FeaturedSponsor from './FeaturedSponsor';

const PlacesGrid = ({ places, onSelect, onBook, isAdmin, onAdminEdit, onAdminDelete, featuredPlace }) => {
  return (
    <div className="places-grid">
      {/* Featured Sponsor always at the top */}
      {featuredPlace && (
        <FeaturedSponsor place={featuredPlace} onSelect={onSelect} />
      )}

      {places.map((item, index) => {
        if (item.type === 'banner') {
          return <CardBanner key={`banner-${index}`} banner={item.data} />;
        }
        const place = item.type === 'place' ? item.data : item;
        // Don't show the featured place again in the regular grid
        if (featuredPlace && place.docId === featuredPlace.docId) return null;
        return (
          <PlaceCard
            key={place.id || place.docId}
            place={place}
            onSelect={onSelect}
            onBook={onBook}
            isAdmin={isAdmin}
            onAdminEdit={onAdminEdit}
            onAdminDelete={onAdminDelete}
          />
        );
      })}
    </div>
  );
};

export default PlacesGrid;