import { useState } from 'react';

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', city: '', qty: '', type: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setError('Full name and phone are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.name,
          phone: form.phone,
          email: form.email,
          company: form.company,
          city: form.city,
          projectType: form.type,
          // qty is a free-text field here (e.g. "500 kg"), not part of lineItems,
          // so we fold it into the message so it isn't lost.
          message: form.qty ? `Quantity: ${form.qty}. ${form.message}`.trim() : form.message,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to send inquiry');
      }
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', company: '', city: '', qty: '', type: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-section" id="quote">
      <div className="form-grid">
        <div>
          <div className="section-label">Send Your Inquiry</div>
          <h2>Get a <span className="accent">Free Quote</span></h2>
          <p style={{ color: 'var(--silver)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Fill in your project details and our team will respond within 24 hours with a competitive quote.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '⚡', text: 'Response within 24 hours guaranteed' },
              { icon: '📋', text: 'Custom quotes based on your exact drawings' },
              { icon: '🏗️', text: 'All project types — residential to infrastructure' },
            ].map((item) => (
              <div className="form-promise" key={item.text}>
                <span>{item.icon}</span>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="form-card">
          <h3>Request Quote</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input name="company" type="text" placeholder="Company name" value={form.company} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" type="text" placeholder="Your city" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Quantity Required</label>
              <input name="qty" type="text" placeholder="e.g. 500 kg" value={form.qty} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Project Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">Select project type</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Infrastructure</option>
              <option>Government</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" placeholder="Describe your requirements, stirrup types, sizes..." value={form.message} onChange={handleChange} />
          </div>
          {error && <p style={{ color: '#dc2626', marginBottom: '0.75rem' }}>{error}</p>}
          <button
            className="btn-form"
            onClick={handleSubmit}
            disabled={submitted || submitting}
            style={submitted ? { background: '#16a34a' } : {}}
          >
            {submitted
              ? "✅ Inquiry Sent! We'll contact you within 24 hours."
              : submitting
              ? 'Sending...'
              : 'Send Inquiry →'}
          </button>
        </div>
      </div>
    </div>
  );
}