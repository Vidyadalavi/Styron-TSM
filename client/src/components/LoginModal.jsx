import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { API_URL } from '../config';

export default function LoginModal({ open, onClose }) {
  const { login }              = useAuth();
  const { setCartOpen, items } = useCart();
  const navigate               = useNavigate();

  const [step, setStep]               = useState('email');
  const [email, setEmail]             = useState('');
  const [code, setCode]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      setStep('email'); setEmail(''); setCode('');
      setError(''); setLoading(false); setResendTimer(0);
    }
  }, [open]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  if (!open) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('otp');
      setResendTimer(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('styron_token', data.token);
      login(email.split('@')[0], email);
      onClose();
      navigate('/');
      if (items.length > 0) setCartOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ORANGE = '#c8490a';

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    color: '#1a202c',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    transition: 'border-color .2s',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 900,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* Card */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 901,
        width: '100%', maxWidth: 480,
        background: '#ffffff',
        borderRadius: 16,
        padding: '2.25rem 2.5rem 2rem',
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
        fontFamily: "'Inter', sans-serif",
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'none', border: 'none',
            fontSize: '1.3rem', color: '#718096',
            cursor: 'pointer', lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '2rem', fontWeight: 800,
            color: '#1a202c', margin: '0 0 0.35rem',
          }}>
            Welcome <span style={{ color: ORANGE }}>Back</span>
          </h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', margin: 0 }}>
            Login with your email to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff5f5', border: '1px solid #feb2b2',
            color: '#c53030', borderRadius: 8,
            padding: '0.7rem 1rem', marginBottom: '1.25rem',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        <div style={{ marginBottom: '1.5rem' }}>

          {/* Step divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.78rem', color: '#a0aec0', whiteSpace: 'nowrap' }}>
              Step 1 of 2
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleSendOtp}>
            <label style={{
              display: 'block', fontWeight: 600,
              fontSize: '0.9rem', color: '#2d3748',
              marginBottom: '0.5rem',
            }}>
              Email Address
            </label>
            <input
              type="email"
              required
              autoFocus={step === 'email'}
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={step === 'otp'}
              style={{
                ...inputStyle,
                marginBottom: '1rem',
                background: step === 'otp' ? '#f7fafc' : '#fff',
                color: step === 'otp' ? '#718096' : '#1a202c',
              }}
              onFocus={e => e.target.style.borderColor = ORANGE}
              onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
            />

            {step === 'email' && (
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '0.9rem',
                  background: loading ? '#e07a3a' : ORANGE,
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: '1rem', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', letterSpacing: '0.3px',
                  transition: 'background .2s',
                }}
                onMouseEnter={e => { if (!loading) e.target.style.background = '#b03d06'; }}
                onMouseLeave={e => { if (!loading) e.target.style.background = ORANGE; }}
              >
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            )}

            {step === 'otp' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={handleSendOtp}
                  style={{
                    background: 'none', border: 'none',
                    color: resendTimer > 0 ? '#a0aec0' : ORANGE,
                    fontSize: '0.82rem', fontWeight: 600,
                    cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', padding: 0,
                  }}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ── Step 2: OTP ── */}
        <div style={{ opacity: step === 'otp' ? 1 : 0.45, transition: 'opacity .3s' }}>

          {/* Step divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.78rem', color: '#a0aec0', whiteSpace: 'nowrap' }}>
              Step 2 of 2
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleVerifyOtp}>
            <label style={{
              display: 'block', fontWeight: 600,
              fontSize: '0.9rem', color: '#2d3748',
              marginBottom: '0.5rem',
            }}>
              Enter OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={code}
              disabled={step === 'email'}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              style={{
                ...inputStyle,
                marginBottom: '0.4rem',
                background: step === 'email' ? '#f7fafc' : '#fff',
              }}
              onFocus={e => e.target.style.borderColor = ORANGE}
              onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
            />
            <p style={{ fontSize: '0.8rem', color: '#a0aec0', margin: '0 0 1rem' }}>
              Enter the 6-digit code sent to your email
            </p>

            <button
              type="submit"
              disabled={step === 'email' || loading || code.length !== 6}
              style={{
                width: '100%', padding: '0.9rem',
                background: 'transparent',
                color: ORANGE,
                border: `2px solid ${ORANGE}`,
                borderRadius: 8,
                fontSize: '1rem', fontWeight: 700,
                cursor: (step === 'email' || loading || code.length !== 6)
                  ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: (step === 'email') ? 0.5 : 1,
                transition: 'all .2s',
                marginBottom: '0.75rem',
              }}
              onMouseEnter={e => {
                if (step === 'otp' && code.length === 6 && !loading) {
                  e.target.style.background = ORANGE;
                  e.target.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.color = ORANGE;
              }}
            >
              {loading ? 'Verifying…' : 'Verify & Login'}
            </button>

            {step === 'otp' && (
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setCode(''); setError(''); }}
                  style={{
                    background: 'none', border: 'none',
                    color: ORANGE, fontSize: '0.85rem',
                    fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  ← Change Email
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </>
  );
}