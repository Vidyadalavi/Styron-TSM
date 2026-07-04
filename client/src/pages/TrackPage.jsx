import { useState } from 'react';

const SAMPLE_ORDERS = {
  'ORD-7741': {
    product: 'TSM Steel Stirrups — 8 quintals',
    placed: '24 Jun 2026',
    eta: '02 Jul 2026',
    status: 2,
  },
  'ORD-5520': {
    product: 'Bulk Steel Supply — 50 quintals',
    placed: '18 Jun 2026',
    eta: '28 Jun 2026',
    status: 3,
  },
};

const STEPS = ['Order Confirmed', 'In Production', 'Dispatched', 'Delivered'];

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    setOrder(SAMPLE_ORDERS[query.trim().toUpperCase()] || null);
  };

  return (
    <div className="inner-page">
      <div className="page-header">
        <div className="section-label">Order Tracking</div>
        <h1>Track Your <span className="accent">Order</span></h1>
        <p>Enter your order ID to see real-time production and delivery status.</p>
      </div>

      <form className="form-card track-search-card" onSubmit={handleSearch}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Order ID</label>
          <input
            placeholder="e.g. ORD-7741"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="btn-form" type="submit">Track Order</button>
        <p className="form-promise" style={{ marginTop: '1rem' }}>
          <span>💡</span>
          <span>Try sample IDs: <strong>ORD-7741</strong> or <strong>ORD-5520</strong></span>
        </p>
      </form>

      {searched && (
        order ? (
          <div className="track-result">
            <div className="track-result-head">
              <div>
                <h3>{query.trim().toUpperCase()}</h3>
                <p>{order.product}</p>
              </div>
              <div className="track-result-dates">
                <span>Placed: {order.placed}</span>
                <span>ETA: {order.eta}</span>
              </div>
            </div>
            <div className="track-timeline">
              {STEPS.map((step, i) => (
                <div className={`track-step ${i <= order.status ? 'done' : ''}`} key={step}>
                  <div className="track-dot">{i <= order.status ? '✓' : i + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="cart-empty" style={{ minHeight: '160px' }}>
            <p>No order found with that ID. Please check and try again.</p>
          </div>
        )
      )}
    </div>
  );
}
