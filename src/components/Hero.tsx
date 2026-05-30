'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    // Parallax on hero image
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: imgRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Count-up on stats
    if (statsRef.current) {
      statsRef.current.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count || '0');
        const isFloat = !Number.isInteger(target);
        const suffix = el.dataset.suffix || '';
        gsap.from({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: function () {
            const v = this.targets()[0].val as number;
            el.textContent = (isFloat ? v.toFixed(1) : Math.round(v).toString()) + suffix;
          },
        });
      });
    }
  }, []);

  return (
    <header id="top" className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.editionStamp}>
          <span className={styles.vol}>Vol. XII</span>
          <span className={styles.bar}></span>
          <span>Nişantaşı · Est. 2014</span>
        </div>

        <div className={styles.live}>
          <span className={styles.pulse}></span>
          Şu an <strong>açığız</strong> — 20:00&apos;a kadar
        </div>

        <h1 className={styles.h1}>
          <span className={styles.ln}><span>Zarafetin</span></span>
          <span className={styles.ln}><span><em className={styles.it}>sessiz</em></span></span>
          <span className={styles.ln}><span><span className={styles.underline}>aynanızda</span></span></span>
        </h1>

        <p className={styles.heroLede}>
          Nişantaşı&apos;nın sessiz bir köşesinde, sekiz uzman stilist ve seçilmiş doğal ürünlerle — saçtan cilde, makyajdan manikürün en ince ayrıntısına kadar size ait bir ritüel kuruyoruz.
        </p>

        <div className={styles.heroMeta}>
          <button className="btn-gold" onClick={() => scrollTo('randevu')}>
            Randevu Al
            <span className="arrow"></span>
          </button>
          <button className="btn-ghost" onClick={() => scrollTo('hizmetler')}>Hizmetleri Keşfet</button>
        </div>

        <div className={styles.socialProof}>
          <div className={styles.avatars}>
            <span style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=85')" }}></span>
            <span style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=120&q=85')" }}></span>
            <span style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=85')" }}></span>
            <span style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=85')" }}></span>
          </div>
          <div className={styles.pcopy}>
            <div className={styles.rating}>
              <span className={styles.starsMini}>★ ★ ★ ★ ★</span>
              <span>4.9 / 5.0</span>
            </div>
            <small>328+ misafirimizin yorumu üzerinden</small>
          </div>
        </div>
      </div>

      <div className={styles.heroArt}>
        <div className={styles.heroFrameSquare}></div>
        <div className={styles.heroSage}></div>
        <div className={styles.heroDot}></div>
        <div className={styles.heroTag}>Maison Lale — <strong>N°01 · Portre</strong></div>

        <div className={`${styles.heroImg} editorial`}>
          <div
            ref={imgRef}
            className={styles.ph}
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1200&q=85')" }}
          ></div>
          <span className={styles.cap}>Portre · İlkbahar &apos;26</span>
        </div>

        <div className={styles.bookingBadge}>
          <div className={styles.ico}>→</div>
          <div className={styles.info}>
            <small>Sonraki Müsait</small>
            <strong>Bugün · 16:30</strong>
            <span>Saç Kesimi · Defne ile</span>
          </div>
        </div>

        <div className={styles.signatureCard}>
          <div>
            <div className={styles.label}>Kurucu Stilist</div>
            <div className={styles.sigName}>Lale Yılmaz</div>
            <div className={styles.role}>12 Yıl · Vidal Sassoon</div>
          </div>
        </div>
      </div>

      <div ref={statsRef} className={styles.heroStats}>
        <div className={styles.s}>
          <span className={styles.n}><span data-count="12" data-suffix="+">12+</span></span>
          <span className={styles.l}>Yıllık Tecrübe</span>
          <span className={styles.sub}>2014&apos;ten bu yana</span>
        </div>
        <div className={styles.s}>
          <span className={styles.n}><span data-count="8" data-suffix="">8</span></span>
          <span className={styles.l}>Uzman Stilist</span>
          <span className={styles.sub}>Londra & Paris eğitimli</span>
        </div>
        <div className={styles.s}>
          <span className={styles.n}><span data-count="8500" data-suffix="+">8.5k+</span></span>
          <span className={styles.l}>Mutlu Misafir</span>
          <span className={styles.sub}>Geri dönüş oranı %92</span>
        </div>
        <div className={styles.s}>
          <span className={styles.n}><span data-count="4.9" data-suffix="">4.9</span></span>
          <span className={styles.l}>Müşteri Puanı</span>
          <span className={styles.sub}>328 Google yorumu</span>
        </div>
      </div>

      <div className={styles.scrollCue}>
        <span>Kaydır</span>
        <span className={styles.line}></span>
        <span>Hizmetler</span>
      </div>
    </header>
  );
}
