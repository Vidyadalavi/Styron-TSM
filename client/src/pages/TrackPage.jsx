import { useState } from 'react';

const STEPS = ['Order Confirmed', 'In Production', 'Dispatched', 'Delivered'];

// Maps the real Order.status values to a step index in the STEPS timeline above.
const STATUS_STEP = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3 };

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const orderId = query.trim().toUpperCase();
    if (!orderId) return;

    setSearched(true);
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      if (res.status === 404) {
        setOrder(null);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch order');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error('Order tracking lookup failed:', err);
      setError('Something went wrong looking up your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // No delivery-date field on the Order model yet — show a rough estimate
  // (7 days after placement) unless it's already delivered.
  const estimateEta = (createdAt) => {
    const eta = new Date(createdAt);
    eta.setDate(eta.getDate() + 7);
    return formatDate(eta);
  };

  const productSummary = (lineItems = []) =>
    lineItems.map(li => `${li.title} × ${li.qty}`).join(', ') || 'No items listed';

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
            placeholder="e.g. ORD-2024"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="btn-form" type="submit" disabled={loading}>{loading ? 'Searching…' : 'Track Order'}</button>
      </form>

      {searched && loading && (
        <div className="cart-empty" style={{ minHeight: '160px' }}>
          <p>Looking up your order…</p>
        </div>
      )}

      {searched && !loading && error && (
        <div className="cart-empty" style={{ minHeight: '160px' }}>
          <p style={{ color: 'var(--red, #dc2626)' }}>{error}</p>
        </div>
      )}

      {searched && !loading && !error && (
        order ? (
          <div className="track-result">
            <div className="track-result-head">
              <div>
                <h3>{order.orderId}</h3>
                <p>{productSummary(order.lineItems)}</p>
              </div>
              <div className="track-result-dates">
                <span>Placed: {formatDate(order.createdAt)}</span>
                <span>{order.status === 'Delivered' ? `Delivered` : `ETA: ${estimateEta(order.createdAt)}`}</span>
              </div>
            </div>

            {order.status === 'Cancelled' ? (
              <div className="cart-empty" style={{ minHeight: '80px', marginTop: '1rem' }}>
                <p>This order was cancelled.</p>
              </div>
            ) : (
              <div className="track-timeline">
                {STEPS.map((step, i) => (
                  <div className={`track-step ${i <= STATUS_STEP[order.status] ? 'done' : ''}`} key={step}>
                    <div className="track-dot">{i <= STATUS_STEP[order.status] ? '✓' : i + 1}</div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
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