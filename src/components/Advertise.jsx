import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, CreditCard, Image, Type, MousePointer, Calendar, Crown } from 'lucide-react';

const BANNER_TYPES = [
  {
    id: 'top',
    name: 'Top Banner',
    emoji: '📢',
    description: 'Full-width banner displayed at the very top of the site. Maximum visibility for every visitor.',
    reach: 'Seen by 100% of visitors',
    price: 20,
    perMonth: true,
    preview: (
      <div style={{ width: '100%', height: '60px', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px' }}>
        YOUR AD HERE — Full Width
      </div>
    )
  },
  {
    id: 'card',
    name: 'Card Banner',
    emoji: '🃏',
    description: 'Sponsored card injected between place cards in the main grid. Blends naturally with content.',
    reach: 'Seen by users browsing places',
    price: 20,
    perMonth: true,
    preview: (
      <div style={{ width: '100%', height: '100px', background: 'linear-gradient(135deg, #f97316, #ef4444)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', gap: '4px' }}>
        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>SPONSORED</span>
        <span style={{ fontWeight: '700', fontSize: '13px' }}>Your Business Name</span>
      </div>
    )
  },
  {
    id: 'sidebar',
    name: 'Sidebar Banner',
    emoji: '📌',
    description: 'Sticky banner on the right side of the page. Always visible while users scroll.',
    reach: 'Persistent visibility while browsing',
    price: 20,
    perMonth: true,
    preview: (
      <div style={{ width: '100%', height: '100px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', gap: '4px' }}>
        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>SPONSORED</span>
        <span style={{ fontWeight: '700', fontSize: '13px' }}>Sidebar Ad</span>
      </div>
    )
  },
  {
    id: 'popup',
    name: 'Popup Banner',
    emoji: '💥',
    description: 'Eye-catching popup shown to visitors when they first arrive. Impossible to miss.',
    reach: 'First thing visitors see',
    price: 20,
    perMonth: true,
    preview: (
      <div style={{ width: '100%', height: '100px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', gap: '4px', border: '3px solid #34d399' }}>
        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>POPUP</span>
        <span style={{ fontWeight: '700', fontSize: '13px' }}>High Impact Ad</span>
      </div>
    )
  },
  {
    id: 'featured',
    name: 'Featured Sponsor',
    emoji: '⭐',
    description: 'Your business gets a permanent premium spotlight card at the very top of the listings — above everything else. The most visible spot on the site.',
    reach: 'Top of every visitor\'s screen',
    price: 50,
    perMonth: true,
    preview: (
      <div style={{ width: '100%', height: '80px', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '2px solid #f59e0b' }}>
        <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏆</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px' }}>⭐ Featured Sponsor</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>Your Business Name</p>
          <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Prime placement — always #1</p>
        </div>
      </div>
    )
  }
];

const STEPS = ['Choose Type', 'Customize', 'Checkout', 'Confirmation'];

const emptyBanner = {
  title: '',
  text: '',
  buttonLabel: '',
  buttonLink: '',
  startDate: '',
  endDate: '',
  image: null,
  imagePreview: null,
  businessName: '',
  businessUrl: '',
  contactEmail: ''
};

const emptyCard = {
  name: '',
  number: '',
  expiry: '',
  cvv: '',
  email: ''
};

const Advertise = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [banner, setBanner] = useState(emptyBanner);
  const [card, setCard] = useState(emptyCard);
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const selectedBannerType = BANNER_TYPES.find(b => b.id === selectedType);
  const isFeatured = selectedType === 'featured';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setBanner({ ...banner, image: file, imagePreview: URL.createObjectURL(file) });
  };

  const formatCardNumber = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const validateStep1 = () => selectedType !== null;

  const validateStep2 = () => {
    const e = {};
    if (!banner.title) e.title = 'Title is required';
    if (isFeatured) {
      if (!banner.businessName) e.businessName = 'Business name is required';
      if (!banner.contactEmail) e.contactEmail = 'Contact email is required';
    } else {
      if (!banner.startDate) e.startDate = 'Start date is required';
      if (!banner.endDate) e.endDate = 'End date is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!card.email) e.email = 'Email is required';
    if (!card.name) e.name = 'Name is required';
    if (card.number.replace(/\s/g, '').length < 16) e.number = 'Valid card number required';
    if (card.expiry.length < 5) e.expiry = 'Valid expiry required';
    if (card.cvv.length < 3) e.cvv = 'Valid CVV required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    if (step === 2 && !validateStep3()) return;
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep(s => s - 1); };

  const getMonths = () => {
    if (isFeatured) return 1;
    if (!banner.startDate || !banner.endDate) return 1;
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)));
  };

  const total = isFeatured ? 50 : getMonths() * 20;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', position: 'sticky', top: 0, background: 'white', zIndex: 1, borderRadius: '20px 20px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>🎯 Advertise with Us</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Banners from $20/mo · Featured Sponsor $50/mo</p>
            </div>
            <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i < step ? '#10b981' : i === step ? '#000' : '#e5e7eb', color: i <= step ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: i === step ? '700' : '400', color: i === step ? '#000' : '#9ca3af', whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? '#10b981' : '#e5e7eb', margin: '0 8px' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 28px 28px' }}>

          {/* STEP 1 - Choose Type */}
          {step === 0 && (
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>Select your advertising type</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {BANNER_TYPES.map(type => (
                  <div key={type.id} onClick={() => setSelectedType(type.id)}
                    style={{
                      border: `2px solid ${selectedType === type.id ? (type.id === 'featured' ? '#f59e0b' : '#000') : '#e5e7eb'}`,
                      borderRadius: '12px', padding: '16px', cursor: 'pointer',
                      background: selectedType === type.id ? (type.id === 'featured' ? '#fffbeb' : '#f9fafb') : 'white',
                      transition: 'all 0.2s'
                    }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{type.emoji}</span>
                            <span style={{ fontWeight: '700', fontSize: '15px' }}>{type.name}</span>
                            {type.id === 'featured' && (
                              <span style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', color: 'white', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px' }}>PREMIUM</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '800', fontSize: '16px', color: type.id === 'featured' ? '#d97706' : '#000' }}>${type.price}</span>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>/mo</span>
                            {selectedType === type.id && (
                              <div style={{ width: '22px', height: '22px', background: type.id === 'featured' ? '#f59e0b' : '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Check size={13} color="white" />
                              </div>
                            )}
                          </div>
                        </div>
                        <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280' }}>{type.description}</p>
                        <span style={{ fontSize: '11px', background: type.id === 'featured' ? '#fffbeb' : '#f0fdf4', color: type.id === 'featured' ? '#d97706' : '#16a34a', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
                          📊 {type.reach}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>{type.preview}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 - Customize */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: isFeatured ? '#fffbeb' : '#f9fafb', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: isFeatured ? '1px solid #f59e0b' : 'none' }}>
                <span style={{ fontSize: '20px' }}>{selectedBannerType?.emoji}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>{selectedBannerType?.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>${selectedBannerType?.price}/month</p>
                </div>
              </div>

              {isFeatured && (
                <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '14px', border: '1px solid #fde68a', fontSize: '13px', color: '#92400e' }}>
                  ⭐ <strong>Featured Sponsor</strong> — Your listing will be permanently pinned at the very top of our homepage. After payment, our team will review and activate it within 24 hours.
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>
                  {isFeatured ? 'Business / Listing Name *' : 'Banner Title *'}
                </label>
                <input type="text" value={banner.title} onChange={e => setBanner({ ...banner, title: e.target.value })}
                  placeholder={isFeatured ? 'e.g. Ocean Lounge Restaurant' : 'e.g. Best Restaurant in SXM!'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.title ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                {errors.title && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.title}</p>}
              </div>

              {isFeatured ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Business Name *</label>
                    <input type="text" value={banner.businessName} onChange={e => setBanner({ ...banner, businessName: e.target.value })}
                      placeholder="Your registered business name"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.businessName ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                    {errors.businessName && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.businessName}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Contact Email *</label>
                    <input type="email" value={banner.contactEmail} onChange={e => setBanner({ ...banner, contactEmail: e.target.value })}
                      placeholder="your@business.com"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.contactEmail ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                    {errors.contactEmail && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Website URL (optional)</label>
                    <input type="text" value={banner.businessUrl} onChange={e => setBanner({ ...banner, businessUrl: e.target.value })}
                      placeholder="https://yourbusiness.com"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Description</label>
                    <textarea value={banner.text} onChange={e => setBanner({ ...banner, text: e.target.value })}
                      placeholder="Brief description of your business..." rows={3}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Description</label>
                    <textarea value={banner.text} onChange={e => setBanner({ ...banner, text: e.target.value })}
                      placeholder="Short description or tagline..." rows={2}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Button Text</label>
                      <input type="text" value={banner.buttonLabel} onChange={e => setBanner({ ...banner, buttonLabel: e.target.value })}
                        placeholder="e.g. Book Now"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Button Link</label>
                      <input type="text" value={banner.buttonLink} onChange={e => setBanner({ ...banner, buttonLink: e.target.value })}
                        placeholder="https://yoursite.com"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Start Date *</label>
                      <input type="date" value={banner.startDate} min={today}
                        onChange={e => setBanner({ ...banner, startDate: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.startDate ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                      {errors.startDate && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.startDate}</p>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>End Date *</label>
                      <input type="date" value={banner.endDate} min={banner.startDate || today}
                        onChange={e => setBanner({ ...banner, endDate: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.endDate ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                      {errors.endDate && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.endDate}</p>}
                    </div>
                  </div>
                  {banner.startDate && banner.endDate && (
                    <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#166534' }}>
                      📅 Duration: <strong>{getMonths()} month{getMonths() > 1 ? 's' : ''}</strong> — Total: <strong>${total}</strong>
                    </div>
                  )}
                </>
              )}

              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>
                  {isFeatured ? 'Business Logo / Photo' : 'Banner Image'}
                </label>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
                {banner.imagePreview && (
                  <img src={banner.imagePreview} alt="preview"
                    style={{ marginTop: '10px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                )}
              </div>
            </div>
          )}

          {/* STEP 3 - Checkout */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700' }}>Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                  <span>{selectedBannerType?.name}</span>
                  <span>${selectedBannerType?.price}/mo</span>
                </div>
                {!isFeatured && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', color: '#6b7280' }}>
                    <span>Duration</span>
                    <span>{getMonths()} month{getMonths() > 1 ? 's' : ''}</span>
                  </div>
                )}
                {isFeatured && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', color: '#6b7280' }}>
                    <span>Placement</span>
                    <span>Top of homepage</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px' }}>
                  <span>Total</span>
                  <span style={{ color: isFeatured ? '#d97706' : '#000' }}>${total}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Email Address</label>
                <input type="email" value={card.email} onChange={e => setCard({ ...card, email: e.target.value })}
                  placeholder="your@email.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.email}</p>}
              </div>

              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} color="#6b7280" />
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Card Information</span>
                </div>
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: '#374151' }}>Cardholder Name</label>
                    <input type="text" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="John Smith"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                    {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: '#374151' }}>Card Number</label>
                    <input type="text" value={card.number} onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456" maxLength={19}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.number ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box', letterSpacing: '1px' }} />
                    {errors.number && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.number}</p>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: '#374151' }}>Expiry Date</label>
                      <input type="text" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                        placeholder="MM/YY" maxLength={5}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.expiry ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                      {errors.expiry && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.expiry}</p>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: '#374151' }}>CVV</label>
                      <input type="text" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123" maxLength={4}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${errors.cvv ? '#ef4444' : '#e5e7eb'}`, fontSize: '14px', boxSizing: 'border-box' }} />
                      {errors.cvv && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                🔒 This is a demo checkout. No real payment will be processed.
              </p>
            </div>
          )}

          {/* STEP 4 - Confirmation */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '5rem', marginBottom: '16px' }}>{isFeatured ? '👑' : '🎉'}</div>
              <h3 style={{ margin: '0 0 12px', fontSize: '1.6rem', fontWeight: '800' }}>
                {isFeatured ? 'Featured Request Received!' : "You're all set!"}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
                {isFeatured
                  ? <>Your <strong>Featured Sponsor</strong> request has been received.<br />Our team will review your business and activate your featured placement within <strong>24 hours</strong>.<br />Confirmation sent to <strong>{card.email}</strong>.</>
                  : <>Your <strong>{selectedBannerType?.name}</strong> ad request has been received.<br />Our team will review and activate it within <strong>24 hours</strong>.<br />Confirmation sent to <strong>{card.email}</strong>.</>
                }
              </p>

              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700' }}>Summary</h4>
                {[
                  ['Type', selectedBannerType?.name],
                  ['Title', banner.title],
                  isFeatured ? ['Business', banner.businessName] : ['Duration', `${getMonths()} month${getMonths() > 1 ? 's' : ''}`],
                  isFeatured ? ['Contact', banner.contactEmail] : ['Start', banner.startDate],
                  !isFeatured && ['End', banner.endDate],
                  ['Total Paid', `$${total}`]
                ].filter(Boolean).map(([label, value]) => value && (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#6b7280' }}>{label}</span>
                    <span style={{ fontWeight: '600' }}>{value}</span>
                  </div>
                ))}
              </div>

              <button onClick={onClose} style={{ background: '#000', color: 'white', border: 'none', borderRadius: '50px', padding: '14px 40px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                Back to Site
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {step > 0 && (
                <button onClick={handleBack}
                  style={{ background: '#f3f4f6', border: 'none', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              <button onClick={handleNext}
                style={{ flex: 1, background: isFeatured && step === 2 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : '#000', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {step === 2 ? `Pay $${total}` : 'Continue'}
                {step < 2 && <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advertise;