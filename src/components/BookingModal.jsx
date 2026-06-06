import React from 'react';
import { X, Calendar, Clock, Users } from 'lucide-react';
 
const BookingModal = ({ place, bookingData, onBookingChange, onConfirm, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="booking-header">
          <h3>
            {place.category === 'hotel' ? 'Book Room' : 'Reserve Table'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={24} />
          </button>
        </div>
 
        <div className="booking-form">
          <div className="form-group">
            <label className="form-label">
              <Calendar style={{ display: 'inline', marginRight: '8px' }} size={16} />
              Date
            </label>
            <input
              type="date"
              required
              className="form-input"
              value={bookingData.date}
              onChange={(e) => onBookingChange({ ...bookingData, date: e.target.value })}
            />
          </div>
 
          <div className="form-group">
            <label className="form-label">
              <Clock style={{ display: 'inline', marginRight: '8px' }} size={16} />
              Time
            </label>
            <input
              type="time"
              required
              className="form-input"
              value={bookingData.time}
              onChange={(e) => onBookingChange({ ...bookingData, time: e.target.value })}
            />
          </div>
 
          <div className="form-group">
            <label className="form-label">
              <Users style={{ display: 'inline', marginRight: '8px' }} size={16} />
              {place.category === 'hotel' ? 'Guests' : 'Party Size'}
            </label>
            <select
              className="form-input"
              value={bookingData.guests}
              onChange={(e) => onBookingChange({ ...bookingData, guests: e.target.value })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
 
          <button onClick={onConfirm} className="booking-submit-btn">
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default BookingModal;