import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSalons, getSalonBySlug } from '@/data/salons';
import SalonNav from '@/components/SalonNav';
import SalonHero from '@/components/SalonHero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import SalonAbout from '@/components/SalonAbout';
import WhatsAppBooking from '@/components/WhatsAppBooking';
import Testimonials from '@/components/Testimonials';
import SalonFooter from '@/components/SalonFooter';
import ScrollReveal from '@/components/ScrollReveal';

export async function generateStaticParams() {
  return getSalons().map(s => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const salon = getSalonBySlug(slug);
  if (!salon) return {};
  return {
    title: `${salon.shortTitle} — ${salon.city} Güzellik Salonu`,
    description: `${salon.shortTitle}, ${salon.city} konumunda profesyonel güzellik hizmetleri. Online randevu alın.`,
  };
}

export default async function SalonPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const salon = getSalonBySlug(slug);
  if (!salon) notFound();

  return (
    <>
      <ScrollReveal />
      <SalonNav salon={salon} />
      <SalonHero salon={salon} />
      <Marquee />
      <Services salonName={salon.shortTitle} />
      <SalonAbout salon={salon} />
      <WhatsAppBooking whatsappPhone={salon.whatsappPhone} salonName={salon.shortTitle} />
      <Testimonials />
      <SalonFooter salon={salon} />
    </>
  );
}
