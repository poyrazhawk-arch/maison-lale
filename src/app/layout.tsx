import type { Metadata } from 'next';
import '@/styles/globals.css';
import PageLoader from '@/components/PageLoader';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Maison Lale — Kuaför & Güzellik Salonu, İstanbul',
  description: "Nişantaşı'nın sessiz bir köşesinde, sekiz uzman stilist ve seçilmiş doğal ürünlerle güzellik ritüeli. Saç kesimi, renklendirme, cilt bakımı, makyaj ve manikür.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <PageLoader />
        <CustomCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
