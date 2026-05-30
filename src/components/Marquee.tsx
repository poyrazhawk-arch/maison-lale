import styles from './Marquee.module.css';

export default function Marquee() {
  const items = ['Saç Kesimi', 'Renklendirme', 'Keratin Bakımı', 'Cilt Bakımı', 'Makyaj', 'Manikür'];
  const repeated = [...items, ...items];

  return (
    <div className={styles.marqueeWrap} aria-hidden="true">
      <div className={styles.marquee}>
        <span>
          {repeated.map((item, i) => (
            <span key={i}>
              {item}
              {i < repeated.length - 1 && <span className={styles.dot}></span>}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
