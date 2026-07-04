import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { count, setCartOpen } = useCart();
  const { user, logout }       = useAuth();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const menuRef  = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      <nav>
        <NavLink to="/" className="logo">STYRON<span>™</span> TSM</NavLink>
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/products">Product</NavLink></li>
          <li><NavLink to="/estimator">Estimator</NavLink></li>
          <li><NavLink to="/quotation">Quotation</NavLink></li>
          <li><NavLink to="/track">Track</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>

        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
          <button className="cart-nav-btn" onClick={() => setCartOpen(true)} title="View Cart">
            🛒
            {count > 0 && <span className="cart-nav-badge">{count}</span>}
          </button>

          <NavLink to="/quotation" className="nav-cta">Request Quote</NavLink>

          {user ? (
            <div className="user-menu" ref={menuRef}>
              <button className="user-avatar-btn" onClick={() => setMenuOpen(o => !o)}>
                <span className="user-avatar">{user.initial}</span>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span className="user-caret">▾</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <NavLink to="/quotation" onClick={() => setMenuOpen(false)}>My Quotations</NavLink>
                  <NavLink to="/track"     onClick={() => setMenuOpen(false)}>My Orders</NavLink>
                  <button
                    className="user-dropdown-logout"
                    onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
  className="user-login-link"
  onClick={() => setLoginOpen(true)}
  style={{
    background: '#c8490a',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    padding: '0.5rem 1.25rem',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '0.9rem',
    fontFamily: 'inherit',
  }}
>
  Login
</button>
          )}
        </div>
      </nav>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}