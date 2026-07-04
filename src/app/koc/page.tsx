import type { Metadata, Viewport } from 'next';
import { Anton, Instrument_Sans } from 'next/font/google';
import KocShell from '@/components/koc/KocShell';

const display = Anton({
  weight: '400',
  subsets: ['latin-ext'],
  variable: '--koc-display',
  display: 'swap',
});

const sans = Instrument_Sans({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--koc-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KOÇ — Kişisel Kalori Koçu',
  description: 'Koruma kalorisi ve vücut kompozisyonu takibi — kişisel koçluk.',
  robots: { index: false, follow: false },
  manifest: '/koc.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KOÇ',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c0d0b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function KocPage() {
  return (
    <div className={`${display.variable} ${sans.variable}`}>
      <KocShell />
    </div>
  );
}
