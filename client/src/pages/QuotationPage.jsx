import { useState, useMemo } from 'react';
import { products, GST_RATE } from '../data/products';
import { useAuth } from '../AuthContext';

let quoteCounter = 1024;

export default function QuotationPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('new'); // 'new' | 'preview'
  const [form, setForm] = useState({
    fullName: user?.name || '',
    company: '',
    email: user?.email || '',
    phone: '',
    gstin: '',
    address: '',
  });
  const [lineItems, setLineItems] = useState([
    { id: Date.now(), productId: products[0].id, qty: 5 },
  ]);
  const [history, setHistory] = useState([]);
  const [activeQuote, setActiveQuote] = useState(null);

  const updateField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const updateLine = (id, key, val) => {
    setLineItems(items => items.map(it => it.id === id ? { ...it, [key]: val } : it));
  };

  const addLine = () => {
    setLineItems(items => [...items, { id: Date.now(), productId: products[0].id, qty: 1 }]);
  };

  const removeLine = (id) => setLineItems(items => items.filter(it => it.id !== id));

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, it) => {
      const p = products.find(p => p.id === it.productId);
      return sum + (p ? p.price * it.qty : 0);
    }, 0);
    const gst = subtotal * GST_RATE;
    return { subtotal, gst, total: subtotal + gst };
  }, [lineItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const quote = {
      id: `QTN-${quoteCounter++}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...form,
      lineItems: lineItems.map(it => ({ ...it, product: products.find(p => p.id === it.productId) })),
      ...totals,
    };
    setHistory(h => [quote, ...h]);
    setActiveQuote(quote);
    setTab('preview');
  };

  return (
    <div className="inner-page">
      <div className="quote-page-header">
        <div>
          <div className="section-label">Quotation System</div>
          <h1>Auto-Generated <span className="accent">GST Quotation</span></h1>
          <p>Digitally generated · Legally compliant · Emailed instantly</p>
        </div>
        <div className="quote-tabs">
          <button className={tab === 'preview' ? 'qtab active' : 'qtab'} onClick={() => setTab('preview')}>Preview</button>
          <button className={tab === 'new' ? 'qtab active dark' : 'qtab dark'} onClick={() => setTab('new')}>Request New</button>
        </div>
      </div>

      {tab === 'new' && (
        <form className="form-card quote-form-card" onSubmit={handleSubmit}>
          <h3>Request a New Quotation</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input required placeholder="Full Name" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input placeholder="Company Name" value={form.company} onChange={e => updateField('company', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => updateField('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input placeholder="+91 98765 43210" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>GSTIN (Optional)</label>
            <input placeholder="27ABCDE1234F1Z5" value={form.gstin} onChange={e => updateField('gstin', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <input placeholder="Full delivery address" value={form.address} onChange={e => updateField('address', e.target.value)} />
          </div>

          <h4 className="quote-section-title">Products Required</h4>
          <div className="quote-line-items">
            {lineItems.map(it => {
              const p = products.find(p => p.id === it.productId);
              return (
                <div className="quote-line-item" key={it.id}>
                  <select value={it.productId} onChange={e => updateLine(it.id, 'productId', e.target.value)}>
                    {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                  <input
                    type="number" min="1" value={it.qty}
                    onChange={e => updateLine(it.id, 'qty', Math.max(1, Number(e.target.value)))}
                  />
                  <span className="quote-line-price">₹{(p.price * it.qty).toLocaleString('en-IN')}</span>
                  <button type="button" className="cart-item-remove" onClick={() => removeLine(it.id)}>🗑</button>
                </div>
              );
            })}
          </div>
          <button type="button" className="btn-outline" style={{ marginBottom: '1.5rem' }} onClick={addLine}>+ Add Product</button>

          <div className="quote-totals">
            <div><span>Subtotal</span><span>₹{totals.subtotal.toLocaleString('en-IN')}</span></div>
            <div><span>GST (18%)</span><span>₹{totals.gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
            <div className="quote-grand-total"><span>Total</span><span>₹{totals.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
          </div>

          <button type="submit" className="btn-form">Generate Quotation</button>
        </form>
      )}

      {tab === 'preview' && (
        <div className="quote-preview-wrap">
          {!activeQuote ? (
            <div className="cart-empty" style={{ minHeight: '200px' }}>
              <p>No quotation generated yet. Switch to "Request New" to create one.</p>
            </div>
          ) : (
            <div className="quote-doc">
              <div className="quote-doc-head">
                <div>
                  <strong>STYRON™ TSM</strong>
                  <p>Steel Reinforcement Solutions · Pune, Maharashtra</p>
                </div>
                <div className="quote-doc-meta">
                  <span>Quotation No: <strong>{activeQuote.id}</strong></span>
                  <span>Date: {activeQuote.date}</span>
                </div>
              </div>
              <div className="quote-doc-bill">
                <div>
                  <h4>Billed To</h4>
                  <p>{activeQuote.fullName}{activeQuote.company ? `, ${activeQuote.company}` : ''}</p>
                  <p>{activeQuote.email} {activeQuote.phone && `· ${activeQuote.phone}`}</p>
                  {activeQuote.gstin && <p>GSTIN: {activeQuote.gstin}</p>}
                  {activeQuote.address && <p>{activeQuote.address}</p>}
                </div>
              </div>
              <table className="quote-table">
                <thead>
                  <tr><th>Product</th><th>Qty (quintal)</th><th>Rate</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {activeQuote.lineItems.map(it => (
                    <tr key={it.id}>
                      <td>{it.product.title}</td>
                      <td>{it.qty}</td>
                      <td>₹{it.product.price.toLocaleString('en-IN')}</td>
                      <td>₹{(it.product.price * it.qty).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="quote-totals" style={{ marginLeft: 'auto', maxWidth: '320px' }}>
                <div><span>Subtotal</span><span>₹{activeQuote.subtotal.toLocaleString('en-IN')}</span></div>
                <div><span>GST (18%)</span><span>₹{activeQuote.gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
                <div className="quote-grand-total"><span>Total</span><span>₹{activeQuote.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
              </div>
              <p className="quote-doc-footer">This is a digitally generated, legally compliant quotation. Emailed instantly to {activeQuote.email}.</p>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="quote-history">
          <h3>Past Quotations</h3>
          <table className="quote-table">
            <thead><tr><th>Quotation No</th><th>Date</th><th>Customer</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {history.map(q => (
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td>{q.date}</td>
                  <td>{q.fullName}</td>
                  <td>₹{q.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td><button className="btn-outline" style={{ padding: '.3rem .8rem' }} onClick={() => { setActiveQuote(q); setTab('preview'); }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
