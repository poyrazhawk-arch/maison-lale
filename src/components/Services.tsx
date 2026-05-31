'use client';

import { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Services.module.css';

const services = [
  {
    num: 'N°01',
    title: 'Saç Kesimi',
    desc: 'Yüz hatlarınıza özel tasarlanan, klasik ve modern teknikleri harmanlayan kesim.',
    price: '₺850',
    img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1400&q=90',
  },
  {
    num: 'N°02',
    title: 'Renklendirme',
    desc: 'Balyaj, ombré, gölge tonları — saçınıza derinlik ve ışık veren renk çalışmaları.',
    price: '₺2.400',
    img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1400&q=90',
  },
  {
    num: 'N°03',
    title: 'Keratin Bakımı',
    desc: 'Yıpranmış saçları besleyen, ipeksi parlaklık ve kalıcı yumuşaklık veren bakım.',
    price: '₺1.800',
    img: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=1400&q=90',
  },
  {
    num: 'N°04',
    title: 'Cilt Bakımı',
    desc: 'Cildinizin ihtiyaçlarına göre kişiselleştirilen derin temizlik ve aydınlatma seansları.',
    price: '₺1.250',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=90',
  },
  {
    num: 'N°05',
    title: 'Makyaj',
    desc: 'Davet, gelinlik veya gündelik — bakışınızı sade bir zarafetle ortaya çıkaran makyaj.',
    price: '₺950',
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=90',
  },
  {
    num: 'N°06',
    title: 'Manikür',
    desc: 'Klasik bakım, jel, fransız ve sanat çalışmaları — ellerinize ait nazik bir dokunuş.',
    price: '₺550',
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1400&q=90',
  },
];

export default function Services({ salonName }: { salonName?: string }) {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper = new Swiper(swiperRef.current, {
      modules: [Pagination, A11y],
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 32 },
      },
    });

    return () => swiper.destroy();
  }, []);

  return (
    <section id="hizmetler" className="container">
      <div className="sec-head reveal">
        <div className="left">
          <div className="sec-num">— N°01 / Hizmetler</div>
          <h2 className="sec-title">
            Her detayı <em>özenle</em><br />tasarlanmış ritüeller.
          </h2>
        </div>
        <div className="right">
          Saçınızdan cildinize, ellerinizden bakışınıza — {salonName ? `${salonName}'de` : 'salonumuzda'} her hizmet, sizi yansıtan bir imza haline gelir.
        </div>
      </div>

      <div ref={swiperRef} className={`swiper ${styles.swiperWrap} reveal`}>
        <div className="swiper-wrapper">
          {services.map((svc) => (
            <div key={svc.num} className="swiper-slide">
              <a href="#randevu" className={styles.svc}>
                <div
                  className={styles.svcImg}
                  style={{ backgroundImage: `url('${svc.img}')` }}
                >
                  <span className={styles.num}>{svc.num}</span>
                </div>
                <div className={styles.svcBody}>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <div className={styles.price}>
                    <small>Başlangıç</small>
                    {svc.price}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </section>
  );
}
