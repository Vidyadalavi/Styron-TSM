const testimonials = [
  { quote: 'Styron TSM has been our go-to supplier for three years. Consistent dimensions, always on time. Excellent quality we rely on for every project.', author: 'Rajesh Patil', role: 'Senior Engineer, Pune' },
  { quote: 'Placed a bulk order for our residential township — Styron delivered without compromise. Custom stirrup shapes matched our drawings perfectly.', author: 'Suresh Builders', role: 'Real Estate Developer, Nashik' },
  { quote: 'As a contractor across Maharashtra, I need reliable materials. Styron\'s stirrups never disappoint — precise 135° hooks, great finish, competitive pricing.', author: 'Amit Sharma', role: 'Structural Contractor, Mumbai' },
  { quote: 'Outstanding customer support. Got custom stirrups for a commercial complex — fast turnaround, zero rejections on site. Highly recommended!', author: 'KP Construction', role: 'Commercial Builder, Aurangabad' },
  { quote: 'Best steel reinforcement supplier we\'ve worked with. High tensile, rust-resistant, and very competitive pricing for the quality delivered.', author: 'Vikram Desai', role: 'Civil Engineer, Solapur' },
];

const doubled = [...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ paddingBottom: '60px' }}>
      <div className="section-label">Client Testimonials</div>
      <h2>Trusted by <span className="accent">Builders Across India</span></h2>
      <div style={{ overflow: 'hidden', marginTop: '2.5rem' }}>
        <div className="testimonials-scroll">
          {doubled.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="stars">★★★★★</div>
              <p>"{t.quote}"</p>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-role">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
