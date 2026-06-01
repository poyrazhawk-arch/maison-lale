'use client';

import { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Autoplay, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    quote: 'Yıllardır gittiğim hiçbir salon, Lale Hanım\'ın ekibinin verdiği özeni veremedi. Saçımın hem rengi hem dokusu bambaşka oldu — kapıdan dışarı adım atarken kendimi yeniden buluyorum.',
    name: 'Elif Akay',
    city: 'İstanbul',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85',
  },
  {
    quote: 'Düğünüm için makyajımı bu salonumda yaptırdım. Sadelik içinde bir zarafet — gün boyu hiç düzeltmek zorunda kalmadığım, fotoğraflarda bile kusursuz duran bir iz bıraktı.',
    name: 'Zeynep Demir',
    city: 'Bursa',
    avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=160&q=85',
  },
  {
    quote: 'Keratin bakımının ardından saçlarım altı aydır canlı, parlak ve bakımlı. Salonun atmosferi başlı başına bir terapi — kahvenizden çiçeklerine kadar her şey düşünülmüş.',
    name: 'Merve Kara',
    city: 'Ankara',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=85',
  },
];

export default function Testimonials() {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = new Swiper(swiperRef.current, {
      modules: [Autoplay, Pagination, A11y],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 0 },
        1024: { slidesPerView: 3, spaceBetween: 0 },
      },
    });

    return () => swiper.destroy();
  }, []);

  return (
    <section id="yorumlar" className={`container ${styles.testi}`}>
      <div className="sec-head reveal">
        <div className="left">
          <div className="sec-num">— N°04 / Yorumlar</div>
          <h2 className="sec-title">
            Sözcükler <em>misafirlerimizden.</em>
          </h2>
        </div>
        <div className="right">
          Üç yüzden fazla 5 yıldızlı yorum arasından seçtiğimiz birkaç satır.
        </div>
      </div>

      <div ref={swiperRef} className={`swiper ${styles.swiperWrap} reveal`}>
        <div className={`swiper-wrapper ${styles.testiGrid}`}>
          {testimonials.map((t, i) => (
            <article key={i} className={`swiper-slide ${styles.t}`}>
              <div className={styles.stars}>★ ★ ★ ★ ★</div>
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.who}>
                <div
                  className={styles.av}
                  style={{ backgroundImage: `url('${t.avatar}')` }}
                ></div>
                <div className={styles.info}>
                  <span className={styles.nm}>{t.name}</span>
                  <span className={styles.role}>{t.city}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="swiper-pagination" style={{ marginTop: '24px', position: 'relative' }}></div>
      </div>
    </section>
  );
}
