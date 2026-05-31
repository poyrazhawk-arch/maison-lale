'use client';

import { useState } from 'react';
import type { Salon } from '@/data/salons';
import styles from './HizmetlerPage.module.css';

type Service = { name: string; desc: string; price: string; duration?: string };
type Category = { id: string; label: string; icon: string; intro: string; services: Service[] };

const CATEGORIES: Category[] = [
  {
    id: 'sac',
    label: 'Saç',
    icon: '✂️',
    intro: 'Yüz hatlarınıza ve saç yapınıza özel olarak tasarlanan saç hizmetlerimiz, hem sağlık hem de estetik açıdan en iyi sonuçları sunar.',
    services: [
      { name: 'Kadın Saç Kesimi', desc: 'Yüz hatlarına özel klasik ve modern teknikleri harmanlayan profesyonel kesim.', price: '₺2.600', duration: '45 dk' },
      { name: 'Çocuk Saç Kesimi', desc: 'Çocuklara özel nazik ve hızlı kesim uygulaması.', price: '₺1.400', duration: '30 dk' },
      { name: 'Fön & Şekillendirme', desc: 'Hacimli, düz veya dalgalı — istediğiniz görünüm için uzman ellerde şekillendirme.', price: '₺1.000+', duration: '30 dk' },
      { name: 'Saç Boyama', desc: 'Tek renk profesyonel saç boyama uygulaması.', price: '₺4.500+', duration: '90 dk' },
      { name: 'Balayaj', desc: 'El boyaması tekniğiyle doğal güneş etkisi yaratan yumuşak geçişli renk.', price: '₺10.000+', duration: '3-4 saat' },
      { name: 'Highlight', desc: 'İnce ya da kalın dilimlerle saçınıza doğal ışıltı katın.', price: '₺10.000+', duration: '2-3 saat' },
      { name: 'Saç Keratini', desc: 'Yıpranmış saçları onararak ipeksi parlaklık ve kalıcı yumuşaklık sağlar.', price: '₺7.500+', duration: '2 saat' },
      { name: 'Saç Botoksu', desc: 'Kırılgan ve elektrikli saçlar için yoğun onarım bakımı.', price: '₺5.000+', duration: '90 dk' },
      { name: 'Gelin Saçı', desc: 'Özel gününüze özel, prova dahil profesyonel gelin saçı tasarımı.', price: 'Bilgi alın', duration: '60+ dk' },
    ],
  },
  {
    id: 'makyaj',
    label: 'Makyaj',
    icon: '💄',
    intro: 'Gündelik zarafetten gelin görkemliğine — her anınız için profesyonel makyaj sanatı.',
    services: [
      { name: 'Günlük & Davet Makyajı', desc: 'Doğal ışıltı veya göz alıcı bakışlar için günlük ve davet makyajı.', price: '₺5.000+', duration: '45 dk' },
      { name: 'VIP Makyaj', desc: 'Premium ürünler ve özel tekniklerle hazırlanan üst düzey makyaj.', price: '₺8.000', duration: '60 dk' },
      { name: 'Gelin Makyajı', desc: 'Uzun süreli, özel gün makyajı. Provası dahil, size özel renk paleti çalışması.', price: '₺15.000+', duration: '90 dk' },
      { name: 'Damat Paketi', desc: 'Saç kesimi, sakal düzenlemesi ve bakım dahil kapsamlı damat hazırlık paketi.', price: '₺8.500', duration: '60 dk' },
      { name: 'Airbrush Makyaj', desc: 'Kompresörle uygulanan ultra ince kaplama. Fotoğraf çekimleri için ideal.', price: '₺10.000', duration: '75 dk' },
    ],
  },
  {
    id: 'kirpik',
    label: 'İpek Kirpik',
    icon: '👁️',
    intro: 'Gözlerinizi konuşturun. Hollywood\'dan klasiğe, her modelde profesyonel ipek kirpik uygulaması.',
    services: [
      { name: 'İpek Kirpik — Classic', desc: 'Her kirpiğe tek tel uygulanan doğal görünümlü klasik model.', price: '₺1.900', duration: '90 dk' },
      { name: 'İpek Kirpik — Volume', desc: 'Hacimli ve dolgun görünüm için çok telli volume uygulaması.', price: '₺2.600', duration: '120 dk' },
      { name: 'İpek Kirpik — Hybrid', desc: 'Klasik ve volume tekniklerini birleştiren doğal ama belirgin model.', price: '₺2.600', duration: '120 dk' },
      { name: 'Hollywood / L Model', desc: 'Kıvrımlı ve kalkık, dramatik etki yaratan L model kirpik.', price: '₺3.200', duration: '150 dk' },
      { name: 'Kedi Gözü Kirpik', desc: 'Gözleri çekici ve baygın gösteren kedi gözü kirpik tasarımı.', price: '₺3.000', duration: '120 dk' },
      { name: 'Kirpik Lifting', desc: 'Kirpikleri yukarı kaldıran ve kıvırcıklaştıran kalıcı lift işlemi.', price: '₺2.300', duration: '60 dk' },
      { name: 'Kirpik Boyama', desc: 'Kirpiklere kalıcı renk ve yoğunluk katan boyama işlemi.', price: '₺500', duration: '20 dk' },
      { name: 'İpek Kirpik Çıkarma', desc: 'Mevcut ipek kirpiklerin güvenli şekilde çıkarılması.', price: '₺400', duration: '20 dk' },
    ],
  },
  {
    id: 'tirnak',
    label: 'Tırnak',
    icon: '💅',
    intro: 'Ellerinizin ve ayaklarınızın bakımını ihmal etmeyin. Kalıcıdan natürele, sanattan klasiğe her tarz burada.',
    services: [
      { name: 'Manikür + Kalıcı Oje', desc: 'Kütikül bakımı ve el maskesi dahil kalıcı oje uygulaması.', price: '₺1.000', duration: '60 dk' },
      { name: 'Islak Manikür Normal Oje', desc: 'Klasik ıslak manikür ve normal oje uygulaması.', price: '₺1.400', duration: '45 dk' },
      { name: 'Jel Protez Tırnak — Orta', desc: 'Manikür ve kalıcı oje dahil orta boy jel protez tırnak.', price: '₺2.000', duration: '90 dk' },
      { name: 'Jel Protez Tırnak — Uzun', desc: 'Manikür ve kalıcı oje dahil uzun boy jel protez tırnak.', price: '₺2.500', duration: '90 dk' },
      { name: 'Baby Boomer Tırnak', desc: 'Pembe-beyaz geçişli doğal görünümlü baby boomer model.', price: '₺3.000', duration: '90 dk' },
      { name: 'French Manikür', desc: 'Zamanın ötesinde klasik fransız ucu — temiz ve şık görünüm.', price: '₺400', duration: '45 dk' },
      { name: 'Nail Art', desc: 'Geometrik, çiçek veya özel tasarım nail art çalışmaları.', price: '₺100+/tırnak', duration: '10+ dk' },
      { name: 'Pedikür + Kalıcı Oje', desc: 'Kapsamlı ayak bakımı ve uzun süreli kalıcı oje.', price: '₺1.800', duration: '60 dk' },
      { name: 'VIP Pedikür', desc: 'Ekstra bakım adımları ve masaj dahil premium pedikür deneyimi.', price: '₺2.000', duration: '75 dk' },
    ],
  },
  {
    id: 'lazer',
    label: 'Lazer & Epilasyon',
    icon: '✨',
    intro: 'Diyot lazer teknolojisiyle kalıcı tüy azaltma. Bölgesel uygulamalar ve avantajlı paket seçenekleri mevcuttur.',
    services: [
      { name: 'Lazer — Yüz', desc: 'Üst dudak, çene veya yüz bölgesi lazer epilasyon seansı.', price: '₺600', duration: '15 dk' },
      { name: 'Lazer — Koltukaltı', desc: 'Koltukaltı bölgesi lazer epilasyon seansı.', price: '₺500', duration: '15 dk' },
      { name: 'Lazer — Yarım Bacak', desc: 'Diz altı veya diz üstü yarım bacak lazer epilasyon.', price: '₺600', duration: '20 dk' },
      { name: 'Lazer — Tüm Bacak', desc: 'Tam bacak lazer epilasyon seansı.', price: '₺1.000', duration: '40 dk' },
      { name: 'Lazer — Tüm Vücut (Kadın)', desc: 'Tüm vücut bölgelerini kapsayan tam lazer epilasyon seansı.', price: '₺5.200', duration: '90 dk' },
      { name: 'Lazer — Tüm Vücut (Erkek)', desc: 'Erkekler için tüm vücut lazer epilasyon seansı.', price: '₺5.900', duration: '90 dk' },
      { name: '6 Seans Paket — Tüm Vücut (Kadın)', desc: '6 seans tüm vücut lazer epilasyon paketi — avantajlı fiyat.', price: '₺18.000' },
      { name: '6 Seans Paket — Tüm Vücut (Erkek)', desc: '6 seans erkek tüm vücut lazer paketi.', price: '₺12.400' },
    ],
  },
  {
    id: 'mikroblading',
    label: 'Kaş & Kalıcı Makyaj',
    icon: '🖊️',
    intro: 'Kaşlarınızdan dudaklarınıza kadar kalıcı makyaj ve mikroblading hizmetleriyle her gün hazır görünün.',
    services: [
      { name: 'Microblading / Kaş Kontur', desc: 'El tekniğiyle yapılan, doğal tüy görünümlü kalıcı kaş çizimi.', price: '₺8.500', duration: '2 saat' },
      { name: 'Microblading Bakım', desc: 'İlk uygulamadan 4-6 hafta sonra yapılan dokunma bakımı.', price: '₺2.500', duration: '60 dk' },
      { name: 'Kaş Alma & Şekillendirme', desc: 'İplik veya ağda yöntemiyle profesyonel kaş şekillendirme.', price: '₺1.000', duration: '20 dk' },
      { name: 'Kaş Boyama', desc: 'Kaşlara renk ve yoğunluk katan profesyonel kaş boyama.', price: '₺700', duration: '20 dk' },
      { name: 'Kalıcı Eyeliner', desc: 'Üst veya alt göz kenarına kalıcı eyeliner dövmesi.', price: '₺7.000', duration: '90 dk' },
      { name: 'Dudak Kalıcı Makyaj', desc: 'Dudaklara şekil ve renk veren kalıcı makyaj uygulaması.', price: '₺7.500', duration: '2 saat' },
    ],
  },
];

