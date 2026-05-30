import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import About from '@/components/About';
import Booking from '@/components/Booking';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <About />
      <Booking />
      <Testimonials />
      <Footer />
    </>
  );
}
