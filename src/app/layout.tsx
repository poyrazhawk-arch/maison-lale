import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import '@/styles/globals.css';
import PageLoader from '@/components/PageLoader';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
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
    <html lang="tr" className={`${cormorantGaramond.variable} ${inter.variable}`}>
      <body>
        <PageLoader />
        <CustomCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
