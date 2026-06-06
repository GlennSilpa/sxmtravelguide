import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: { background: '#fef3c7', color: '#d97706', label: '⏳ Pending Approval' },
    approved: { background: '#dcfce7', color: '#16a34a', label: '✅ Live' },
    pending_edit: { background: '#e0f2fe', color: '#0369a1', label: '✏️ Edit Pending' },
    pending_delete: { background: '#fee2e2', color: '#dc2626', label: '🗑️ Delete Requested' }
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{
      background: s.background, color: s.color,
      fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px'
    }}>
      {s.label}
    </span>
  );
};

const MyPlaces = ({ user, onClose, onEdit }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPlaces();
  }, []);

  const fetchMyPlaces = async () => {
    setLoading(true);
    try {
      // Fetch pending submissions
      const pendingSnap = await getDocs(collection(db, 'pendingPlaces'));
      const pending = pendingSnap.docs
        .map(d => ({ docId: d.id, collection: 'pendingPlaces', ...d.data() }))
        .filter(p => p.submittedBy === user.email);

      // Fetch approved places
      const approvedSnap = await getDocs(collection(db, 'approvedPlaces'));
      const approved = approvedSnap.docs
        .map(d => ({ docId: d.id, collection: 'approvedPlaces', ...d.data() }))
        .filter(p => p.submittedBy === user.email);

      // Fetch pending edits
      const editsSnap = await getDocs(collection(db, 'pendingEdits'));
      const edits = editsSnap.docs
        .map(d => ({ docId: d.id, collection: 'pendingEdits', ...d.data() }))
        .filter(p => p.submittedBy === user.email);

      // Fetch pending deletes
      const deletesSnap = await getDocs(collection(db, 'pendingDeletes'));
      const deletes = deletesSnap.docs
        .map(d => ({ docId: d.id, ...d.data() }))
        .filter(p => p.submittedBy === user.email)
        .map(d => d.placeId);

      // Mark approved places with pending edits or deletes
      const approvedWithStatus = approved.map(place => {
        const hasPendingEdit = edits.find(e => e.originalId === place.docId);
        const hasPendingDelete = deletes.includes(place.docId);
        return {
          ...place,
          status: hasPendingDelete ? 'pending_delete' : hasPendingEdit ? 'pending_edit' : 'approved'
        };
      });

      // Filter out approved places that also have pending edits (show edit instead)
      const editedIds = edits.map(e => e.originalId);
      const filteredApproved = approvedWithStatus.filter(p => !editedIds.includes(p.docId) || p.status === 'pending_delete');

      setPlaces([
        ...pending.map(p => ({ ...p, status: 'pending' })),
        ...filteredApproved,
        ...edits.map(e => ({ ...e, status: 'pending_edit' }))
      ]);
    } catch (e) {
      console.error('Error fetching places:', e);
    }
    setLoading(false);
  };

  const handleDelete = async (place) => {
    if (place.status === 'pending') {
      // Pending places can be deleted immediately
      if (!confirm(`Delete "${place.name}"? This cannot be undone.`)) return;
      await deleteDoc(doc(db, 'pendingPlaces', place.docId));
      await fetchMyPlaces();
    } else if (place.status === 'approved') {
      // Approved places need admin approval to delete
      if (!confirm(`Request deletion of "${place.name}"? An admin will review this request.`)) return;
      await addDoc(collection(db, 'pendingDeletes'), {
        placeId: place.docId,
        placeName: place.name,
        submittedBy: user.email,
        requestedAt: new Date().toISOString()
      });
      await fetchMyPlaces();
    } else if (place.status === 'pending_edit') {
      if (!confirm(`Cancel your pending edit for "${place.name}"?`)) return;
      await deleteDoc(doc(db, 'pendingEdits', place.docId));
      await fetchMyPlaces();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '100%',
        maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
          position: 'sticky', top: 0, background: 'white', zIndex: 1
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>📍 My Places</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>Loading your places...</p>
          ) : places.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
              <p style={{ margin: 0, fontWeight: '600' }}>You haven't submitted any places yet.</p>
              <p style={{ margin: '8px 0 0', fontSize: '14px' }}>Use the "Add Place" button to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {places.map((place, i) => (
                <div key={i} style={{
                  border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden',
                  display: 'flex'
                }}>
                  {place.image && (
                    <img src={place.image} alt={place.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{place.name}</h4>
                        <StatusBadge status={place.status} />
                      </div>
                      <p style={{ margin: '2px 0', fontSize: '12px', color: '#6b7280' }}>
                        {place.category} • {place.side === 'dutch' ? '🇳🇱' : '🇫🇷'} {place.location}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#374151' }}>
                        {place.description?.substring(0, 80)}...
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      {/* Can edit if approved or pending (not pending_delete or pending_edit) */}
                      {(place.status === 'approved' || place.status === 'pending') && (
                        <button onClick={() => onEdit(place)}
                          style={{
                            background: '#f3f4f6', border: 'none', borderRadius: '8px',
                            padding: '6px 14px', cursor: 'pointer', fontWeight: '600',
                            fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                          <Edit2 size={13} /> Edit
                        </button>
                      )}
                      {/* Can delete unless already pending delete */}
                      {place.status !== 'pending_delete' && (
                        <button onClick={() => handleDelete(place)}
                          style={{
                            background: '#fee2e2', color: '#ef4444', border: 'none',
                            borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
                            fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                          <Trash2 size={13} />
                          {place.status === 'pending_edit' ? 'Cancel Edit' : place.status === 'approved' ? 'Request Delete' : 'Delete'}
                        </button>
                      )}
                      {place.status === 'pending_delete' && (
                        <p style={{ margin: 0, fontSize: '12px', color: '#dc2626' }}>
                          Awaiting admin approval to delete
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPlaces;