import React, { useState } from 'react';
import { X } from 'lucide-react';

const Auth = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Simulate successful login/signup
    const user = { email, id: Date.now() };
    localStorage.setItem('user', JSON.stringify(user));
    onSuccess(user);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="booking-header">
          <h3>{isLogin ? 'Sign In' : 'Sign Up'}</h3>
          <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280'}}>
            <X size={24} />
          </button>
        </div>

        <div className="booking-form">
          {error && <p style={{color: '#ef4444', marginBottom: '12px', fontSize: '14px'}}>{error}</p>}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <button onClick={handleSubmit} className="booking-submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <p style={{textAlign: 'center', marginTop: '12px', color: '#6b7280', fontSize: '14px'}}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600'}}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;