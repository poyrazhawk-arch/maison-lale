'use client';

import dynamic from 'next/dynamic';

// Veriler localStorage'da yaşadığı için uygulama yalnızca istemcide render edilir;
// böylece state doğrudan depodan başlatılır ve hydration uyuşmazlığı olmaz.
const KocApp = dynamic(() => import('./KocApp'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100dvh', background: '#0c0d0b' }} />,
});

export default function KocShell() {
  return <KocApp />;
}
