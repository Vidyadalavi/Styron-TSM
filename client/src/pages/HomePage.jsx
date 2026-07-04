import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Products from '../components/Products';
import About from '../components/About';
import Applications from '../components/Applications';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import QuoteForm from '../components/QuoteForm';
import FAQ from '../components/FAQ';

function scrollToQuote() {
  document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomePage() {
  return (
    <>
      <Hero onQuoteClick={scrollToQuote} />
      <Stats />
      <Products />
      <About />
      <Applications />
      <Testimonials />
      <Contact />
      <QuoteForm />
      <FAQ />
    </>
  );
}
