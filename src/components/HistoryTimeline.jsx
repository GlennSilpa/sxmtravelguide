import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const DEFAULT_EVENTS = [
  { year: "1493", title: "Columbus Arrives", description: "Christopher Columbus sighted the island during his second voyage to the Americas on November 11, 1493 — Saint Martin's Day — and named it Sint Maarten in honor of the saint.", emoji: "⛵" },
  { year: "1620s", title: "First Settlements", description: "Dutch and French settlers began establishing colonies on the island, attracted by its salt pans which were a valuable commodity for preserving fish in Europe.", emoji: "🏘️" },
  { year: "1648", title: "The Treaty of Concordia", description: "The famous legend says a Frenchman and a Dutchman started walking from opposite ends of the island and where they met became the border. The island was peacefully divided between France and the Netherlands — one of the world's oldest open borders still in effect today.", emoji: "🤝" },
  { year: "1700s", title: "Sugar & Slavery Era", description: "The island's economy shifted to sugar cane plantations, bringing a dark period of slavery. Enslaved Africans were brought to work the plantations on both sides of the island.", emoji: "⚠️" },
  { year: "1848", title: "Abolition on the French Side", description: "France abolished slavery in all its colonies, freeing enslaved people on Saint-Martin. The Dutch side followed in 1863.", emoji: "✊" },
  { year: "1939", title: "Princess Juliana Airport Opens", description: "The airport that would become famous worldwide for its low-flying planes opened, beginning Sint Maarten's transformation into a tourism destination.", emoji: "✈️" },
  { year: "1954", title: "Dutch Autonomy", description: "Sint Maarten became part of the Netherlands Antilles, an autonomous country within the Kingdom of the Netherlands.", emoji: "🇳🇱" },
  { year: "2003", title: "French Side Votes", description: "Saint-Martin voted to separate from Guadeloupe and become its own French overseas collectivity, gaining more autonomy.", emoji: "🇫🇷" },
  { year: "2010", title: "Sint Maarten Becomes a Country", description: "Following the dissolution of the Netherlands Antilles, Sint Maarten became a constituent country of the Kingdom of the Netherlands, with its own government and parliament.", emoji: "🏛️" },
  { year: "2017", title: "Hurricane Irma", description: "Category 5 Hurricane Irma devastated the island on September 6, 2017, destroying 90% of structures on Sint Maarten. The island's resilience and rapid rebuilding became a testament to its community spirit.", emoji: "🌀" },
  { year: "Today", title: "A Thriving Destination", description: "SXM has rebuilt and flourished into one of the Caribbean's most visited destinations, known for its unique dual-nation identity, world-class beaches, international cuisine, and famously low-flying planes at Maho Beach.", emoji: "🌴" }
];

const emptyEvent = { year: '', title: '', description: '', emoji: '📌' };

const HistoryTimeline = ({ isAdmin }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'historyEvents'));
      if (snap.docs.length === 0) {
        setEvents(DEFAULT_EVENTS.map((e, i) => ({ ...e, id: `default-${i}`, isDefault: true })));
      } else {
        const fetched = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        fetched.sort((a, b) => (parseInt(a.year) || 9999) - (parseInt(b.year) || 9999));
        setEvents(fetched);
      }
    } catch (e) {
      setEvents(DEFAULT_EVENTS.map((e, i) => ({ ...e, id: `default-${i}`, isDefault: true })));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.year || !form.title || !form.description) { alert('Please fill in year, title and description'); return; }
    setSaving(true);
    try {
      if (editingEvent && !editingEvent.isDefault) {
        await updateDoc(doc(db, 'historyEvents', editingEvent.id), form);
      } else {
        await addDoc(collection(db, 'historyEvents'), form);
      }
      setForm(emptyEvent); setShowForm(false); setEditingEvent(null);
      await fetchEvents();
    } catch (e) { alert('Error saving: ' + e.message); }
    setSaving(false);
  };

  const handleDelete = async (event) => {
    if (event.isDefault) { alert("Import to Firestore first to delete built-in events."); return; }
    if (!confirm(`Delete "${event.title}"?`)) return;
    try {
      await deleteDoc(doc(db, 'historyEvents', event.id));
      await fetchEvents();
    } catch (e) { alert('Error deleting: ' + e.message); }
  };

  const handleEdit = (event) => {
    setForm({ year: event.year, title: event.title, description: event.description, emoji: event.emoji });
    setEditingEvent(event); setShowForm(true);
  };

  const handleImportDefaults = async () => {
    if (!confirm(`Import all ${DEFAULT_EVENTS.length} default history events to Firestore?`)) return;
    setSaving(true);
    try {
      for (const event of DEFAULT_EVENTS) await addDoc(collection(db, 'historyEvents'), event);
      await fetchEvents();
      alert('✅ History events imported!');
    } catch (e) { alert('Error importing: ' + e.message); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📜</div>
      <p>Loading history...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px 60px' }}>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 12px' }}>🏝️ History of Sint Maarten</h2>
        <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
          One island, two nations, five centuries of fascinating history
        </p>
      </div>

      {isAdmin && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button onClick={() => { setForm(emptyEvent); setEditingEvent(null); setShowForm(true); }}
            style={{ background: '#000', color: 'white', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Event
          </button>
          {events[0]?.isDefault && (
            <button onClick={handleImportDefaults} disabled={saving}
              style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              📦 Import to Firestore
            </button>
          )}
        </div>
      )}

      {showForm && isAdmin && (
        <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '2px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{editingEvent ? '✏️ Edit Event' : '➕ Add Event'}</h3>
            <button onClick={() => { setShowForm(false); setEditingEvent(null); setForm(emptyEvent); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Year *</label>
                <input type="text" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="e.g. 1648"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Emoji</label>
                <input type="text" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} placeholder="e.g. ⛵"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>Description *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this historical event..." rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <button onClick={handleSave} disabled={saving}
              style={{ background: '#000', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Save size={16} /> {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </div>
      )}

      {/* Timeline - single column on mobile, alternating on desktop */}
      <div className="timeline-container" style={{ position: 'relative' }}>
        {/* Vertical line - hidden on mobile via CSS */}
        <div className="timeline-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, #e5e7eb, #3b82f6, #e5e7eb)', transform: 'translateX(-50%)' }} />

        {events.map((event, index) => {
          const isLeft = index % 2 === 0;
          const isExpanded = expandedId === event.id;

          return (
            <div key={event.id} className="timeline-item" style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', marginBottom: '32px', position: 'relative' }}>
              {/* Center dot */}
              <div className="timeline-dot" style={{ position: 'absolute', left: '50%', top: '20px', transform: 'translateX(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: '3px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', zIndex: 1, boxShadow: '0 2px 8px rgba(59,130,246,0.2)' }}>
                {event.emoji}
              </div>

              {/* Card */}
              <div onClick={() => setExpandedId(isExpanded ? null : event.id)}
                className="timeline-card"
                style={{ width: 'calc(50% - 40px)', background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '12px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px' }}>{event.year}</span>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleEdit(event)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer' }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(event)} style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer' }}>
                        <Trash2 size={13} color="#ef4444" />
                      </button>
                    </div>
                  )}
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700' }}>{event.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.6, overflow: 'hidden', maxHeight: isExpanded ? '300px' : '40px', transition: 'max-height 0.3s ease' }}>
                  {event.description}
                </p>
                {!isExpanded && <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', marginTop: '4px', display: 'block' }}>Read more ↓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTimeline;