import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL as API_BASE } from '../config';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---- Step 1: request an OTP for the given email ----
  const sendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to send OTP');
      }

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- Step 2: verify the OTP and log in ----
  const verifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // Only the single configured admin account may enter the dashboard.
      if (data.role !== 'admin') {
        throw new Error('This account is not authorized for admin access');
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_email', data.email);
      sessionStorage.setItem('admin_authed', '1');

      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    setOtp('');
    sendOTP({ preventDefault: () => {} });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f1114', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(234,88,12,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(71,85,105,0.1) 0%, transparent 50%)',
      }} />

      <div style={{
        background: '#1a1d21', border: '1px solid rgba(234,88,12,0.2)', borderRadius: 16,
        padding: '2.5rem 2rem', width: '100%', maxWidth: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, background: 'rgba(234,88,12,0.15)', border: '1px solid rgba(234,88,12,0.3)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto .75rem',
          }}>🛡️</div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800,
            color: '#EA580C', letterSpacing: 1,
          }}>STYRON™ TSM</div>
          <div style={{ color: '#6b7280', fontSize: '.8rem', marginTop: '.25rem' }}>
            Admin Portal · Restricted Access
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#EA580C' }} />
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: step === 2 ? '#EA580C' : 'rgba(255,255,255,0.1)' }} />
        </div>

        {step === 1 && (
          <form onSubmit={sendOTP}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#9ca3af', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Email Address
              </label>
              <input
                type="email"
                autoFocus
                required
                placeholder="admin@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                style={{
                  width: '100%', background: '#0f1114', border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 10, padding: '.85rem 1rem', color: '#f9fafb', fontSize: '1rem',
                  fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', transition: '.2s',
                }}
              />
              {error && (
                <div style={{ color: '#ef4444', fontSize: '.78rem', marginTop: '.5rem', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#92400e' : 'linear-gradient(135deg, #EA580C, #fb7c3c)',
                border: 'none', borderRadius: 10, padding: '.9rem', color: '#fff',
                fontWeight: 800, fontSize: '1rem', fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                transition: '.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
              }}
            >
              {loading ? (
                <><span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⟳</span> Sending...</>
              ) : (
                <>📧 Send OTP</>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOTP}>
            <p style={{ color: '#9ca3af', fontSize: '.8rem', marginBottom: '1rem' }}>
              Enter the 6-digit code sent to <strong style={{ color: '#f9fafb' }}>{email}</strong>
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#9ca3af', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Enter OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                required
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                style={{
                  width: '100%', background: '#0f1114', border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 10, padding: '.85rem 1rem', color: '#f9fafb', fontSize: '1.1rem',
                  fontFamily: 'inherit', letterSpacing: '4px', textAlign: 'center', boxSizing: 'border-box',
                  outline: 'none', transition: '.2s',
                }}
              />
              {error && (
                <div style={{ color: '#ef4444', fontSize: '.78rem', marginTop: '.5rem', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{
                width: '100%', background: loading ? '#92400e' : 'linear-gradient(135deg, #EA580C, #fb7c3c)',
                border: 'none', borderRadius: 10, padding: '.9rem', color: '#fff',
                fontWeight: 800, fontSize: '1rem', fontFamily: 'inherit',
                cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                opacity: (loading || otp.length !== 6) ? 0.7 : 1,
                transition: '.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
              }}
            >
              {loading ? (
                <><span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⟳</span> Verifying...</>
              ) : (
                <>🔐 Verify & Enter Admin Panel</>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ← Change email
              </button>
              <button
                type="button"
                onClick={resendOTP}
                disabled={loading}
                style={{ background: 'none', border: 'none', color: '#EA580C', fontSize: '.78rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: '#4b5563', fontSize: '.78rem', textDecoration: 'none' }}>
            ← Back to website
          </a>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
