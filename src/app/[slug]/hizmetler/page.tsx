import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSalons, getSalonBySlug } from '@/data/salons';
import SalonNav from '@/components/SalonNav';
import SalonFooter from '@/components/SalonFooter';
import HizmetlerPage from '@/components/HizmetlerPage';
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
    title: `Hizmetler — ${salon.shortTitle}`,
    description: `${salon.shortTitle} hizmet listesi: saç, cilt bakımı, makyaj, tırnak ve daha fazlası.`,
  };
}

export default async function HizmetlerRoute(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const salon = getSalonBySlug(slug);
  if (!salon) notFound();

  return (
    <>
      <ScrollReveal />
      <SalonNav salon={salon} />
      <HizmetlerPage salon={salon} />
      <SalonFooter salon={salon} />
    </>
  );
}
