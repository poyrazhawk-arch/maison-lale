import type { Metadata } from 'next';
import { Bodoni_Moda, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import PageLoader from '@/components/PageLoader';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maison Lale — Kuaför & Güzellik Salonu, İstanbul',
  description: "Nişantaşı'nın sessiz bir köşesinde, sekiz uzman stilist ve seçilmiş doğal ürünlerle güzellik ritüeli. Saç kesimi, renklendirme, cilt bakımı, makyaj ve manikür.",
  metadataBase: new URL('https://maison-lale.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${bodoniModa.variable} ${plusJakartaSans.variable}`}>
      <body>
        <PageLoader />
        <CustomCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
