import { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from '../data/products';
import { useCart } from '../CartContext';
import ProductImage from '../components/ProductImage';

const SORTS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
];

export default function ProductPage() {
  const { addToCart } = useCart();
  const [added, setAdded] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [grade, setGrade] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.map(p => ({ ...p, id: p.slug })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const GRADES = useMemo(() => ['All', ...new Set(products.map(p => p.grade))], [products]);

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (category === 'All' || p.category === category) &&
      (grade === 'All' || p.grade === grade) &&
      p.price <= maxPrice &&
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [products, category, grade, maxPrice, search, sort]);

  const handleAdd = (product) => {
    addToCart(product);
    setAdded(a => ({ ...a, [product.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 1500);
  };

  const resetFilters = () => {
    setCategory('All'); setGrade('All'); setMaxPrice(10000); setSearch(''); setSort('default');
  };

  return (
    <div className="inner-page">
      <div className="page-header">
        <div className="section-label">Our Catalog</div>
        <h1>Steel Reinforcement <span className="accent">Products</span></h1>
        <p>Browse our full range of stirrups, TMT bars, custom shapes, and bulk supply — filter by category, grade, and budget.</p>
      </div>

      <div className="products-page-layout">
        <aside className="filter-sidebar">
          <div className="filter-block">
            <h4>Search</h4>
            <input
              className="filter-search"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-block">
            <h4>Category</h4>
            <div className="filter-options">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={category === c ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <h4>Grade</h4>
            <div className="filter-options">
              {GRADES.map(g => (
                <button
                  key={g}
                  className={grade === g ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setGrade(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <h4>Max Price: ₹{maxPrice.toLocaleString('en-IN')}</h4>
            <input
              type="range" min="7000" max="10000" step="100"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="filter-range"
            />
          </div>

          <button className="btn-outline" style={{ width: '100%' }} onClick={resetFilters}>Reset Filters</button>
        </aside>

        <div className="products-page-results">
          <div className="results-toolbar">
            <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="cart-empty" style={{ minHeight: '200px' }}>
              <p>Loading products…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="cart-empty" style={{ minHeight: '200px' }}>
              <p>No products match your filters. Try resetting them.</p>
            </div>
          ) : (
            <div className="products-grid catalog-grid">
              {filtered.map(p => (
                <div className="product-card catalog-card" key={p.id}>
                  <div className="product-img-wrap">
                    <ProductImage type={p.image} />
                    {p.badge && (
                      <span className={`catalog-badge ${p.badge === 'Best Seller' ? 'gold' : p.badge === 'Premium' ? 'premium' : p.badge === 'New' ? 'new' : 'deal'}`}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="catalog-card-body">
                    <span className="catalog-category">{p.category} · {p.grade}</span>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="product-tags" style={{ marginBottom: '1.25rem' }}>
                      {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                    </div>
                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.75rem' }}>
                        <div>
                          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '.7rem', color: 'var(--silver)', display: 'block' }}>{p.unit}</span>
                        </div>
                        <span style={{ fontSize: '.7rem', color: 'var(--silver)' }}>+ GST</span>
                      </div>
                      <button
                        className={`btn-add-cart ${added[p.id] ? 'added' : ''}`}
                        onClick={() => handleAdd(p)}
                      >
                        {added[p.id] ? '✅ Added to Cart!' : '🛒 Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
