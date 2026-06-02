import type { Salon } from '@/data/salons';
import styles from './About.module.css';

export default function SalonAbout({ salon }: { salon: Salon }) {
  // Format hours for display
  const hoursDisplay = formatHours(salon.hours);

  return (
    <section id="hakkimizda" className="container">
      <div className={`${styles.about} reveal`}>
        <div
          className={`${styles.aboutImg} editorial`}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=85')" }}
        >
          <span className={styles.label}>{salon.city.toUpperCase()}</span>
          <div className={styles.badge} style={{ zIndex: 5 }}>
            {salon.shortTitle.split(' ')[0]}<br />{salon.shortTitle.split(' ').slice(1).join(' ') || salon.city}
            <span>{salon.city}</span>
          </div>
        </div>

        <div className={styles.aboutText}>
          <div className="sec-num" style={{ marginBottom: '14px' }}>— N°02 / Hakkımızda</div>
          <h2>
            Profesyonel güzellik, <em>sizin için.</em>
          </h2>
          <p>
            {salon.shortTitle}, {salon.city} konumunda müşterilerine en kaliteli güzellik hizmetlerini sunmaktadır. Uzman ekibimizle saç, cilt, makyaj ve daha fazlası için buradayız.
          </p>
          {salon.street && (
            <p className={styles.infoItem}>
              {salon.street}{salon.neighborhood ? `, ${salon.neighborhood}` : ''}, {salon.city}
            </p>
          )}
          {salon.phone && (
            <p className={styles.infoItem}>
              <a href={`tel:${salon.phone}`} style={{ color: 'var(--gold-2)' }}>{salon.phone}</a>
            </p>
          )}

          {hoursDisplay && (
            <div className={styles.infoHours}>
              {hoursDisplay}
            </div>
          )}

          <div className={styles.aboutMeta}>
            {salon.rating && (
              <div className={styles.m}>
                <span className={styles.n}>{salon.rating}★</span>
                <span className={styles.l}>Google Puanı</span>
              </div>
            )}
            {salon.reviewsCount && (
              <div className={styles.m}>
                <span className={styles.n}>{salon.reviewsCount}+</span>
                <span className={styles.l}>Müşteri Yorumu</span>
              </div>
            )}
            <div className={styles.m}>
              <span className={styles.n}>6</span>
              <span className={styles.l}>Hizmet Çeşidi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatHours(hours: Salon['hours']): string {
  if (!hours.length) return '';

  // Group consecutive days with same hours
  const parts: string[] = [];
  let i = 0;
  while (i < hours.length) {
    const { day, open, close } = hours[i];
    let j = i + 1;
    while (j < hours.length && hours[j].open === open && hours[j].close === close) j++;
    if (j - i > 2) {
      parts.push(`${day}–${hours[j - 1].day}: ${open} – ${close}`);
    } else {
      for (let k = i; k < j; k++) {
        parts.push(`${hours[k].day}: ${hours[k].open} – ${hours[k].close}`);
      }
    }
    i = j;
  }
  return parts.join(' · ');
}
