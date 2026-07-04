import { useState } from 'react';

const faqs = [
  { q: 'What stirrup types do you manufacture?', a: 'We manufacture square, rectangular, circular, diamond, and fully custom stirrups based on structural drawings. All feature precise 135° hooks per IS 2502 standards.' },
  { q: 'What is the minimum order quantity?', a: 'We cater to both small and large orders. We specialize in bulk supply but also accommodate smaller quantities for residential projects. Contact our team to discuss your requirements.' },
  { q: 'Do you supply custom sizes from drawings?', a: 'Yes. Our CNC bending machines manufacture stirrups to exact specifications from your structural drawings. Share your requirements and we\'ll deliver with precision.' },
  { q: 'What steel grades are available?', a: 'We work with Fe 415 and Fe 500 grade TMT bars processed for stirrup manufacturing, sourced from reputed steel manufacturers for consistent quality.' },
  { q: 'What are your delivery timelines?', a: 'Standard orders are typically fulfilled within 2–5 working days. For bulk orders, we provide a confirmed delivery schedule to keep your project on track.' },
  { q: 'Do you supply pan-India?', a: 'Yes, we supply across Maharashtra and are expanding our logistics network for pan-India delivery. Contact us to check coverage for your location.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section id="faq">
      <div className="section-label">Common Questions</div>
      <h2>Frequently Asked <span className="accent">Questions</span></h2>
      <p className="section-sub">Got a question? Our team is always ready to help.</p>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div className="faq-item" key={i}>
            <button className="faq-q" onClick={() => toggle(i)}>
              {f.q}
              <span className={`faq-icon${open === i ? ' open' : ''}`}>+</span>
            </button>
            <div className={`faq-a${open === i ? ' open' : ''}`}>{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
