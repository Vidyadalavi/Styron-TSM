import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { products, GST_RATE } from '../data/products';
import { useCart } from '../CartContext';

export default function EstimatorPage() {
  const [productId, setProductId] = useState(products[0].id);
  const [qty, setQty] = useState(5);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === productId);

  const calc = useMemo(() => {
    const subtotal = product.price * qty;
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  }, [product, qty]);

  const handleAdd = () => {
    addToCart({ ...product, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="inner-page">
      <div className="page-header">
        <div className="section-label">Cost Estimator</div>
        <h1>Instant Steel <span className="accent">Cost Estimator</span></h1>
        <p>Select a product and quantity to instantly calculate material cost including GST.</p>
      </div>

      <div className="estimator-grid">
        <div className="form-card">
          <h3>Calculate Your Estimate</h3>

          <div className="form-group">
            <label>Product</label>
            <select value={productId} onChange={e => setProductId(e.target.value)}>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title} — ₹{p.price.toLocaleString('en-IN')}/quintal</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity (in quintals — 100 kg each)</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="estimator-slider-row">
            <input
              type="range"
              min="1"
              max="200"
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
            />
            <span>{qty} quintal{qty > 1 ? 's' : ''} ({(qty * 100).toLocaleString('en-IN')} kg)</span>
          </div>
        </div>

        <div className="estimator-result">
          <h3>{product.title}</h3>
          <p className="estimator-desc">{product.desc}</p>

          <div className="spec-rows" style={{ marginTop: '1.5rem' }}>
            <div className="spec-row">
              <span className="spec-label">Rate per Quintal</span>
              <span className="spec-val">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Quantity</span>
              <span className="spec-val">{qty} quintal{qty > 1 ? 's' : ''}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Subtotal</span>
              <span className="spec-val">₹{calc.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">GST (18%)</span>
              <span className="spec-val">₹{calc.gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          <div className="estimator-total">
            <span>Estimated Total</span>
            <strong>₹{calc.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
          </div>

          <button className="btn-checkout" onClick={handleAdd}>
            {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
          </button>
          <Link to="/quotation" className="btn-outline" style={{ display: 'block', textAlign: 'center', marginTop: '.75rem' }}>
            Request a Formal Quotation →
          </Link>
        </div>
      </div>
    </div>
  );
}
