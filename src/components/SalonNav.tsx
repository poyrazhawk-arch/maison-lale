'use client';

import { useEffect, useState } from 'react';
import type { Salon } from '@/data/salons';
import styles from './Nav.module.css';

export default function SalonNav({ salon }: { salon: Salon }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Use first letter of salon short title
  const initial = salon.shortTitle.charAt(0).toUpperCase();

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <a href="#top" className={styles.brand} aria-label={salon.shortTitle} onClick={() => scrollTo('top')}>
          <span className={styles.mark}>{initial}</span>
          <span className={styles.name}>{salon.shortTitle}</span>
        </a>
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('hizmetler'); }}>Hizmetler</a>
          <a href="#hakkimizda" onClick={(e) => { e.preventDefault(); scrollTo('hakkimizda'); }}>Hakkımızda</a>
          <a href="#yorumlar" onClick={(e) => { e.preventDefault(); scrollTo('yorumlar'); }}>Yorumlar</a>
          <a href="#iletisim" onClick={(e) => { e.preventDefault(); scrollTo('iletisim'); }}>İletişim</a>
        </div>
        <button className={styles.navCta} onClick={() => scrollTo('randevu')}>Randevu Al</button>
        <button
          className={styles.burger}
          aria-label="Menü"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
