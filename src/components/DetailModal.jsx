import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Phone, Clock, Heart } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DetailModal = ({ place, user, onClose, onBook, onAddComment }) => {
  const [newComment, setNewComment] = useState({ name: user?.displayName || '', rating: 5, text: '' });
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const placeId = place.docId || String(place.id);

  useEffect(() => {
    fetchReviews();
    if (user) checkFavorite();
  }, [placeId]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const q = query(collection(db, 'reviews'), where('placeId', '==', placeId));
      const snap = await getDocs(q);
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Error fetching reviews:', e);
    }
    setLoadingReviews(false);
  };

  const checkFavorite = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || [];
        setIsFavorited(favorites.includes(placeId));
      }
    } catch (e) {
      console.error('Error checking favorite:', e);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) { alert('Please sign in to save favorites'); return; }
    setFavLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isFavorited) {
        await updateDoc(userRef, { favorites: arrayRemove(placeId) });
        setIsFavorited(false);
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(placeId) });
        setIsFavorited(true);
      }
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
    setFavLoading(false);
  };

  const handleSubmit = async () => {
    if (!newComment.name || !newComment.text) {
      alert('Please fill in your name and review');
      return;
    }
    setSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        placeId,
        name: newComment.name,
        rating: newComment.rating,
        text: newComment.text,
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
        userId: user?.uid || 'anonymous'
      });
      setNewComment({ name: user?.displayName || '', rating: 5, text: '' });
      await fetchReviews();
    } catch (e) {
      alert('Error posting review: ' + e.message);
    }
    setSubmittingReview(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : place.rating;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-image">
          <img src={place.image} alt={place.name} />
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
          {/* Favorite button */}
          <button
            onClick={e => { e.stopPropagation(); handleToggleFavorite(); }}
            disabled={favLoading}
            style={{
              position: 'absolute', top: '16px', left: '16px',
              background: 'white', borderRadius: '50%', padding: '8px',
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <Heart
              size={20}
              style={{
                fill: isFavorited ? '#ef4444' : 'transparent',
                color: isFavorited ? '#ef4444' : '#6b7280'
              }}
            />
          </button>
        </div>

        <div className="modal-body">
          <h2>{place.name}</h2>

          <div className="modal-rating">
            <div className="rating-badge">
              <Star style={{ fill: '#fbbf24', color: '#fbbf24' }} size={20} />
              <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{avgRating}</span>
            </div>
            <span style={{ color: '#4b5563' }}>({reviews.length} reviews)</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{place.price}</span>
          </div>

          <p className="modal-description">{place.description}</p>

          <div className="modal-details">
            <div className="modal-detail-item">
              <MapPin style={{ color: '#3b82f6' }} size={20} />
              <span>{place.location}</span>
            </div>
            <div className="modal-detail-item">
              <Phone style={{ color: '#10b981' }} size={20} />
              <span>{place.phone}</span>
            </div>
            {place.hours && (
              <div className="modal-detail-item">
                <Clock style={{ color: '#f97316' }} size={20} />
                <span>{place.hours}</span>
              </div>
            )}
          </div>

          <button onClick={onBook} className="modal-book-btn">
            {place.category === 'hotel' ? 'Book Now'
              : place.category === 'restaurant' ? 'Reserve Table'
              : place.category === 'car' ? 'Rent Now'
              : 'Get Directions'}
          </button>

          {/* Reviews Section */}
          <div className="comments-section">
            <h3>Reviews & Comments</h3>

            <div className="comment-form">
              <h4>Leave a Review</h4>

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" placeholder="Enter your name" className="form-input"
                  value={newComment.name}
                  onChange={e => setNewComment({ ...newComment, name: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setNewComment({ ...newComment, rating: star })} className="star-btn">
                      <Star size={32} style={{
                        fill: star <= newComment.rating ? '#fbbf24' : 'transparent',
                        color: star <= newComment.rating ? '#fbbf24' : '#d1d5db'
                      }} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea placeholder="Share your experience..." rows="4" className="form-textarea"
                  value={newComment.text}
                  onChange={e => setNewComment({ ...newComment, text: e.target.value })} />
              </div>

              <button onClick={handleSubmit} disabled={submittingReview} className="modal-book-btn">
                {submittingReview ? 'Posting...' : 'Post Review'}
              </button>
            </div>

            <div className="comments-list">
              {loadingReviews ? (
                <p className="no-comments">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="no-comments">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="comment-card">
                    <div className="comment-header">
                      <div className="comment-author">
                        <h5>{review.name}</h5>
                        <p className="comment-date">{review.date}</p>
                      </div>
                      <div className="comment-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={16} style={{
                            fill: star <= review.rating ? '#fbbf24' : 'transparent',
                            color: star <= review.rating ? '#fbbf24' : '#d1d5db'
                          }} />
                        ))}
                      </div>
                    </div>
                    <p className="comment-text">{review.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;