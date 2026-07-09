import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { API_URL } from '../config';

export default function LoginPage() {
  const { login }              = useAuth();
  const { setCartOpen, items } = useCart();
  const navigate               = useNavigate();
  const location               = useLocation();
  const fromCheckout           = location.state?.from === 'checkout';

  const [step, setStep]       = useState('email'); // 'email' | 'otp'
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // ── Step 1: send OTP ─────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_URL}/api/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Save token
      localStorage.setItem('styron_token', data.token);

      // Set user in context → navbar shows avatar immediately
      login(name || email.split('@')[0], email);

      // Redirect
      if (fromCheckout && items.length > 0) {
        setCartOpen(true);
        navigate('/');
      } else {
        navigate('/');           // ← always goes to homepage
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inner-page">
      <div className="page-header">
        <div className="section-label">Account</div>
        <h1>Welcome <span className="accent">Back</span></h1>
        <p>
          {step === 'email'
            ? fromCheckout
              ? 'Please log in to continue to payment for the items in your cart.'
              : 'Enter your email — we\'ll send you a one-time login code.'
            : `We sent a 6-digit code to ${email}`}
        </p>
      </div>

      <div className="form-card login-card">
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#e53e3e',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        {/* ── Email + Name step ── */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp}>
            <h3>Log In</h3>

            <div className="form-group">
              <label>Full Name <span style={{ color: '#a8b5c8', fontWeight: 400 }}>(optional)</span></label>
              <input
                placeholder="e.g. Trisha Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                required
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button className="btn-form" type="submit" disabled={loading}>
              {loading ? 'Sending code…' : 'Send OTP'}
            </button>

            <p className="form-promise" style={{ marginTop: '1rem' }}>
              <span>🔒</span>
              <span>We'll email you a one-time code — no password needed.</span>
            </p>
          </form>
        )}

        {/* ── OTP step ── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <h3>Enter your code</h3>

            <div className="form-group">
              <label>6-digit code</label>
              <input
                required
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="e.g. 483921"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                style={{ fontSize: '1.5rem', letterSpacing: '8px',
                         textAlign: 'center', fontWeight: 700 }}
              />
            </div>

            <button
              className="btn-form"
              type="submit"
              disabled={loading || code.length !== 6}
            >
              {loading ? 'Verifying…' : 'Verify & Log In'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('email'); setCode(''); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#a8b5c8',
                       fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.75rem',
                       display: 'block', width: '100%', fontFamily: 'inherit' }}
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}