import { useState } from 'react';

const GST_RATE = 0.18;
const DELIVERY = 1500;

export default function CheckoutModal({ open, onClose, items, total, clearCart }) {
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=success
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', address: '', city: '', pincode: '', state: '' });
  const [payLoading, setPayLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const gst = Math.round(total * GST_RATE);
  const grandTotal = total + gst + DELIVERY;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Valid 10-digit number required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.address.trim()) errs.address = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) errs.pincode = '6-digit pincode required';
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(2);
  };

  const handleRazorpay = () => {
    setPayLoading(true);

    // Razorpay options
    const options = {
      key: 'rzp_test_YourKeyHere', // Replace with actual Razorpay key
      amount: grandTotal * 100, // Amount in paise
      currency: 'INR',
      name: 'STYRON TSM Steel',
      description: `Order: ${items.map(i => i.title).join(', ')}`,
      image: 'https://i.imgur.com/logo.png',
      handler: function (response) {
        // Payment successful
        setPayLoading(false);
        setStep(3);
        clearCart();
        console.log('Payment ID:', response.razorpay_payment_id);
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        address: `${form.address}, ${form.city} - ${form.pincode}`,
        company: form.company,
        items: items.map(i => `${i.title} x${i.qty}`).join(', '),
      },
      theme: { color: '#d4a017' },
      modal: {
        ondismiss: () => {
          setPayLoading(false);
        }
      }
    };

    // Load Razorpay SDK if not already loaded
    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        setPayLoading(false);
        alert('Could not load payment gateway. Please try again.');
      };
      document.body.appendChild(script);
    }
  };

  const handleReset = () => {
    setStep(1);
    setForm({ name: '', phone: '', email: '', company: '', address: '', city: '', pincode: '', state: '' });
    setErrors({});
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--steel)', border: '1px solid rgba(212,160,23,0.25)',
        borderRadius: '16px', width: '100%', maxWidth: '640px',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--steel-mid), #1a2a1a)',
          borderBottom: '1px solid rgba(212,160,23,0.2)',
          padding: '1.25rem 1.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '16px 16px 0 0'
        }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>
              STYRON™ TSM Checkout
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--silver)', marginTop: '.1rem' }}>
              {step === 1 ? '📋 Delivery Details' : step === 2 ? '💳 Review & Pay' : '✅ Order Confirmed'}
            </div>
          </div>
          <button onClick={handleReset} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
            width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem'
          }}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {['Details', 'Review & Pay', 'Confirmed'].map((s, i) => (
            <div key={s} style={{
              flex: 1, textAlign: 'center', padding: '.6rem',
              fontSize: '.75rem', fontWeight: 600,
              color: step === i + 1 ? 'var(--gold)' : step > i + 1 ? '#4ade80' : 'var(--silver)',
              borderBottom: step === i + 1 ? '2px solid var(--gold)' : '2px solid transparent',
              transition: '.2s'
            }}>
              {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        <div style={{ padding: '1.75rem' }}>

          {/* ── STEP 1: Delivery Details ── */}
          {step === 1 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { name: 'name', label: 'Full Name *', placeholder: 'Your full name', type: 'text' },
                  { name: 'phone', label: 'Phone *', placeholder: '98765 43210', type: 'tel' },
                  { name: 'email', label: 'Email *', placeholder: 'you@company.com', type: 'email' },
                  { name: 'company', label: 'Company', placeholder: 'Company name (optional)', type: 'text' },
                ].map(f => (
                  <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
                    <label>{f.label}</label>
                    <input
                      name={f.name} type={f.type} placeholder={f.placeholder}
                      value={form[f.name]} onChange={handleChange}
                      style={errors[f.name] ? { borderColor: '#f87171' } : {}}
                    />
                    {errors[f.name] && <span style={{ color: '#f87171', fontSize: '.7rem' }}>{errors[f.name]}</span>}
                  </div>
                ))}
              </div>

              <div className="form-group" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <label>Delivery Address *</label>
                <input
                  name="address" type="text" placeholder="Building, Street, Area"
                  value={form.address} onChange={handleChange}
                  style={errors.address ? { borderColor: '#f87171' } : {}}
                />
                {errors.address && <span style={{ color: '#f87171', fontSize: '.7rem' }}>{errors.address}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {[
                  { name: 'city', label: 'City *', placeholder: 'Mumbai' },
                  { name: 'pincode', label: 'Pincode *', placeholder: '400001' },
                  { name: 'state', label: 'State', placeholder: 'Maharashtra' },
                ].map(f => (
                  <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
                    <label>{f.label}</label>
                    <input
                      name={f.name} type="text" placeholder={f.placeholder}
                      value={form[f.name]} onChange={handleChange}
                      style={errors[f.name] ? { borderColor: '#f87171' } : {}}
                    />
                    {errors[f.name] && <span style={{ color: '#f87171', fontSize: '.7rem' }}>{errors[f.name]}</span>}
                  </div>
                ))}
              </div>

              <button
                className="btn-form"
                style={{ marginTop: '1.5rem' }}
                onClick={handleNext}
              >
                Continue to Review →
              </button>
            </div>
          )}

          {/* ── STEP 2: Review & Pay ── */}
          {step === 2 && (
            <div>
              {/* Order summary */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '.8rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.75rem' }}>
                  Order Summary
                </div>
                {items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '.75rem', background: 'rgba(255,255,255,0.04)',
                    borderRadius: '8px', marginBottom: '.5rem', fontSize: '.875rem'
                  }}>
                    <span>{item.icon} {item.title} × {item.qty}</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: '.75rem' }}>
                  {[
                    { label: 'Subtotal', val: `₹${total.toLocaleString('en-IN')}` },
                    { label: 'GST (18%)', val: `₹${gst.toLocaleString('en-IN')}` },
                    { label: 'Delivery', val: `₹${DELIVERY.toLocaleString('en-IN')}` },
                  ].map(r => (
                    <div key={r.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '.85rem', color: 'var(--silver)', marginBottom: '.4rem'
                    }}>
                      <span>{r.label}</span><span>{r.val}</span>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontWeight: 800, fontSize: '1.1rem', color: 'var(--gold)',
                    marginTop: '.75rem', paddingTop: '.75rem',
                    borderTop: '1px solid rgba(212,160,23,0.3)'
                  }}>
                    <span>Total Payable</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div style={{
                background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)',
                borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '.85rem'
              }}>
                <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '.5rem' }}>📦 Delivery To</div>
                <div>{form.name} · {form.phone}</div>
                <div style={{ color: 'var(--silver)', marginTop: '.25rem' }}>
                  {form.address}, {form.city} – {form.pincode}{form.state && `, ${form.state}`}
                </div>
                {form.company && <div style={{ color: 'var(--silver)' }}>🏢 {form.company}</div>}
              </div>

              {/* Payment methods */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '.8rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.75rem' }}>
                  Secure Payment via Razorpay
                </div>
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
                  {['💳 Cards', '🏦 Net Banking', '📱 UPI', '💰 EMI', '🔒 Wallets'].map(m => (
                    <span key={m} style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      padding: '.3rem .7rem', borderRadius: '20px', fontSize: '.75rem', color: 'var(--silver)'
                    }}>{m}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: '0 0 auto', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)', color: 'var(--silver)',
                    padding: '.9rem 1.25rem', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '.9rem', fontFamily: 'inherit'
                  }}
                >← Back</button>
                <button
                  className="btn-form"
                  style={{ flex: 1, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}
                  onClick={handleRazorpay}
                  disabled={payLoading}
                >
                  {payLoading ? (
                    <><span style={{ animation: 'spin .8s linear infinite', display: 'inline-block' }}>⟳</span> Opening Payment...</>
                  ) : (
                    <>🔒 Pay ₹{grandTotal.toLocaleString('en-IN')} Securely</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', color: 'var(--gold)', marginBottom: '.75rem' }}>
                Order Confirmed!
              </h3>
              <p style={{ color: 'var(--silver)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Thank you for your order! Our team will contact you within 24 hours
                to confirm delivery details and estimated dispatch time.
              </p>
              <div style={{
                background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
                borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '.875rem'
              }}>
                <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '.5rem' }}>✅ What happens next?</div>
                <div style={{ color: 'var(--silver)', textAlign: 'left' }}>
                  • Order confirmation email sent to {form.email}<br />
                  • Our team calls {form.phone} within 24 hours<br />
                  • Dispatch within 3–5 business days<br />
                  • Pan-India delivery to {form.city}
                </div>
              </div>
              <button className="btn-form" onClick={handleReset}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
