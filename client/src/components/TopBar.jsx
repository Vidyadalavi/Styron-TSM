import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TopBar() {
  const [priceInfo, setPriceInfo] = useState(null);

  useEffect(() => {
    fetch('/api/steel-price')
      .then(res => res.ok ? res.json() : null)
      .then(data => setPriceInfo(data))
      .catch(() => {});
  }, []);

  return (
    <div className="topbar">
      <span className="topbar-left">
        🏭 India's #1 Steel Reinforcement Manufacturer · ISO 2502 Certified
        {priceInfo && (
          <span style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.25)' }}>
            📈 Steel Price: ₹{priceInfo.price.toLocaleString('en-IN')} {priceInfo.unit}
            {priceInfo.changePercent !== 0 && (
              <span style={{ color: priceInfo.changePercent > 0 ? '#4ade80' : '#f87171', marginLeft: '.4rem' }}>
                {priceInfo.changePercent > 0 ? '▲' : '▼'} {Math.abs(priceInfo.changePercent)}%
              </span>
            )}
          </span>
        )}
      </span>
      <span className="topbar-right">
        <a href="tel:+911234567890">📞 +91 12345 67890</a>
        <Link to="/track">Track Order</Link>
      </span>
    </div>
  );
}
