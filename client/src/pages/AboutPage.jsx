import About from '../components/About';

export default function AboutPage() {
  return (
    <div className="inner-page">
      <div className="page-header">
        <div className="section-label">About Us</div>
        <h1>Engineering <span className="accent">Trust</span> Since 2014</h1>
        <p>Learn about our manufacturing standards, certifications, and the team behind Styron TSM.</p>
      </div>
      <About />
    </div>
  );
}
