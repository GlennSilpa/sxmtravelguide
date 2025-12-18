import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Clock, Phone, Calendar, Users, Utensils, Hotel, ShoppingBag, X, User, LogOut, Plus } from 'lucide-react';
import './index.css';
import Auth from './components/Auth';
import AddPlace from './components/AddPlace';

const App = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [activeSide, setActiveSide] = useState('all');
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 2
  });
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({ name: '', rating: 5, text: '' });
  
  // NEW STATE VARIABLES - THESE WERE MISSING!
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [userPlaces, setUserPlaces] = useState([]);

  // Load user and places from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const savedPlaces = localStorage.getItem('userPlaces');
    if (savedPlaces) {
      setUserPlaces(JSON.parse(savedPlaces));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAddPlace = (newPlace) => {
    const updated = [...userPlaces, newPlace];
    setUserPlaces(updated);
    localStorage.setItem('userPlaces', JSON.stringify(updated));
  };

  const places = [
    // RESTAURANTS
    {
      id: 1,
      name: "Ocean Lounge",
      category: "restaurant",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      rating: 4.8,
      reviews: 342,
      price: "$$$",
      cuisine: "Caribbean Fusion",
      location: "Maho Beach",
      side: "dutch",
      phone: "+1 721-555-0123",
      hours: "11:00 AM - 11:00 PM",
      description: "Beachfront dining with stunning sunset views and fresh seafood specialties."
    },
    {
      id: 4,
      name: "La Plage Restaurant",
      category: "restaurant",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
      rating: 4.9,
      reviews: 421,
      price: "$$$$",
      cuisine: "French Mediterranean",
      location: "Orient Bay",
      side: "french",
      phone: "+590 590-555-0222",
      hours: "12:00 PM - 10:00 PM",
      description: "Award-winning French cuisine with feet-in-the-sand beachside dining."
    },
    {
      id: 7,
      name: "Le Cottage Restaurant",
      category: "restaurant",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
      rating: 4.7,
      reviews: 287,
      price: "$$$",
      cuisine: "French Creole",
      location: "Grand Case",
      side: "french",
      phone: "+590 590-555-0111",
      hours: "6:00 PM - 10:00 PM",
      description: "Intimate French Creole dining in the heart of Grand Case's famous restaurant row."
    },
    {
      id: 10,
      name: "Mario's Bistro",
      category: "restaurant",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
      rating: 4.8,
      reviews: 512,
      price: "$$$$",
      cuisine: "French Italian",
      location: "Sandy Ground",
      side: "french",
      phone: "+590 590-555-0222",
      hours: "6:30 PM - 11:00 PM",
      description: "Upscale beachfront dining with exquisite French-Italian fusion cuisine."
    },
    {
      id: 13,
      name: "Pineapple Pete",
      category: "restaurant",
      image: "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?w=800&q=80",
      rating: 4.3,
      reviews: 389,
      price: "$$",
      cuisine: "Caribbean American",
      location: "Simpson Bay",
      side: "dutch",
      phone: "+1 721-555-7777",
      hours: "11:30 AM - 10:00 PM",
      description: "Casual beachfront dining with tropical cocktails and Caribbean favorites."
    },
    {
      id: 16,
      name: "Lolos",
      category: "restaurant",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      rating: 4.6,
      reviews: 678,
      price: "$",
      cuisine: "Creole BBQ",
      location: "Marigot",
      side: "french",
      phone: "+590 590-555-0555",
      hours: "11:00 AM - 9:00 PM",
      description: "Authentic roadside BBQ grills serving traditional Creole dishes."
    },
    {
      id: 19,
      name: "Chesterfield's",
      category: "restaurant",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
      rating: 4.4,
      reviews: 356,
      price: "$$$",
      cuisine: "American Grill",
      location: "Great Bay Marina",
      side: "dutch",
      phone: "+1 721-555-1010",
      hours: "11:00 AM - 11:00 PM",
      description: "Waterfront dining with marina views and classic American fare."
    },

    // HOTELS
    {
      id: 2,
      name: "Sunset Beach Resort",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      rating: 4.6,
      reviews: 578,
      price: "$$$$",
      amenities: "Pool, Spa, Beach Access",
      location: "Simpson Bay",
      side: "dutch",
      phone: "+1 721-555-0456",
      description: "Luxury beachfront resort with world-class amenities and Caribbean hospitality."
    },
    {
      id: 5,
      name: "Azure Hotel & Marina",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      rating: 4.5,
      reviews: 392,
      price: "$$$",
      amenities: "Marina, Restaurant, Pool",
      location: "Simpson Bay Lagoon",
      side: "dutch",
      phone: "+1 721-555-2222",
      description: "Modern waterfront hotel with marina access and panoramic lagoon views."
    },
    {
      id: 8,
      name: "Divi Little Bay Resort",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      rating: 4.3,
      reviews: 445,
      price: "$$$",
      amenities: "Beach, Casino, Spa",
      location: "Little Bay",
      side: "dutch",
      phone: "+1 721-555-4444",
      description: "All-inclusive beachfront resort with casino and stunning cliff views."
    },
    {
      id: 11,
      name: "Sonesta Maho Beach Resort",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      rating: 4.4,
      reviews: 823,
      price: "$$$$",
      amenities: "Beach, Casino, Pool Complex",
      location: "Maho Beach",
      side: "dutch",
      phone: "+1 721-555-6666",
      description: "Iconic resort famous for plane watching and vibrant nightlife."
    },
    {
      id: 14,
      name: "Le Petit Hotel",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      rating: 4.6,
      reviews: 156,
      price: "$$",
      amenities: "Pool, Continental Breakfast",
      location: "Grand Case",
      side: "french",
      phone: "+590 590-555-0444",
      description: "Charming boutique hotel steps from Grand Case beach and restaurants."
    },
    {
      id: 17,
      name: "Princess Heights",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
      rating: 4.7,
      reviews: 267,
      price: "$$$",
      amenities: "Pool, Ocean View, Kitchenettes",
      location: "Oyster Pond",
      side: "dutch",
      phone: "+1 721-555-9999",
      description: "Hillside resort with panoramic ocean views and spacious suites."
    },
    {
      id: 20,
      name: "Hotel L'Esplanade",
      category: "hotel",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
      rating: 4.5,
      reviews: 198,
      price: "$$$$",
      amenities: "Pool, Restaurant, Spa",
      location: "Grand Case",
      side: "french",
      phone: "+590 590-555-0777",
      description: "Luxury hillside resort overlooking Grand Case Bay."
    },

    // STORES
    {
      id: 3,
      name: "Island Spice Market",
      category: "store",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
      rating: 4.7,
      reviews: 156,
      price: "$$",
      specialty: "Local Crafts & Spices",
      location: "Philipsburg",
      side: "dutch",
      phone: "+1 721-555-0789",
      hours: "9:00 AM - 6:00 PM",
      description: "Authentic Caribbean spices, handmade crafts, and local artisan products."
    },
    {
      id: 6,
      name: "Caribbean Treasures",
      category: "store",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      rating: 4.4,
      reviews: 203,
      price: "$$$",
      specialty: "Jewelry & Souvenirs",
      location: "Front Street, Philipsburg",
      side: "dutch",
      phone: "+1 721-555-3333",
      hours: "10:00 AM - 7:00 PM",
      description: "Premium duty-free jewelry, watches, and authentic Caribbean souvenirs."
    },
    {
      id: 9,
      name: "Tropicana Market",
      category: "store",
      image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&q=80",
      rating: 4.2,
      reviews: 178,
      price: "$",
      specialty: "Groceries & Local Products",
      location: "Cole Bay",
      side: "dutch",
      phone: "+1 721-555-5555",
      hours: "7:00 AM - 9:00 PM",
      description: "Full-service supermarket with local Caribbean products and imported goods."
    },
    {
      id: 12,
      name: "Marigot Market",
      category: "store",
      image: "https://images.unsplash.com/photo-1555529902-5261145633bf?w=800&q=80",
      rating: 4.5,
      reviews: 234,
      price: "$",
      specialty: "Fresh Produce & Crafts",
      location: "Marigot",
      side: "french",
      phone: "+590 590-555-0333",
      hours: "6:00 AM - 2:00 PM",
      description: "Authentic open-air market with fresh produce, spices, and handmade crafts."
    },
    {
      id: 15,
      name: "Del Sol",
      category: "store",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
      rating: 4.3,
      reviews: 145,
      price: "$$",
      specialty: "Color-Changing Apparel",
      location: "Philipsburg",
      side: "dutch",
      phone: "+1 721-555-8888",
      hours: "9:00 AM - 6:00 PM",
      description: "Unique sun-activated color-changing clothing and accessories."
    },
    {
      id: 18,
      name: "Vie et Vin",
      category: "store",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
      rating: 4.8,
      reviews: 112,
      price: "$$$",
      specialty: "Wine & Gourmet Foods",
      location: "Grand Case",
      side: "french",
      phone: "+590 590-555-0666",
      hours: "10:00 AM - 7:00 PM",
      description: "Premium wine shop and gourmet food boutique with French selections."
    },

    // BEACHES (37 total)
    {
      id: 21,
      name: "Maho Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      rating: 4.9,
      reviews: 1245,
      price: "Free",
      features: "Plane Watching, Bars, Restaurants",
      location: "Maho Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "World-famous beach where planes fly directly overhead. Unique experience with bars and restaurants nearby."
    },
    {
      id: 22,
      name: "Orient Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      rating: 4.8,
      reviews: 892,
      price: "Free",
      features: "Water Sports, Restaurants, Clothing Optional",
      location: "Orient Bay",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "The Caribbean's premier beach with crystal clear waters, water sports, and beachfront dining."
    },
    {
      id: 23,
      name: "Mullet Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80",
      rating: 4.7,
      reviews: 634,
      price: "Free",
      features: "Swimming, Snorkeling, Calm Waters",
      location: "Mullet Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Protected bay with calm, clear waters perfect for families and snorkeling enthusiasts."
    },
    {
      id: 24,
      name: "Grand Case Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      rating: 4.6,
      reviews: 456,
      price: "Free",
      features: "Calm Waters, Restaurants, Local Vibe",
      location: "Grand Case",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Charming beach in the culinary capital with calm waters and authentic Caribbean atmosphere."
    },
    {
      id: 25,
      name: "Cupecoy Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80",
      rating: 4.5,
      reviews: 523,
      price: "Free",
      features: "Cliffs, Caves, Clothing Optional",
      location: "Cupecoy",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Dramatic cliffside beach with hidden caves and stunning rock formations."
    },
    {
      id: 26,
      name: "Pinel Island",
      category: "beach",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      rating: 4.9,
      reviews: 378,
      price: "$",
      features: "Boat Access, Snorkeling, Restaurants",
      location: "Off Cul de Sac",
      side: "french",
      phone: "N/A",
      hours: "9:00 AM - 5:00 PM (boat schedule)",
      description: "Pristine island paradise accessible by boat, with excellent snorkeling and beachside grills."
    },
    {
      id: 27,
      name: "Dawn Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
      rating: 4.4,
      reviews: 289,
      price: "Free",
      features: "Surfing, Sunrise Views, Reef Access",
      location: "Oyster Pond",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "East-facing beach perfect for sunrise watching and surf enthusiasts."
    },
    {
      id: 28,
      name: "Baie Rouge",
      category: "beach",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
      rating: 4.7,
      reviews: 412,
      price: "Free",
      features: "Red Cliffs, Clear Water, Natural Beauty",
      location: "Terres Basses",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Stunning beach framed by red cliffs with pristine turquoise waters."
    },
    {
      id: 29,
      name: "Great Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
      rating: 4.3,
      reviews: 567,
      price: "Free",
      features: "Boardwalk, Shopping, Restaurants",
      location: "Philipsburg",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Long boardwalk beach in the heart of Philipsburg with easy access to shops and dining."
    },
    {
      id: 30,
      name: "Happy Bay",
      category: "beach",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      rating: 4.6,
      reviews: 234,
      price: "Free",
      features: "Secluded, Hiking Access, Natural",
      location: "Friar's Bay Area",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Hidden gem accessible via short hike, offering pristine seclusion and natural beauty."
    },
    {
      id: 31,
      name: "Simpson Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80",
      rating: 4.4,
      reviews: 445,
      price: "Free",
      features: "Long Beach, Restaurants, Bars",
      location: "Simpson Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Long stretch of beach with numerous restaurants and bars, perfect for beach hopping."
    },
    {
      id: 32,
      name: "Kim Sha Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
      rating: 4.2,
      reviews: 312,
      price: "Free",
      features: "Plane Watching, Calm Waters",
      location: "Simpson Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Quieter alternative to Maho Beach with plane watching opportunities."
    },
    {
      id: 33,
      name: "Little Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      rating: 4.6,
      reviews: 234,
      price: "Free",
      features: "Snorkeling, Cliff Jumping, Resort Access",
      location: "Little Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Protected cove with excellent snorkeling and optional cliff jumping."
    },
    {
      id: 34,
      name: "Indigo Bay",
      category: "beach",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      rating: 4.3,
      reviews: 178,
      price: "Free",
      features: "Secluded, Natural, Surf",
      location: "Cupecoy Area",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Secluded beach popular with surfers and nature lovers."
    },
    {
      id: 35,
      name: "Guana Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80",
      rating: 4.5,
      reviews: 267,
      price: "Free",
      features: "Surfing, Natural, Less Crowded",
      location: "Guana Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Wild Atlantic-facing beach popular with local surfers."
    },
    {
      id: 36,
      name: "Gibbs Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1566024287286-457247b70310?w=800&q=80",
      rating: 4.1,
      reviews: 145,
      price: "Free",
      features: "Quiet, Residential, Local Vibe",
      location: "Oyster Pond",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Quiet residential beach away from tourist crowds."
    },
    {
      id: 37,
      name: "Oyster Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      rating: 4.4,
      reviews: 198,
      price: "Free",
      features: "Calm Waters, Snorkeling, Family Friendly",
      location: "Oyster Pond",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Protected bay perfect for families with calm clear waters."
    },
    {
      id: 38,
      name: "Friar's Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      rating: 4.7,
      reviews: 389,
      price: "Free",
      features: "Beach Bars, Restaurants, Activities",
      location: "Friar's Bay",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Popular beach with excellent beach bars and water sports activities."
    },
    {
      id: 39,
      name: "Anse Marcel",
      category: "beach",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      rating: 4.6,
      reviews: 276,
      price: "Free",
      features: "Protected Bay, Marina, Calm",
      location: "Anse Marcel",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Sheltered bay with marina access and calm waters year-round."
    },
    {
      id: 40,
      name: "Petites Cayes",
      category: "beach",
      image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80",
      rating: 4.8,
      reviews: 167,
      price: "Free",
      features: "Secluded, Natural, Quiet",
      location: "Terres Basses",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Hidden tranquil beach with natural beauty and few visitors."
    },
    {
      id: 41,
      name: "Baie Longue",
      category: "beach",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
      rating: 4.7,
      reviews: 423,
      price: "Free",
      features: "Long Beach, Luxury Resorts, Sunset Views",
      location: "Terres Basses",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Mile-long pristine beach bordered by luxury resorts with stunning sunsets."
    },
    {
      id: 42,
      name: "Plum Bay",
      category: "beach",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
      rating: 4.5,
      reviews: 312,
      price: "Free",
      features: "Quiet, Natural, Good Swimming",
      location: "Terres Basses",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Peaceful beach with excellent swimming and natural surroundings."
    },
    {
      id: 43,
      name: "Baie aux Prunes",
      category: "beach",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      rating: 4.4,
      reviews: 189,
      price: "Free",
      features: "Secluded, Small, Natural",
      location: "Terres Basses",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Small secluded cove perfect for peaceful relaxation."
    },
    {
      id: 44,
      name: "Tintamarre Island",
      category: "beach",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      rating: 4.9,
      reviews: 445,
      price: "$$",
      features: "Boat Access, Snorkeling, Nature Reserve",
      location: "Off Orient Bay",
      side: "french",
      phone: "N/A",
      hours: "9:00 AM - 5:00 PM (boat schedule)",
      description: "Uninhabited nature reserve island with pristine beaches and exceptional snorkeling."
    },
    {
      id: 45,
      name: "Cul de Sac Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
      rating: 4.3,
      reviews: 223,
      price: "Free",
      features: "Boat Launch, Local, Quiet",
      location: "Cul de Sac",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Local beach with boat access to Pinel Island and authentic atmosphere."
    },
    {
      id: 46,
      name: "Le Galion Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80",
      rating: 4.6,
      reviews: 334,
      price: "Free",
      features: "Shallow Waters, Windsurfing, Family Friendly",
      location: "Baie de l'Embouchure",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Shallow protected bay ideal for families and windsurfing enthusiasts."
    },
    {
      id: 47,
      name: "Coconut Grove Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80",
      rating: 4.2,
      reviews: 178,
      price: "Free",
      features: "Quiet, Natural, Less Developed",
      location: "Near Le Galion",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Undeveloped beach with natural charm and tranquility."
    },
    {
      id: 48,
      name: "Long Beach (Baie Longue)",
      category: "beach",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      rating: 4.7,
      reviews: 456,
      price: "Free",
      features: "Nude Section, Long Stretch, Natural",
      location: "Western Coast",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Extensive beach with optional clothing-free areas and stunning natural setting."
    },
    {
      id: 49,
      name: "Nettle Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      rating: 4.1,
      reviews: 267,
      price: "Free",
      features: "Lagoon Side, Calm, Local",
      location: "Nettle Bay",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Lagoon-side beach with calm waters and local Caribbean atmosphere."
    },
    {
      id: 50,
      name: "Sandy Ground Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80",
      rating: 4.5,
      reviews: 389,
      price: "Free",
      features: "Restaurants, Beach Bars, Popular",
      location: "Marigot",
      side: "french",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Lively beach with excellent restaurants and vibrant beach bar scene."
    },
    {
      id: 51,
      name: "Bell Point",
      category: "beach",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
      rating: 4.0,
      reviews: 134,
      price: "Free",
      features: "Rocky, Snorkeling, Natural",
      location: "Pelican Key",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Rocky beach area popular with snorkelers and divers."
    },
    {
      id: 52,
      name: "Pelican Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      rating: 4.3,
      reviews: 223,
      price: "Free",
      features: "Resort Beach, Watersports, Family Friendly",
      location: "Simpson Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Resort-lined beach with water sports and family-friendly facilities."
    },
    {
      id: 53,
      name: "Divi Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
      rating: 4.4,
      reviews: 312,
      price: "Free",
      features: "Resort Beach, Protected, Snorkeling",
      location: "Little Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Protected resort beach with good snorkeling opportunities."
    },
    {
      id: 54,
      name: "Pointe Blanche Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      rating: 3.9,
      reviews: 156,
      price: "Free",
      features: "Industrial Area, Local, Quiet",
      location: "Point Blanche",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Less touristy beach popular with locals near the industrial area."
    },
    {
      id: 55,
      name: "Great Salt Pond Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
      rating: 4.0,
      reviews: 189,
      price: "Free",
      features: "Salt Pond, Natural, Bird Watching",
      location: "Philipsburg Area",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Beach adjacent to salt pond with bird watching opportunities."
    },
    {
      id: 56,
      name: "Cole Bay Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80",
      rating: 4.1,
      reviews: 201,
      price: "Free",
      features: "Local, Calm Waters, Residential",
      location: "Cole Bay",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Local residential beach with calm lagoon waters."
    },
    {
      id: 57,
      name: "Beacon Hill Beach",
      category: "beach",
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      rating: 3.8,
      reviews: 112,
      price: "Free",
      features: "Small, Local, Quiet",
      location: "Beacon Hill",
      side: "dutch",
      phone: "N/A",
      hours: "Open 24/7",
      description: "Small neighborhood beach away from tourist areas."
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: MapPin },
    { id: 'restaurant', name: 'Restaurants', icon: Utensils },
    { id: 'hotel', name: 'Hotels', icon: Hotel },
    { id: 'store', name: 'Stores', icon: ShoppingBag },
    { id: 'beach', name: 'Beaches', icon: MapPin }
  ];

  // Combine static places with user-added places
  const allPlaces = [...places, ...userPlaces];

  const filteredPlaces = allPlaces.filter(place => {
    const matchesCategory = activeCategory === 'all' || place.category === activeCategory;
    const matchesSide = activeSide === 'all' || place.side === activeSide;
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSide && matchesSearch;
  });

  const handleBooking = () => {
    if (!bookingData.date || !bookingData.time) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Booking confirmed for ${selectedPlace.name}!\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nGuests: ${bookingData.guests}`);
    setShowBooking(false);
    setSelectedPlace(null);
    setBookingData({ date: '', time: '', guests: 2 });
  };

  const handleAddComment = () => {
    if (!newComment.name || !newComment.text) {
      alert('Please fill in your name and comment');
      return;
    }
    
    const placeId = selectedPlace.id;
    const comment = {
      id: Date.now(),
      ...newComment,
      date: new Date().toLocaleDateString()
    };
    
    setComments(prev => ({
      ...prev,
      [placeId]: [...(prev[placeId] || []), comment]
    }));
    
    setNewComment({ name: '', rating: 5, text: '' });
  };

  return (
    <div className="app-container">
      {/* Header - Exact TripAdvisor Style */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo on the left */}
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000',
            margin: 0
          }}>
            🏝️ SXM Travel Guide
          </h1>

          {/* Sign In button on the right */}
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            {user ? (
              <>
                <span style={{fontSize: '14px', color: '#000'}}>👤 {user.email}</span>
                <button
                  onClick={() => setShowAddPlace(true)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <Plus size={16} style={{display: 'inline', marginRight: '4px', verticalAlign: 'middle'}} />
                  Add Place
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                style={{
                  background: '#000',
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Where to? Section */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 16px 20px'
      }}>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '30px',
          color: '#000'
        }}>
          Where to?
        </h2>

        {/* Category Tabs - TripAdvisor style with icons */}
        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
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

        {/* Search Bar - TripAdvisor style */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 30px',
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search 
              size={24} 
              style={{
                position: 'absolute',
                left: '20px',
                color: '#999'
              }} 
            />
            <input
              type="text"
              placeholder="Places to go, things to do, hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Side Toggle */}
        <div className="side-toggle" style={{marginBottom: '30px'}}>
          <button
            onClick={() => setActiveSide('all')}
            className={`side-btn ${activeSide === 'all' ? 'active-all' : 'inactive'}`}
          >
            🏝️ All SXM
          </button>
          <button
            onClick={() => setActiveSide('dutch')}
            className={`side-btn ${activeSide === 'dutch' ? 'active-dutch' : 'inactive'}`}
          >
            🇳🇱 Dutch Side
          </button>
          <button
            onClick={() => setActiveSide('french')}
            className={`side-btn ${activeSide === 'french' ? 'active-french' : 'inactive'}`}
          >
            🇫🇷 French Side
          </button>
        </div>
      </div>

      {/* Places Grid */}
      <div className="places-grid">
        {filteredPlaces.map(place => (
          <div
            key={place.id}
            className="place-card"
            onClick={() => setSelectedPlace(place)}
          >
            <div className="place-card-image">
              <img src={place.image} alt={place.name} />
              <div className="place-card-price">{place.price}</div>
            </div>

            <div className="place-card-content">
              <div className="place-card-header">
                <h3>{place.name}</h3>
                {place.category === 'restaurant' && <Utensils style={{color: '#f97316'}} size={20} />}
                {place.category === 'hotel' && <Hotel style={{color: '#3b82f6'}} size={20} />}
                {place.category === 'store' && <ShoppingBag style={{color: '#a855f7'}} size={20} />}
                {place.category === 'beach' && <span style={{fontSize: '24px'}}>🏖️</span>}
              </div>

              <div className="place-card-rating">
                <div className="rating-badge">
                  <Star style={{fill: '#fbbf24', color: '#fbbf24'}} size={16} />
                  <span>{place.rating}</span>
                </div>
                <span className="reviews-count">({place.reviews} reviews)</span>
              </div>

              <div className="place-card-location">
                <MapPin style={{color: '#3b82f6'}} size={16} />
                <span>{place.location}</span>
              </div>

              {place.cuisine && (
                <p className="place-card-info">{place.cuisine}</p>
              )}
              {place.amenities && (
                <p className="place-card-info">{place.amenities}</p>
              )}
              {place.specialty && (
                <p className="place-card-info">{place.specialty}</p>
              )}
              {place.features && (
                <p className="place-card-info">🏖️ {place.features}</p>
              )}

              <button
                className="place-card-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlace(place);
                  if (place.category !== 'beach') {
                    setShowBooking(true);
                  }
                }}
              >
                {place.category === 'hotel' ? 'Book Room' : place.category === 'restaurant' ? 'Reserve Table' : place.category === 'beach' ? 'View Details' : 'Visit Store'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedPlace && !showBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-image">
              <img src={selectedPlace.image} alt={selectedPlace.name} />
              <button
                onClick={() => setSelectedPlace(null)}
                className="modal-close-btn"
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <h2>{selectedPlace.name}</h2>

              <div className="modal-rating">
                <div className="rating-badge">
                  <Star style={{fill: '#fbbf24', color: '#fbbf24'}} size={20} />
                  <span style={{fontWeight: 'bold', fontSize: '1.125rem'}}>{selectedPlace.rating}</span>
                </div>
                <span style={{color: '#4b5563'}}>({selectedPlace.reviews} reviews)</span>
                <span style={{fontWeight: 'bold', fontSize: '1.125rem'}}>{selectedPlace.price}</span>
              </div>

              <p className="modal-description">{selectedPlace.description}</p>

              <div className="modal-details">
                <div className="modal-detail-item">
                  <MapPin style={{color: '#3b82f6'}} size={20} />
                  <span>{selectedPlace.location}</span>
                </div>
                <div className="modal-detail-item">
                  <Phone style={{color: '#10b981'}} size={20} />
                  <span>{selectedPlace.phone}</span>
                </div>
                {selectedPlace.hours && (
                  <div className="modal-detail-item">
                    <Clock style={{color: '#f97316'}} size={20} />
                    <span>{selectedPlace.hours}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowBooking(true)}
                className="modal-book-btn"
              >
                {selectedPlace.category === 'hotel' ? 'Book Now' : selectedPlace.category === 'restaurant' ? 'Reserve Table' : selectedPlace.category === 'beach' ? 'Get Directions' : 'Get Directions'}
              </button>

              {/* Comments Section */}
              <div className="comments-section">
                <h3>Reviews & Comments</h3>
                
                {/* Add Comment Form */}
                <div className="comment-form">
                  <h4>Leave a Review</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="form-input"
                      value={newComment.name}
                      onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setNewComment({...newComment, rating: star})}
                          className="star-btn"
                        >
                          <Star
                            size={32}
                            style={{
                              fill: star <= newComment.rating ? '#fbbf24' : 'transparent',
                              color: star <= newComment.rating ? '#fbbf24' : '#d1d5db'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea
                      placeholder="Share your experience..."
                      rows="4"
                      className="form-textarea"
                      value={newComment.text}
                      onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                    />
                  </div>

                  <button
                    onClick={handleAddComment}
                    className="modal-book-btn"
                  >
                    Post Review
                  </button>
                </div>

                {/* Comments List */}
                <div className="comments-list">
                  {(comments[selectedPlace.id] || []).length === 0 ? (
                    <p className="no-comments">No reviews yet. Be the first to review!</p>
                  ) : (
                    (comments[selectedPlace.id] || []).map(comment => (
                      <div key={comment.id} className="comment-card">
                        <div className="comment-header">
                          <div className="comment-author">
                            <h5>{comment.name}</h5>
                            <p className="comment-date">{comment.date}</p>
                          </div>
                          <div className="comment-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={16}
                                style={{
                                  fill: star <= comment.rating ? '#fbbf24' : 'transparent',
                                  color: star <= comment.rating ? '#fbbf24' : '#d1d5db'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedPlace && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <div className="booking-header">
              <h3>
                {selectedPlace.category === 'hotel' ? 'Book Room' : 'Reserve Table'}
              </h3>
              <button
                onClick={() => setShowBooking(false)}
                style={{background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280'}}
              >
                <X size={24} />
              </button>
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label className="form-label">
                  <Calendar style={{display: 'inline', marginRight: '8px'}} size={16} />
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock style={{display: 'inline', marginRight: '8px'}} size={16} />
                  Time
                </label>
                <input
                  type="time"
                  required
                  className="form-input"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users style={{display: 'inline', marginRight: '8px'}} size={16} />
                  {selectedPlace.category === 'hotel' ? 'Guests' : 'Party Size'}
                </label>
                <select
                  className="form-input"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleBooking}
                className="booking-submit-btn"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onSuccess={(user) => setUser(user)}
        />
      )}

      {/* Add Place Modal */}
      {showAddPlace && user && (
        <AddPlace
          user={user}
          onClose={() => setShowAddPlace(false)}
          onAdd={handleAddPlace}
        />
      )}
    </div>
  );
};

export default App;