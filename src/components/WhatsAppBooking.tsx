'use client';

import { useState } from 'react';
import styles from './Booking.module.css';

interface Props {
  whatsappPhone: string;
  salonName: string;
}

export default function WhatsAppBooking({ whatsappPhone, salonName }: Props) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get('ad') as string;
    const phone = data.get('tel') as string;
    const date = data.get('tarih') as string;
    const service = data.get('hizmet') as string;
    const note = data.get('not') as string;

    const message = [
      `Merhaba, *${salonName}* için randevu almak istiyorum.`,
      '',
      `👤 *Ad Soyad:* ${name}`,
      `📞 *Telefon:* ${phone}`,
      `📅 *Tercih Edilen Tarih:* ${date}`,
      `💅 *Hizmet:* ${service}`,
      note ? `📝 *Not:* ${note}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="randevu" className={styles.booking}>
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <div className={`sec-num ${styles.sectionNum}`}>— N°03 / Randevu</div>
            <h2 className={`sec-title ${styles.sectionTitle}`}>
              Sizi <em className={styles.sectionTitleEm}>bekliyoruz.</em>
            </h2>
          </div>
          <div className={`right ${styles.rightCol}`}>
            Formu doldurun; randevu detaylarınız WhatsApp üzerinden anında iletilsin.
            <a href="/randevular" className={styles.calLink}>
              Online Takvimden Randevu Al →
            </a>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="ad">Ad Soyad</label>
            <input id="ad" name="ad" type="text" placeholder="İsminiz" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="tel">Telefon</label>
            <input id="tel" name="tel" type="tel" placeholder="+90 5__ ___ __ __" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="tarih">Tercih Edilen Tarih</label>
            <input id="tarih" name="tarih" type="date" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="hizmet">Hizmet</label>
            <select id="hizmet" name="hizmet" required defaultValue="">
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
            <textarea id="not" name="not" rows={2} placeholder="Saat tercihi, özel istekler..."></textarea>
          </div>
          <div className={styles.formActions}>
            <p className={styles.note}>
              Formu göndererek WhatsApp uygulaması açılacak — mesajı onaylamanız yeterli.
            </p>
            <button type="submit" className={styles.btnGold2}>
              {sent ? '✓ WhatsApp Açıldı' : (
                <>WhatsApp ile Gönder <span className={styles.arrow}></span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
