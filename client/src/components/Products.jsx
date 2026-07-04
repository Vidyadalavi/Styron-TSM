import { useCart } from '../CartContext';
import { useState, useEffect } from 'react';
import ProductImage from './ProductImage';

export default function Products() {
  const { addToCart, setCartOpen } = useCart();
  const [added, setAdded] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(data => {
        // Normalize `slug` (from MongoDB) to `id` so the rest of the
        // component — and the cart, which keys on `id` — doesn't change.
        setProducts(data.map(p => ({ ...p, id: p.slug })));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setAdded(a => ({ ...a, [product.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 1500);
  };

  if (loading) {
    return (
      <section id="product">
        <div className="section-label">Our Products</div>
        <h2>TSM Steel <span className="accent">Reinforcement Range</span></h2>
        <p className="section-sub">Loading products…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="product">
        <div className="section-label">Our Products</div>
        <h2>TSM Steel <span className="accent">Reinforcement Range</span></h2>
        <p className="section-sub">Couldn't load products right now. Please try again shortly.</p>
      </section>
    );
  }

  return (
    <section id="product">
      <div className="section-label">Our Products</div>
      <h2>TSM Steel <span className="accent">Reinforcement Range</span></h2>
      <p className="section-sub">
        Precision-engineered stirrups and steel reinforcement products for every construction
        requirement — from foundations to high-rise structures.
      </p>
      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p.title} style={{ position: 'relative' }}>
            {p.badge && (
              <span style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: p.badge === 'Best Seller' ? 'var(--gold)' : p.badge === 'Premium' ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(37,211,102,0.8)',
                color: p.badge === 'Best Seller' ? 'var(--bg)' : '#fff',
                padding: '.2rem .6rem', borderRadius: '20px',
                fontSize: '.65rem', fontWeight: 800, letterSpacing: '.5px'
              }}>{p.badge}</span>
            )}
           <div className="product-img-wrap">
  <ProductImage type={p.image} alt={p.title} />
           </div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="product-tags" style={{ marginBottom: '1.25rem' }}>
              {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.75rem' }}>
                <div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '.7rem', color: 'var(--silver)', display: 'block' }}>{p.unit}</span>
                </div>
                <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.4)' }}>+ GST</span>
              </div>
              <button
                className={`btn-add-cart ${added[p.id] ? 'added' : ''}`}
                onClick={() => handleAdd(p)}
              >
                {added[p.id] ? '✅ Added to Cart!' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
