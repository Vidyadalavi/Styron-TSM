import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <div className="inner-page">
      <div className="page-header">
        <div className="section-label">Contact</div>
        <h1>Let's <span className="accent">Talk Steel</span></h1>
        <p>Reach our team for quotes, technical queries, or bulk orders.</p>
      </div>
      <Contact />
    </div>
  );
}
