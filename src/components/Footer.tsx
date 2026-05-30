import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="iletisim" className={styles.footer}>
      <div className="container">
        <div className={styles.footGrid}>
          <div className={styles.footBrand}>
            Maison <em>Lale</em>
            <p>Nişantaşı&apos;nın sessiz bir köşesinde, güzelliği bir an olarak yeniden tanımlıyoruz. 2014&apos;ten bu yana, özenle.</p>
          </div>

          <div className={styles.footCol}>
            <h4>İletişim</h4>
            <ul>
              <li>Teşvikiye Cad. No: 47</li>
              <li>Nişantaşı, İstanbul</li>
              <li><a href="tel:+902122000000">+90 212 200 00 00</a></li>
              <li><a href="mailto:hello@maisonlale.com">hello@maisonlale.com</a></li>
            </ul>
          </div>

          <div className={styles.footCol}>
            <h4>Çalışma Saatleri</h4>
            <ul>
              <li>Pazartesi — Cumartesi</li>
              <li>10:00 — 20:00</li>
              <li>Pazar günleri kapalıdır</li>
            </ul>
          </div>

          <div className={styles.footCol}>
            <h4>Takip Edin</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footBottom}>
          <span>© 2026 Maison Lale. Tüm hakları saklıdır.</span>
          <span className={styles.credit}>
            <a href="https://nixtagency.com" target="_blank" rel="noopener">nixtagency.com</a> tarafından tasarlanmıştır
          </span>
        </div>
      </div>
    </footer>
  );
}