export default function HizmetlerPage({ salon }: { salon: Salon }) {
  const [activeTab, setActiveTab] = useState('sac');
  const active = CATEGORIES.find(c => c.id === activeTab)!;

  const waUrl = salon.whatsappPhone
    ? `https://wa.me/${salon.whatsappPhone}?text=${encodeURIComponent(`Merhaba, ${salon.shortTitle}'den randevu almak istiyorum.`)}`
    : '#randevu';

  return (
    <main className={styles.page}>
      <div className="container">

        <div className={styles.disclaimer}>
          <span className={styles.disclaimerIcon}>ℹ️</span>
          <p>
            <strong>Demo Sayfası:</strong> Aşağıdaki hizmet listesi ve fiyatlar tamamen örnek amaçlıdır.
            {' '}{salon.shortTitle}&apos;nın gerçek hizmet detayları ve güncel fiyatları için lütfen
            {salon.whatsappPhone
              ? <a href={waUrl} target="_blank" rel="noopener"> WhatsApp&apos;tan ulaşın.</a>
              : ' doğrudan salonla iletişime geçin.'
            }
          </p>
        </div>

        <div className={styles.header}>
          <div className="sec-num">— Hizmet Listesi</div>
          <h1 className={styles.title}>
            {salon.shortTitle}<br />
            <em>Hizmetleri</em>
          </h1>
          <p className={styles.subtitle}>
            {salon.city} konumunda profesyonel güzellik hizmetleri.
            Her detay titizlikle düşünülmüş, uzman ekibimizle randevunuzu alın.
          </p>
        </div>

        <div className={styles.tabs}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.tab} ${activeTab === cat.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              <span className={styles.tabIcon}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.categorySection}>
          <div className={styles.categoryIntro}>
            <h2 className={styles.categoryTitle}>{active.icon} {active.label}</h2>
            <p className={styles.categoryDesc}>{active.intro}</p>
          </div>

          <div className={styles.grid}>
            {active.services.map((svc, i) => (
              <div key={i} className={`${styles.card} reveal`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNum}>N°{String(i + 1).padStart(2, '0')}</div>
                  {svc.duration && <div className={styles.cardDuration}>{svc.duration}</div>}
                </div>
                <h3 className={styles.cardName}>{svc.name}</h3>
                <p className={styles.cardDesc}>{svc.desc}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.cardPrice}>
                    <small>Başlangıç</small>
                    <span>{svc.price}</span>
                  </div>
                  <a href={waUrl} target="_blank" rel="noopener" className={styles.cardCta}>
                    Randevu Al →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottomCta}>
          <p>Fiyat veya hizmet detayları hakkında bilgi almak ister misiniz?</p>
          <a href={waUrl} target="_blank" rel="noopener" className="btn-gold">
            WhatsApp&apos;tan Yaz
            <span className="arrow"></span>
          </a>
        </div>

      </div>
    </main>
  );
}
