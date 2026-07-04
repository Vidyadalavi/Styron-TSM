export default function Hero({ onQuoteClick }) {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-badge">🏗️ Premium Steel Reinforcement — Since 2014</div>
        <h1>
          Building <span className="accent">Strength.</span>
          <br />Building the Future.
        </h1>
        <p>
          TSM Steel Reinforcement for Every Structure. Engineered with precision, manufactured with
          purpose. Trusted by India's leading contractors, builders, and developers.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={onQuoteClick}>Request a Quote</button>
          <a href="#contact" className="btn-outline">Contact Us</a>
        </div>
        <div className="hero-tags">
          <span>✅ Precise 135° Bending</span>
          <span>⚡ High Tensile Steel</span>
          <span>🛡️ Rust Resistant</span>
          <span>🚛 Pan-India Delivery</span>
          <span>📦 Bulk Supply Ready</span>
        </div>
      </div>
    </section>
  );
}
