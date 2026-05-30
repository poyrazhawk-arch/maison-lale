import styles from './About.module.css';

export default function About() {
  return (
    <section id="hakkimizda" className="container">
      <div className={`${styles.about} reveal`}>
        <div
          className={`${styles.aboutImg} editorial`}
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=85')" }}
        >
          <span className={styles.label}>ATELIER — NIŞANTAŞI</span>
          <div className={styles.badge} style={{ zIndex: 5 }}>
            Maison<br />Lale<span>Since 2014</span>
          </div>
        </div>

        <div className={styles.aboutText}>
          <div className="sec-num" style={{ marginBottom: '14px' }}>— N°02 / Hakkımızda</div>
          <h2>
            Bir salondan <em>fazlası</em> —<br />bir ritüel.
          </h2>
          <p>
            Maison Lale, 2014 yılında Nişantaşı&apos;nın sessiz bir köşesinde, güzelliği bir gösteri değil; bir an olarak yeniden tanımlamak için kuruldu. Mermer zeminler, sıcak ışıklar ve seçilmiş çiçekler arasında, ekibimizin her bir dokunuşu; size ait bir hikâyenin parçası olur.
          </p>
          <p>
            Saçtan cilde, makyajdan manikürün en ince ayrıntısına — sadece en saf doğal ürünleri ve dünyanın önde gelen profesyonel markalarını seçiyoruz. Çünkü güzellik, aceleye getirilmemesi gereken bir özendir.
          </p>
          <div className={styles.sig}>— Lale Yılmaz, Kurucu</div>
          <div className={styles.aboutMeta}>
            <div className={styles.m}>
              <span className={styles.n}>2014</span>
              <span className={styles.l}>Kuruluş Yılı</span>
            </div>
            <div className={styles.m}>
              <span className={styles.n}>8.500+</span>
              <span className={styles.l}>Mutlu Müşteri</span>
            </div>
            <div className={styles.m}>
              <span className={styles.n}>14</span>
              <span className={styles.l}>Marka Ortağı</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
