import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  // Secret: click the copyright symbol (©) 3 times quickly to open admin login
  const handleSecretClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setClickCount(0);
      navigate('/admin-login');
    }
    // Reset after 2 seconds if not completed
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo" style={{ display: 'block', marginBottom: '1rem' }}>STYRON<span>™</span> TSM</div>
          <p>Steel Reinforcement Solutions for India's construction industry. Precision-engineered stirrups and steel products built for strength, durability, and reliability.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/#home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/#applications">Applications</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Products</h4>
          <ul>
            <li><a href="/products">TSM Steel Stirrups</a></li>
            <li><a href="/products">Square Stirrups</a></li>
            <li><a href="/products">Custom Stirrups</a></li>
            <li><a href="/products">Ring Stirrups</a></li>
            <li><a href="/products">Bulk Steel Supply</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Info</h4>
          <p>📍 Pune, Maharashtra, India<br /><br />📞 +91 98XXX XXXXX<br />Mon–Sat: 9 AM – 6 PM<br /><br />✉️ info@styrontsm.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          {/* Hidden admin trigger — clicking © 3 times opens admin login */}
          <span
            onClick={handleSecretClick}
            title=""
            style={{ cursor: 'default', userSelect: 'none' }}
          >©</span>
          {' '}2026 Styron TSM Steel Reinforcement Solutions. All rights reserved.
        </p>
        <p>Privacy Policy · Terms · Sitemap</p>
      </div>
    </footer>
  );
}
