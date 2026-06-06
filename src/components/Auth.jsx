import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Auth = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!isLogin && !displayName) { setError('Please enter your name'); return; }

    setLoading(true);
    try {
      if (isLogin) {
        // Sign in
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || userDoc.data()?.displayName || email.split('@')[0]
        };
        onSuccess(userData);
        onClose();
      } else {
        // Sign up
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email,
          displayName,
          createdAt: new Date().toISOString(),
          favorites: []
        });

        const userData = { uid: result.user.uid, email, displayName };
        onSuccess(userData);
        onClose();
      }
    } catch (e) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (e.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (e.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(e.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <div className="booking-header">
          <h3>{isLogin ? 'Sign In' : 'Sign Up'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={24} />
          </button>
        </div>

        <div className="booking-form">
          {error && (
            <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={displayName}
                onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
          </div>

          <button onClick={handleSubmit} disabled={loading} className="booking-submit-btn">
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '12px', color: '#6b7280', fontSize: '14px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;