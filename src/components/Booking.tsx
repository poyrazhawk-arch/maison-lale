'use client';

import { useState } from 'react';
import styles from './Booking.module.css';

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    (e.target as HTMLFormElement).reset();
  };

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
            Formu doldurun; ekibimiz 24 saat içinde sizinle iletişime geçerek tarihinizi onaylasın.
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="ad">Ad Soyad</label>
            <input id="ad" type="text" placeholder="İsminiz" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="tel">Telefon</label>
            <input id="tel" type="tel" placeholder="+90 5__ ___ __ __" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="tarih">Tercih Edilen Tarih</label>
            <input id="tarih" type="date" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="hizmet">Hizmet</label>
            <select id="hizmet" required defaultValue="">
              <option value="" disabled>Bir hizmet seçin</option>
              <option>Saç Kesimi</option>
              <option>Renklendirme</option>
              <option>Keratin Bakımı</option>
              <option>Cilt Bakımı</option>
              <option>Makyaj</option>
              <option>Manikür</option>
            </select>
          </div>
          <div className={`${styles.field} ${styles.col2}`}>
            <label htmlFor="not">Notunuz (opsiyonel)</label>
            <textarea id="not" rows={2} placeholder="Saat tercihi, özel istekler..."></textarea>
          </div>
          <div className={styles.formActions}>
            <p className={styles.note}>
              Formu göndererek, randevu onayı için ekibimizin sizinle iletişime geçmesine izin vermiş olursunuz.
            </p>
            <button type="submit" className={styles.btnGold2}>
              {submitted ? 'Teşekkürler — sizi arıyoruz' : 'Randevuyu Gönder'}
              {!submitted && <span className={styles.arrow}></span>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
