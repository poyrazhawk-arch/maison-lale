import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import About from '@/components/About';
import WhatsAppBooking from '@/components/WhatsAppBooking';
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
      <WhatsAppBooking whatsappPhone="902122000000" salonName="Maison Lale" />
      <Testimonials />
      <Footer />
    </>
  );
}
