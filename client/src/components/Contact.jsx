import { useState } from 'react';
import { API_URL } from '../config';

const WaIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 24, height: 24 }}>
    <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', body: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | validation_error | submit_error
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.body.trim() || (!form.email.trim() && !form.phone.trim())) {
      setStatus('validation_error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', subject: '', body: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error('Contact form submit failed:', err);
      setStatus('submit_error');
    }
  };

  return (
    <section id="contact">
      <div className="section-label">Get In Touch</div>
      <h2>Let's <span className="accent">Build Together</span></h2>
      <p className="section-sub">Our team is ready to help with your steel reinforcement requirements. Reach out via any channel below.</p>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <h4>Office Address</h4>
              <p>Styron TSM Steel Reinforcement Solutions<br />Pune, Maharashtra, India</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <h4>Phone</h4>
              <a href="tel:+919800000000">+91 98XXX XXXXX</a>
              <p>Mon – Sat, 9 AM – 6 PM</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div>
              <h4>Email</h4>
              <a href="mailto:info@styrontsm.com">info@styrontsm.com</a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon" style={{ color: 'var(--green)' }}>💬</div>
            <div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/919800000000" target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>+91 98XXX XXXXX</a>
            </div>
          </div>
          <a href="https://wa.me/919800000000" target="_blank" rel="noreferrer" className="wa-contact-btn">
            <WaIcon /> Chat on WhatsApp
          </a>
        </div>

        <form className="form-card" onSubmit={handleSubmit} style={{ alignSelf: 'start' }}>
          <h3>Send a Message</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input name="subject" type="text" placeholder="What's this about?" value={form.subject} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Message *</label>
            <textarea name="body" rows={4} placeholder="Tell us what you need…" value={form.body} onChange={handleChange} />
          </div>
          <button type="submit" className="btn-form" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
          {status === 'sent' && <p style={{ color: 'var(--green)', fontSize: '.85rem', marginTop: '.6rem' }}>✅ Message sent — we'll get back to you soon.</p>}
          {status === 'validation_error' && <p style={{ color: 'var(--red)', fontSize: '.85rem', marginTop: '.6rem' }}>Please fill your name, message, and an email or phone number.</p>}
          {status === 'submit_error' && <p style={{ color: 'var(--red)', fontSize: '.85rem', marginTop: '.6rem' }}>Something went wrong sending your message. Please try again, or reach us on WhatsApp/phone.</p>}
        </form>

        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.72!2d73.728!3d18.524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C+Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Pune, Maharashtra"
          />
        </div>
      </div>
    </section>
  );
}