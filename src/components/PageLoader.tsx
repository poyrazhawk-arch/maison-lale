'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './PageLoader.module.css';

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const tl = gsap.timeline();
    tl.from(el.querySelector(`.${styles.text}`), {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
    })
      .to(el, {
        opacity: 0,
        duration: 0.5,
        delay: 0.4,
        ease: 'power2.in',
        onComplete: () => { el.style.display = 'none'; },
      });
  }, []);

  return (
    <div ref={loaderRef} className={styles.loader}>
      <span className={styles.text}>Maison <em>Lale</em></span>
    </div>
  );
}
