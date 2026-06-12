'use client';

import type { Salon } from '@/data/salons';
import { locative } from '@/lib/turkish';
import styles from './Hero.module.css';

export default function SalonHero({ salon }: { salon: Salon }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const location = salon.neighborhood
    ? `${salon.neighborhood} · ${salon.city}`
    : salon.city;

  // Split title into words for the animated headline
  const words = salon.shortTitle.split(' ').slice(0, 3);
  const line1 = words[0] || salon.shortTitle;
  const line2 = words[1] || '';
  const line3 = words.slice(2).join(' ') || '';

  return (
    <header id="top" className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.editionStamp}>
          <span className={styles.vol}>Güzellik Salonu</span>
          <span className={styles.bar}></span>
          <span>{location}</span>
        </div>

        <div className={styles.live}>
          <span className={styles.pulse}></span>
          Online randevu <strong>alın</strong>
        </div>

        <h1 className={styles.h1}>
          <span className={styles.ln}><span>{line1}</span></span>
          {line2 && <span className={styles.ln}><span><em className={styles.it}>{line2}</em></span></span>}
          {line3 && <span className={styles.ln}><span><span className={styles.underline}>{line3}</span></span></span>}
        </h1>

        <p className={styles.heroLede}>
          {salon.city}{locative(salon.city)} profesyonel güzellik hizmetleri. Saç kesimi, renklendirme, cilt bakımı, makyaj ve daha fazlası için hemen randevu alın.
        </p>

        <div className={styles.heroMeta}>
          <a className="btn-gold" href={`/randevular?salon=${encodeURIComponent(salon.shortTitle)}`}>
            Randevu Al
            <span className="arrow"></span>
          </a>
          <button className="btn-ghost" onClick={() => scrollTo('hizmetler')}>Hizmetleri Keşfet</button>
        </div>

        {(salon.rating || salon.reviewsCount) && (
          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              <span style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=85')" }}></span>
              <span style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=120&q=85')" }}></span>
              <span style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=85')" }}></span>
            </div>
            <div className={styles.pcopy}>
              {salon.rating && (
                <div className={styles.rating}>
                  <span className={styles.starsMini}>★ ★ ★ ★ ★</span>
                  <span>{salon.rating} / 5.0</span>
                </div>
              )}
              {salon.reviewsCount && (
                <small>{salon.reviewsCount}+ müşteri yorumu</small>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.heroArt}>
        <div className={styles.heroFrameSquare}></div>
        <div className={styles.heroSage}></div>
        <div className={styles.heroDot}></div>

        <div className={`${styles.heroImg} editorial`}>
          <div
            className={styles.ph}
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=1600&q=90')" }}
          ></div>
          <span className={styles.cap}>Güzellik Salonu · {salon.city}</span>
        </div>

        <div className={styles.bookingBadge}>
          <div className={styles.ico}>→</div>
          <div className={styles.info}>
            <small>Online Randevu</small>
            <strong>WhatsApp ile Al</strong>
            <span>Hızlı & Kolay</span>
          </div>
        </div>

        <div className={styles.signatureCard}>
          <div>
            <div className={styles.label}>Güzellik Merkezi</div>
            <div className={styles.sigName}>{salon.shortTitle}</div>
            <div className={styles.role}>{salon.city}</div>
          </div>
        </div>
      </div>

      <div className={styles.heroStats}>
        {salon.rating && (
          <div className={styles.s}>
            <span className={styles.n}>{salon.rating}<em>★</em></span>
            <span className={styles.l}>Google Puanı</span>
            <span className={styles.sub}>Müşteri değerlendirmesi</span>
          </div>
        )}
        {salon.reviewsCount && (
          <div className={styles.s}>
            <span className={styles.n}>{salon.reviewsCount}<em>+</em></span>
            <span className={styles.l}>Yorum</span>
            <span className={styles.sub}>Doğrulanmış Google yorumu</span>
          </div>
        )}
        <div className={styles.s}>
          <span className={styles.n}>6</span>
          <span className={styles.l}>Hizmet</span>
          <span className={styles.sub}>Saç, cilt, makyaj ve daha fazlası</span>
        </div>
        <div className={styles.s}>
          <span className={styles.n}>WA</span>
          <span className={styles.l}>WhatsApp Randevu</span>
          <span className={styles.sub}>Anında onay</span>
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
