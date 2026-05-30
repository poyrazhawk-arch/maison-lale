import { getSalons } from '@/data/salons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Güzellik Salonları — Tüm Salonlar',
};

export default function SalonsIndex() {
  const salons = getSalons();

  const byCityMap = new Map<string, typeof salons>();
  for (const s of salons) {
    const city = s.city || 'Diğer';
    if (!byCityMap.has(city)) byCityMap.set(city, []);
    byCityMap.get(city)!.push(s);
  }
  const cities = [...byCityMap.entries()].sort((a, b) => a[0].localeCompare(b[0], 'tr'));

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px', fontFamily: 'var(--sans)', background: 'var(--cream)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 'clamp(36px, 6vw, 72px)', marginBottom: 8 }}>
        Tüm Salonlar <em style={{ color: 'var(--gold-2)', fontWeight: 400 }}>({salons.length})</em>
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 48 }}>Her salon kendi sayfasına sahip — aşağıdan önizleyin.</p>

      {cities.map(([city, citySalons]) => (
        <section key={city} style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 300, borderBottom: '1px solid var(--line)', paddingBottom: 10, marginBottom: 20 }}>
            {city} <span style={{ fontSize: 16, color: 'var(--muted)', fontStyle: 'italic' }}>({citySalons.length})</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {citySalons.map(s => (
              <a
                key={s.slug}
                href={`/${s.slug}`}
                style={{
                  display: 'block', padding: '16px 20px',
                  background: 'var(--cream-2)', borderRadius: 4,
                  border: '1px solid var(--line)',
                  textDecoration: 'none', color: 'var(--ink)',
                  transition: 'box-shadow .2s ease',
                }}
              >
                <div style={{ fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 4 }}>{s.shortTitle}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '.04em' }}>{s.street}</div>
                {s.rating && (
                  <div style={{ fontSize: 12, color: 'var(--gold-2)', marginTop: 6 }}>
                    ★ {s.rating} {s.reviewsCount ? `· ${s.reviewsCount} yorum` : ''}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
