'use client';

import { useEffect, useState } from 'react';
import styles from './Nav.module.css';

export default function Nav() {
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

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="nav">
      <div className={styles.navInner}>
        <a href="#top" className={styles.brand} aria-label="Maison Lale" onClick={() => scrollTo('top')}>
          <span className={styles.mark}>M</span>
          <span className={styles.name}>Maison <em>Lale</em></span>
        </a>
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <a href="#hizmetler" onClick={(e) => { e.preventDefault(); scrollTo('hizmetler'); }}>Hizmetler</a>
          <a href="#hakkimizda" onClick={(e) => { e.preventDefault(); scrollTo('hakkimizda'); }}>Hakkımızda</a>
          <a href="#yorumlar" onClick={(e) => { e.preventDefault(); scrollTo('yorumlar'); }}>Yorumlar</a>
          <a href="#iletisim" onClick={(e) => { e.preventDefault(); scrollTo('iletisim'); }}>İletişim</a>
        </div>
        <a className={styles.navCta} href="/randevular">Randevu Al</a>
        <button
          className={styles.burger}
          aria-label="Menü"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={menuOpen ? styles.open : ''}></span>
          <span className={menuOpen ? styles.open : ''}></span>
          <span className={menuOpen ? styles.open : ''}></span>
        </button>
      </div>
    </nav>
  );
}
