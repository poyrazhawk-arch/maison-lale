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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        />
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
