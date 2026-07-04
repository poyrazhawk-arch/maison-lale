'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import styles from './PageLoader.module.css';

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const isKoc = usePathname()?.startsWith('/koc');

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const tl = gsap.timeline();
    tl.to(el, {
      opacity: 0,
      duration: 0.4,
      delay: 1.1,
      ease: 'power2.in',
      onComplete: () => { el.style.display = 'none'; },
    });
  }, []);

  if (isKoc) return null;

  return (
    <div ref={loaderRef} className={styles.loader}>
      <div className={styles.bar}><div className={styles.barFill}></div></div>
    </div>
  );
}
