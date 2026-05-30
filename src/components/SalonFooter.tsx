import type { Salon } from '@/data/salons';
import styles from './Footer.module.css';

export default function SalonFooter({ salon }: { salon: Salon }) {
  const DAY_ORDER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const allDays = new Set(salon.hours.map(h => h.day));
  const closedDays = DAY_ORDER.filter(d => !allDays.has(d));

  return (
    <footer id="iletisim" className={styles.footer}>
      <div className="container">
        <div className={styles.footGrid}>
          <div className={styles.footBrand}>
            {salon.shortTitle}
            <p>{salon.city} konumunda profesyonel güzellik hizmetleri. Online randevu için WhatsApp&apos;tan ulaşın.</p>
          </div>

          <div className={styles.footCol}>
            <h4>İletişim</h4>
            <ul>
              {salon.street && <li>{salon.street}</li>}
              {salon.neighborhood && <li>{salon.neighborhood}, {salon.city}</li>}
              {!salon.neighborhood && salon.city && <li>{salon.city}</li>}
              {salon.phone && (
                <li><a href={`tel:${salon.phone}`}>{salon.phone}</a></li>
              )}
              {salon.whatsappPhone && (
                <li>
                  <a href={`https://wa.me/${salon.whatsappPhone}`} target="_blank" rel="noopener">
                    WhatsApp ile Yaz
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className={styles.footCol}>
            <h4>Çalışma Saatleri</h4>
            <ul>
              {salon.hours.length > 0 ? (
                salon.hours.map(h => (
                  <li key={h.day}>{h.day}: {h.open} – {h.close}</li>
                ))
              ) : (
                <li>Bilgi için arayınız</li>
              )}
              {closedDays.length > 0 && (
                <li>{closedDays.join(', ')} kapalı</li>
              )}
            </ul>
          </div>

          <div className={styles.footCol}>
            <h4>Randevu</h4>
            <ul>
              {salon.whatsappPhone && (
                <li>
                  <a href={`https://wa.me/${salon.whatsappPhone}`} target="_blank" rel="noopener">
                    WhatsApp
                  </a>
                </li>
              )}
              {salon.website && (
                <li><a href={salon.website} target="_blank" rel="noopener">Website</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.footBottom}>
          <span>© 2026 {salon.shortTitle}. Tüm hakları saklıdır.</span>
          <span className={styles.credit}>
            <a href="https://nixtagency.com" target="_blank" rel="noopener">nixtagency.com</a> tarafından tasarlanmıştır
          </span>
        </div>
      </div>
    </footer>
  );
}
