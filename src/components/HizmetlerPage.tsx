'use client';

import { useState } from 'react';
import type { Salon } from '@/data/salons';
import styles from './HizmetlerPage.module.css';

type Service = {
  name: string;
  desc: string;
  price: string;
  duration?: string;
};

type Category = {
  id: string;
  label: string;
  icon: string;
  intro: string;
  services: Service[];
};

const CATEGORIES: Category[] = [
  {
    id: 'sac',
    label: 'Saç',
    icon: '✂️',
    intro: 'Yüz hatlarınıza ve saç yapınıza özel olarak tasarlanan saç hizmetlerimiz, hem sağlık hem de estetik açıdan en iyi sonuçları sunar.',
    services: [
      { name: 'Saç Kesimi', desc: 'Yüz hatlarına özel, klasik ve modern teknikleri harmanlayan profesyonel kesim.', price: '₺850', duration: '45 dk' },
      { name: 'Fön & Şekillendirme', desc: 'Hacimli, düz veya dalgalı — istediğiniz görünüm için uzman ellerde şekillendirme.', price: '₺450', duration: '30 dk' },
      { name: 'Renklendirme', desc: 'Tek renk, balyaj veya ombré tekniğiyle saçınıza derinlik ve ışık katın.', price: '₺2.400', duration: '2-3 saat' },
      { name: 'Balyaj', desc: 'El boyaması tekniğiyle doğal güneş etkisi yaratan, yumuşak geçişli renk uygulaması.', price: '₺3.200', duration: '3-4 saat' },
      { name: 'Keratin Bakımı', desc: 'Kırık ve yıpranmış saçları onaran, ipeksi parlaklık ve kalıcı yumuşaklık veren bakım.', price: '₺1.800', duration: '2 saat' },
      { name: 'Saç Bakım Maskesi', desc: 'Onarıcı ve nemlendirici içeriklerle derin bakım. Saçın esnekliğini ve parlaklığını geri kazandırır.', price: '₺600', duration: '45 dk' },
    ],
  },
  {
    id: 'cilt',
    label: 'Cilt Bakımı',
    icon: '🌿',
    intro: 'Cildinizin benzersiz ihtiyaçlarına göre kişiselleştirilen bakım protokolleriyle görünür sonuçlar elde edin.',
    services: [
      { name: 'Klasik Yüz Bakımı', desc: 'Derin temizlik, peeling, nemlendirme ve maske adımlarıyla cildinizi yenileyen temel bakım.', price: '₺950', duration: '60 dk' },
      { name: 'HydraFacial', desc: 'Nemlendirme, temizlik ve serum infüzyonunu tek seansta birleştiren özel cihazlı bakım.', price: '₺2.200', duration: '75 dk' },
      { name: 'Kimyasal Peeling', desc: 'Ölü hücreleri temizleyen, leke ve kırışıklıkları azaltan asit bazlı yüzey yenileme.', price: '₺1.400', duration: '45 dk' },
      { name: 'Leke Tedavisi', desc: 'Güneş lekeleri, melazma ve akne izleri için hedefli serum ve teknoloji kombinasyonu.', price: '₺1.800', duration: '60 dk' },
      { name: 'Göz Çevresi Bakımı', desc: 'İnce çizgiler ve morluklara karşı yoğun nemlendirici peptid içerikli göz bakımı.', price: '₺750', duration: '30 dk' },
    ],
  },
  {
    id: 'makyaj',
    label: 'Makyaj',
    icon: '💄',
    intro: 'Gündelik zarafetten gelin görkemligine — her anınız için profesyonel makyaj sanatı.',
    services: [
      { name: 'Günlük Makyaj', desc: 'Doğal ışıltı veya göz alıcı bakışlar için günlük ve davet makyajı.', price: '₺950', duration: '45 dk' },
      { name: 'Gelin Makyajı', desc: 'Uzun süreli, özel gün makyajı. Provası dahil, size özel renk paleti çalışması.', price: '₺3.500', duration: '90 dk' },
      { name: 'Gece & Davet Makyajı', desc: 'Dramatik, etkileyici ve uzun süre kalıcı davet makyajı.', price: '₺1.400', duration: '60 dk' },
      { name: 'Airbrush Makyaj', desc: 'Kompresörle uygulanan ultra ince kaplama. Fotoğraf ve video çekimleri için ideal.', price: '₺2.000', duration: '75 dk' },
    ],
  },
  {
    id: 'tirnak',
    label: 'Tırnak',
    icon: '💅',
    intro: 'Ellerinizin ve ayaklarınızın bakımını ihmal etmeyin. Kalıcıdan natürele, sanattan klasiğe her tarz burada.',
    services: [
      { name: 'Klasik Manikür', desc: 'Şekillendirme, kütikül bakımı ve renklendirme dahil temel manikür.', price: '₺550', duration: '45 dk' },
      { name: 'Kalıcı Oje (Jel)', desc: '2-3 hafta kalıcılık sağlayan jel oje uygulaması. Geniş renk skalası.', price: '₺750', duration: '60 dk' },
      { name: 'Protez Tırnak', desc: 'Akrilik veya jel ile uzatma. Kırık ve kısa tırnaklar için doğal görünümlü çözüm.', price: '₺1.200', duration: '90 dk' },
      { name: 'Fransız Manikür', desc: 'Zamanın ötesinde klasik fransız ucu; temiz, şık ve her ortama uygun.', price: '₺850', duration: '60 dk' },
      { name: 'Pedikür', desc: 'Ayak bakımı, ölü deri temizleme, tırnak şekillendirme ve renklendirme.', price: '₺700', duration: '60 dk' },
      { name: 'Tırnak Sanatı', desc: 'Geometrik, çiçek, ombre veya özel tasarım. Tırnaklarınız bir tuval.', price: '₺1.000+', duration: '75 dk' },
    ],
  },
  {
    id: 'epilasyon',
    label: 'Epilasyon',
    icon: '✨',
    intro: 'Kalıcı veya geçici yöntemlerle pürüzsüz ve bakımlı bir cilt için uzman epilasyon hizmetleri.',
    services: [
      { name: 'Ağda (Bölgesel)', desc: 'Yüz, koltuk, bacak veya bikinili bölge için ağda uygulaması.', price: '₺300+', duration: '15-30 dk' },
      { name: 'Tam Bacak Ağda', desc: 'Yumuşak veya sert ağda ile tam bacak uygulama.', price: '₺650', duration: '45 dk' },
      { name: 'İplik Epilasyon', desc: 'Kaş şekillendirme ve yüz bölgesi için hassas iplik yöntemi.', price: '₺200', duration: '15 dk' },
      { name: 'Lazer Epilasyon (Seans)', desc: 'Diyot lazer teknolojisiyle kalıcı tüy azaltma. Paket fiyatları için bilgi alın.', price: '₺800+', duration: '30-60 dk' },
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

        {/* Disclaimer */}
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

        {/* Header */}
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

        {/* Category Tabs */}
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

        {/* Category Content */}
        <div className={styles.categorySection}>
          <div className={styles.categoryIntro}>
            <h2 className={styles.categoryTitle}>
              {active.icon} {active.label}
            </h2>
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
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener"
                    className={styles.cardCta}
                  >
                    Randevu Al →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
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
