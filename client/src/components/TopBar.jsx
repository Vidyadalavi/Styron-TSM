import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <div className="topbar">
      <span className="topbar-left">🏭 India's #1 Steel Reinforcement Manufacturer · ISO 2502 Certified</span>
      <span className="topbar-right">
        <a href="tel:+911234567890">📞 +91 12345 67890</a>
        <Link to="/track">Track Order</Link>
      </span>
    </div>
  );
}
