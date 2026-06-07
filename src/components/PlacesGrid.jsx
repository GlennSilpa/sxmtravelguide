import React from 'react';
import PlaceCard from './PlaceCard';
import CardBanner from './banners/CardBanner';
import FeaturedSponsor from './FeaturedSponsor';

const PlacesGrid = ({ places, onSelect, onBook, isAdmin, onAdminEdit, onAdminDelete, onAdminFeature, featuredPlace }) => {
  return (
    <div className="places-grid">
      {featuredPlace && (
        <FeaturedSponsor place={featuredPlace} onSelect={onSelect} />
      )}

      {places.map((item, index) => {
        if (item.type === 'banner') {
          return <CardBanner key={`banner-${index}`} banner={item.data} />;
        }
        const place = item.type === 'place' ? item.data : item;
       
        return (
          <PlaceCard
            key={place.id || place.docId}
            place={place}
            onSelect={onSelect}
            onBook={onBook}
            isAdmin={isAdmin}
            onAdminEdit={onAdminEdit}
            onAdminDelete={onAdminDelete}
            onAdminFeature={onAdminFeature}
            isFeatured={featuredPlace?.docId === place.docId}
          />
        );
      })}
    </div>
  );
};

export default PlacesGrid;