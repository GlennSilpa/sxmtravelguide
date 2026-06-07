import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth, ADMIN_EMAILS } from './firebase';
import './index.css';

import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import SearchBar from './components/SearchBar';
import SideToggle from './components/SideToggle';
import PlacesGrid from './components/PlacesGrid';
import DetailModal from './components/DetailModal';
import BookingModal from './components/BookingModal';
import Auth from './components/Auth';
import AddPlace from './components/AddPlace';
import EditPlace from './components/EditPlace';
import MyPlaces from './components/MyPlaces';
import UserProfile from './components/UserProfile';
import AdminEditPlace from './components/AdminEditPlace';
import AdminPanel from './components/Admin/AdminPanel';
import Advertise from './components/Advertise';
import HistoryTimeline from './components/HistoryTimeline';
import TopBanner from './components/banners/TopBanner';
import SidebarBanner from './components/banners/SidebarBanner';
import PopupBanner from './components/banners/PopupBanner';

const App = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSide, setActiveSide] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMyPlaces, setShowMyPlaces] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAdvertise, setShowAdvertise] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [adminEditingPlace, setAdminEditingPlace] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', guests: 2 });
  const [user, setUser] = useState(null);
  const [approvedPlaces, setApprovedPlaces] = useState([]);
  const [banners, setBanners] = useState([]);
  const [featuredPlace, setFeaturedPlace] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0]
        });
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchBanners();
    fetchApprovedPlaces();
  }, []);

  const fetchBanners = async () => {
    try {
      const snap = await getDocs(collection(db, 'banners'));
      setBanners(snap.docs.map(d => ({ ...d.data(), docId: d.id })));
    } catch (e) { console.error('Error fetching banners:', e); }
  };

  const fetchApprovedPlaces = async () => {
    try {
      const snap = await getDocs(collection(db, 'approvedPlaces'));
      const places = snap.docs.map(d => ({ ...d.data(), docId: d.id }));
      setApprovedPlaces(places);
      // Find featured place
      const featured = places.find(p => p.featured === true);
      setFeaturedPlace(featured || null);
    } catch (e) { console.error('Error fetching approved places:', e); }
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  const getBannerByType = (type) => banners.find(b => b.type === type && b.active);
  const getBannersByType = (type) => banners.filter(b => b.type === type && b.active);
  const isHistoryTab = activeCategory === 'history';

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleBooking = () => {
    if (!bookingData.date || !bookingData.time) { alert('Please fill in all fields'); return; }
    alert(`Booking confirmed for ${selectedPlace.name}!\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nGuests: ${bookingData.guests}`);
    setShowBooking(false);
    setSelectedPlace(null);
    setBookingData({ date: '', time: '', guests: 2 });
  };

  const handleCardBook = (place) => {
    setSelectedPlace(place);
    if (place.category !== 'beach') setShowBooking(true);
  };

  const handleAdminDelete = async (place) => {
    if (!place.docId) { alert('This place has no Firestore ID.'); return; }
    if (!confirm(`Delete "${place.name}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'approvedPlaces', place.docId));
      await fetchApprovedPlaces();
    } catch (e) { alert('Error deleting: ' + e.message); }
  };

  const handleAdminFeature = async (place) => {
    try {
      const isCurrentlyFeatured = place.featured === true;
      // Remove featured from all places first
      if (featuredPlace && featuredPlace.docId !== place.docId) {
        await updateDoc(doc(db, 'approvedPlaces', featuredPlace.docId), { featured: false });
      }
      // Toggle featured on selected place
      await updateDoc(doc(db, 'approvedPlaces', place.docId), { featured: !isCurrentlyFeatured });
      await fetchApprovedPlaces();
    } catch (e) { alert('Error updating featured: ' + e.message); }
  };

  const filteredPlaces = approvedPlaces.filter(place => {
    const matchesCategory = activeCategory === 'all' || place.category === activeCategory;
    const matchesSide = activeSide === 'all' || place.side === activeSide;
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSide && matchesSearch;
  });

  const cardBanners = getBannersByType('card');
  const placesWithBanners = [];
  filteredPlaces.forEach((place, i) => {
    placesWithBanners.push({ type: 'place', data: place });
    if ((i + 1) % 6 === 0 && cardBanners.length > 0) {
      const banner = cardBanners[Math.floor((i + 1) / 6 - 1) % cardBanners.length];
      placesWithBanners.push({ type: 'banner', data: banner });
    }
  });

  if (!authReady) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏝️</div>
          <p style={{ color: '#6b7280' }}>Loading Cheap People...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <TopBanner banner={getBannerByType('top')} />

      <Header
        user={user}
        isAdmin={isAdmin}
        onShowAuth={() => setShowAuth(true)}
        onShowAddPlace={() => setShowAddPlace(true)}
        onShowAdmin={() => setShowAdmin(true)}
        onShowMyPlaces={() => setShowMyPlaces(true)}
        onShowProfile={() => setShowUserProfile(true)}
        onShowAdvertise={() => setShowAdvertise(true)}
        onLogout={handleLogout}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 16px 20px' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', color: '#000' }}>
          Where to?
        </h2>
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        {!isHistoryTab && (
          <>
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <SideToggle activeSide={activeSide} onSideChange={setActiveSide} />
          </>
        )}
      </div>

      {isHistoryTab ? (
        <HistoryTimeline isAdmin={isAdmin} />
      ) : (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <PlacesGrid
              places={placesWithBanners}
              onSelect={setSelectedPlace}
              onBook={handleCardBook}
              isAdmin={isAdmin}
              onAdminEdit={setAdminEditingPlace}
              onAdminDelete={handleAdminDelete}
              onAdminFeature={handleAdminFeature}
              featuredPlace={featuredPlace}
            />
          </div>
          {getBannersByType('sidebar').length > 0 && (
            <SidebarBanner banners={getBannersByType('sidebar')} />
          )}
        </div>
      )}

      <PopupBanner banner={getBannerByType('popup')} />

      {selectedPlace && !showBooking && (
        <DetailModal place={selectedPlace} user={user} onClose={() => setSelectedPlace(null)} onBook={() => setShowBooking(true)} onAddComment={() => {}} />
      )}
      {showBooking && selectedPlace && (
        <BookingModal place={selectedPlace} bookingData={bookingData} onBookingChange={setBookingData} onConfirm={handleBooking} onClose={() => setShowBooking(false)} />
      )}
      {showAuth && <Auth onClose={() => setShowAuth(false)} onSuccess={(u) => setUser(u)} />}
      {showAddPlace && user && <AddPlace user={user} onClose={() => setShowAddPlace(false)} onAdd={() => {}} />}
      {showMyPlaces && user && (
        <MyPlaces user={user} onClose={() => setShowMyPlaces(false)} onEdit={(place) => { setShowMyPlaces(false); setEditingPlace(place); }} />
      )}
      {showUserProfile && user && (
        <UserProfile user={user} onClose={() => setShowUserProfile(false)} onSelectPlace={setSelectedPlace} />
      )}
      {editingPlace && user && (
        <EditPlace user={user} place={editingPlace} onClose={() => { setEditingPlace(null); fetchApprovedPlaces(); }} />
      )}
      {adminEditingPlace && isAdmin && (
        <AdminEditPlace place={adminEditingPlace} onClose={() => setAdminEditingPlace(null)} onSaved={fetchApprovedPlaces} />
      )}
      {showAdmin && isAdmin && (
        <AdminPanel onClose={() => { setShowAdmin(false); fetchBanners(); fetchApprovedPlaces(); }} onImportDone={fetchApprovedPlaces} />
      )}
      {showAdvertise && <Advertise onClose={() => setShowAdvertise(false)} />}
    </div>
  );
};

export default App;