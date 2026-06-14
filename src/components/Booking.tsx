import styles from './Booking.module.css';

export default function Booking() {
  return (
    <section id="randevu" className={styles.booking}>
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <div className="sec-num" style={{ color: 'var(--gold)' }}>— N°03 / Randevu</div>
            <h2 className="sec-title" style={{ color: 'var(--cream)' }}>
              Sizi <em style={{ color: 'var(--gold)' }}>bekliyoruz.</em>
            </h2>
          </div>
          <div className="right" style={{ color: 'rgba(244,236,220,0.7)' }}>
            Boş günleri takvimde görüp saniyeler içinde randevunuzu oluşturun.
          </div>
        </div>

        <div className={styles.calCta}>
          <p className={styles.calCtaText}>
            Tarih seçin → Saati belirleyin → Randevunuz anında kayıt altına alınsın.
          </p>
          <a href="/randevular" className={styles.btnGold2}>
            Takvimi Aç & Randevu Al
            <span className={styles.arrow}></span>
          </a>
        </div>
      </div>
    </section>
  );
}
