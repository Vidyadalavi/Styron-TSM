const features = [
  { icon: '🏭', title: 'Advanced Machinery', desc: 'CNC-driven bending machines for precise, consistent output every time.' },
  { icon: '✅', title: 'Quality Assured', desc: 'Every batch tested for tensile strength and dimensional accuracy.' },
  { icon: '🚛', title: 'On-Time Delivery', desc: 'Reliable logistics ensuring your project never faces material delays.' },
  { icon: '🤝', title: 'Custom Solutions', desc: 'Tailored products based on structural drawings and specifications.' },
];

const specs = [
  { label: 'Grade', val: 'Fe 415 / Fe 500' },
  { label: 'Hook Angle', val: '135°' },
  { label: 'Diameter Range', val: '6–32 mm' },
  { label: 'Tolerance', val: '±1 mm' },
  { label: 'Standard', val: 'IS 2502 / IS 1786' },
  { label: 'Experience', val: '10+ Years' },
];

export default function About() {
  return (
    <section id="about">
      <div className="about-grid">
        <div>
          <div className="section-label">Who We Are</div>
          <h2>Strong Foundations.<br /><span className="accent">Stronger Nation.</span></h2>
          <p style={{ color: 'var(--silver)', lineHeight: 1.7 }}>
            Styron TSM is a premier manufacturer of precision steel reinforcement products, serving
            India's construction industry with the highest standards of quality and reliability. From
            residential buildings to large-scale infrastructure, we reinforce every dream with
            unmatched technical expertise.
          </p>
          <div className="about-features">
            {features.map((f) => (
              <div className="feature" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="about-visual">
          <h3>Quality Standards</h3>
          <p style={{ color: 'var(--silver)', fontSize: '.85rem', marginBottom: '1.5rem' }}>IS 2502 Certified</p>
          <div className="spec-rows">
            {specs.map((s) => (
              <div className="spec-row" key={s.label}>
                <span className="spec-label">{s.label}</span>
                <span className="spec-val">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
