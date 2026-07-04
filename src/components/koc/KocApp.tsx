'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildCoachPlan,
  COLLECTION_DAYS,
  DEFAULT_SETTINGS,
  estimateMaintenance,
  sortEntries,
  todayStr,
  type DayEntry,
  type MsgLevel,
  type Settings,
} from '@/lib/coach';
import { BarChart, WeightChart } from './KocCharts';
import styles from './Koc.module.css';

const ENTRIES_KEY = 'koc.entries.v1';
const SETTINGS_KEY = 'koc.settings.v1';

const LEVEL_META: Record<MsgLevel, { icon: string; label: string }> = {
  good: { icon: '✓', label: 'İyi' },
  info: { icon: 'i', label: 'Not' },
  warning: { icon: '!', label: 'Dikkat' },
  serious: { icon: '!!', label: 'Uyarı' },
};

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

function fmtDateLong(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${d} ${MONTHS_TR[m - 1]} ${DAYS_TR[dt.getDay()]}`;
}

interface FormState {
  date: string;
  weight: string;
  kcal: string;
  protein: string;
  carb: string;
  fat: string;
  steps: string;
  bodyFat: string;
}

function emptyForm(date: string): FormState {
  return { date, weight: '', kcal: '', protein: '', carb: '', fat: '', steps: '', bodyFat: '' };
}

function entryToForm(e: DayEntry): FormState {
  return {
    date: e.date,
    weight: e.weight?.toString() ?? '',
    kcal: e.kcal?.toString() ?? '',
    protein: e.protein?.toString() ?? '',
    carb: e.carb?.toString() ?? '',
    fat: e.fat?.toString() ?? '',
    steps: e.steps?.toString() ?? '',
    bodyFat: e.bodyFat?.toString() ?? '',
  };
}

function num(s: string): number | undefined {
  const v = parseFloat(s.replace(',', '.'));
  return Number.isFinite(v) && v > 0 ? v : undefined;
}

function loadEntries(): DayEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // bozuk veri — boş başla
  }
  return [];
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // bozuk veri — varsayılanla devam
  }
  return DEFAULT_SETTINGS;
}

// Bu bileşen yalnızca istemcide render edilir (KocShell, ssr: false) —
// state doğrudan localStorage'dan başlatılabilir.
export default function KocApp() {
  const [entries, setEntries] = useState<DayEntry[]>(loadEntries);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [form, setForm] = useState<FormState>(() => {
    const t = todayStr();
    const existing = loadEntries().find(e => e.date === t);
    return existing ? entryToForm(existing) : emptyForm(t);
  });
  const [chartTab, setChartTab] = useState<'kilo' | 'kalori' | 'adim'>('kilo');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Sayfa arka planını uygulama temasına çevir (salon global stillerini ez)
  useEffect(() => {
    const prev = document.documentElement.style.background;
    document.documentElement.style.background = '#0c0d0b';
    document.documentElement.classList.add('koc-mode');
    return () => {
      document.documentElement.style.background = prev;
      document.documentElement.classList.remove('koc-mode');
    };
  }, []);

  const est = useMemo(() => estimateMaintenance(entries, settings), [entries, settings]);
  const plan = useMemo(() => buildCoachPlan(entries, settings, est), [entries, settings, est]);

  const sorted = useMemo(() => sortEntries(entries), [entries]);
  const todayEntry = sorted.find(e => e.date === todayStr());

  const onDateChange = (date: string) => {
    const existing = entries.find(e => e.date === date);
    setForm(existing ? entryToForm(existing) : emptyForm(date));
  };

  const saveEntry = () => {
    if (!form.date) return;
    const entry: DayEntry = {
      date: form.date,
      weight: num(form.weight),
      kcal: num(form.kcal),
      protein: num(form.protein),
      carb: num(form.carb),
      fat: num(form.fat),
      steps: num(form.steps),
      bodyFat: num(form.bodyFat),
    };
    const hasData = Object.entries(entry).some(([k, v]) => k !== 'date' && v != null);
    if (!hasData) return;
    setEntries(prev => [...prev.filter(e => e.date !== entry.date), entry]);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const deleteEntry = (date: string) => {
    if (!confirm(`${fmtDateLong(date)} kaydı silinsin mi?`)) return;
    setEntries(prev => prev.filter(e => e.date !== date));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ entries, settings }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koc-yedek-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data.entries)) setEntries(data.entries);
        if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        alert('Yedek geri yüklendi.');
      } catch {
        alert('Dosya okunamadı — geçerli bir KOÇ yedeği değil.');
      }
    };
    reader.readAsText(file);
  };

  const resetAll = () => {
    if (!confirm('TÜM veriler silinecek. Emin misin?')) return;
    if (!confirm('Son kez soruyorum: her şey silinsin mi?')) return;
    setEntries([]);
    setSettings(DEFAULT_SETTINGS);
  };

  const bigNumber = est.ready && est.maintenance != null ? est.maintenance : null;
  const progress = Math.min(1, est.loggedDays / COLLECTION_DAYS);

  return (
    <main className={styles.app}>
      {/* ÜST BAR */}
      <header className={styles.topbar}>
        <span className={styles.logo}>KOÇ</span>
        <div className={styles.topbarRight}>
          <span className={`${styles.phaseChip} ${settings.phase === 'bulk' ? styles.phaseBulk : ''}`}>
            {plan.phaseLabel}
          </span>
          <button
            className={styles.iconBtn}
            aria-label="Ayarlar"
            onClick={() => setSettingsOpen(true)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.06-.4.1-.8.1-1.2Z" />
            </svg>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        {bigNumber != null ? (
          <>
            <p className={styles.heroLabel}>Koruma kalorin</p>
            <p className={styles.heroNumber}>
              {bigNumber.toLocaleString('tr-TR')}
              <span className={styles.heroUnit}>kcal</span>
            </p>
            <p className={styles.heroSub}>
              ±{est.confidence} kcal · son {est.windowDays} günün gidişatından
            </p>
          </>
        ) : (
          <>
            <p className={styles.heroLabel}>Veri toplama dönemi</p>
            <p className={styles.heroNumber}>
              {est.loggedDays}
              <span className={styles.heroUnit}>/ {COLLECTION_DAYS} gün</span>
            </p>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
            </div>
            <p className={styles.heroSub}>
              Geçici tahmin ~{est.roughGuess.toLocaleString('tr-TR')} kcal · {COLLECTION_DAYS} gün
              kilo + kalori girince gerçek rakamı hesaplıyorum
            </p>
          </>
        )}

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Bugünkü hedef</span>
            <span className={styles.statValue}>
              {plan.targetKcal.toLocaleString('tr-TR')} <em>kcal</em>
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Trend kilo</span>
            <span className={styles.statValue}>
              {est.currentTrendWeight != null ? est.currentTrendWeight.toFixed(1) : '—'} <em>kg</em>
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Haftalık</span>
            <span className={styles.statValue}>
              {est.slopePerWeek != null
                ? `${est.slopePerWeek > 0 ? '+' : ''}${est.slopePerWeek.toFixed(2)}`
                : '—'}{' '}
              <em>kg</em>
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Protein hedefi</span>
            <span className={styles.statValue}>
              {plan.targetProtein} <em>g</em>
            </span>
          </div>
        </div>

        {todayEntry?.kcal != null && (
          <div className={styles.todayBar}>
            <div className={styles.todayBarHead}>
              <span>Bugün: {todayEntry.kcal.toLocaleString('tr-TR')} kcal</span>
              <span>
                {todayEntry.kcal <= plan.targetKcal
                  ? `${(plan.targetKcal - todayEntry.kcal).toLocaleString('tr-TR')} kcal kaldı`
                  : `hedefin ${(todayEntry.kcal - plan.targetKcal).toLocaleString('tr-TR')} üstünde`}
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={`${styles.progressFill} ${todayEntry.kcal > plan.targetKcal * 1.05 ? styles.progressOver : ''}`}
                style={{ width: `${Math.min(100, (todayEntry.kcal / plan.targetKcal) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* KOÇ MESAJLARI */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Koçun diyor ki</h2>
        <ul className={styles.msgList}>
          {plan.messages.map((m, i) => (
            <li key={i} className={`${styles.msg} ${styles[`msg_${m.level}`]}`}>
              <span className={styles.msgIcon} aria-label={LEVEL_META[m.level].label}>
                {LEVEL_META[m.level].icon}
              </span>
              <span>{m.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* GÜNLÜK GİRİŞ */}
      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>Günlük kayıt</h2>
          <input
            type="date"
            value={form.date}
            max={todayStr()}
            onChange={e => onDateChange(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Kilo (kg)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="71.0"
              value={form.weight}
              onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>Kalori</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="2400"
              value={form.kcal}
              onChange={e => setForm(f => ({ ...f, kcal: e.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>Protein (g)</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="142"
              value={form.protein}
              onChange={e => setForm(f => ({ ...f, protein: e.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>Karb (g)</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="250"
              value={form.carb}
              onChange={e => setForm(f => ({ ...f, carb: e.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>Yağ (g)</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="80"
              value={form.fat}
              onChange={e => setForm(f => ({ ...f, fat: e.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>Adım</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="9000"
              value={form.steps}
              onChange={e => setForm(f => ({ ...f, steps: e.target.value }))}
            />
          </label>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            <span>Yağ oranı % (ölçtüğünde)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="örn. 13.5"
              value={form.bodyFat}
              onChange={e => setForm(f => ({ ...f, bodyFat: e.target.value }))}
            />
          </label>
        </div>

        <button className={styles.saveBtn} onClick={saveEntry}>
          {savedFlash ? 'KAYDEDİLDİ ✓' : entries.some(e => e.date === form.date) ? 'GÜNCELLE' : 'KAYDET'}
        </button>
      </section>

      {/* GRAFİKLER */}
      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>Son 30 gün</h2>
          <div className={styles.tabs} role="tablist">
            {(['kilo', 'kalori', 'adim'] as const).map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={chartTab === t}
                className={`${styles.tab} ${chartTab === t ? styles.tabActive : ''}`}
                onClick={() => setChartTab(t)}
              >
                {t === 'kilo' ? 'Kilo' : t === 'kalori' ? 'Kalori' : 'Adım'}
              </button>
            ))}
          </div>
        </div>

        {chartTab === 'kilo' && <WeightChart trend={est.trend} goalWeight={settings.goalWeight} />}
        {chartTab === 'kalori' && (
          <BarChart
            entries={entries}
            field="kcal"
            refValue={est.ready ? est.maintenance : est.roughGuess}
            refLabel={est.ready ? 'koruma' : 'tahmini'}
            color="#3987e5"
            unit="kcal"
          />
        )}
        {chartTab === 'adim' && (
          <BarChart entries={entries} field="steps" refValue={est.avgSteps} refLabel="ortalama" color="#199e70" unit="adım" />
        )}
      </section>

      {/* GEÇMİŞ */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Kayıtlar</h2>
        {sorted.length === 0 ? (
          <p className={styles.emptyText}>
            Henüz kayıt yok. İlk kaydını yukarıdan gir — yolculuk bugün başlıyor.
          </p>
        ) : (
          <ul className={styles.historyList}>
            {[...sorted].reverse().slice(0, 21).map(e => (
              <li key={e.date} className={styles.historyRow}>
                <button
                  className={styles.historyMain}
                  onClick={() => setForm(entryToForm(e))}
                  aria-label={`${fmtDateLong(e.date)} kaydını düzenle`}
                >
                  <span className={styles.historyDate}>{fmtDateLong(e.date)}</span>
                  <span className={styles.historyVals}>
                    {e.weight != null && <b>{e.weight.toFixed(1)} kg</b>}
                    {e.kcal != null && <span>{e.kcal.toLocaleString('tr-TR')} kcal</span>}
                    {e.protein != null && <span>P{Math.round(e.protein)}</span>}
                    {e.steps != null && <span>{(e.steps / 1000).toFixed(1)}k adım</span>}
                    {e.bodyFat != null && <span>%{e.bodyFat}</span>}
                  </span>
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteEntry(e.date)}
                  aria-label="Kaydı sil"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className={styles.footer}>
        <p>
          Veriler yalnızca bu telefonda saklanır. Düzenli olarak{' '}
          <button className={styles.linkBtn} onClick={exportData}>yedek al</button>.
        </p>
      </footer>

      {/* AYARLAR */}
      {settingsOpen && (
        <div className={styles.sheetOverlay} onClick={() => setSettingsOpen(false)}>
          <div className={styles.sheet} onClick={e => e.stopPropagation()}>
            <div className={styles.sheetHead}>
              <h2 className={styles.cardTitle}>Ayarlar</h2>
              <button className={styles.iconBtn} onClick={() => setSettingsOpen(false)} aria-label="Kapat">
                ×
              </button>
            </div>

            <div className={styles.settingGroup}>
              <span className={styles.settingLabel}>Faz</span>
              <div className={styles.segment}>
                <button
                  className={settings.phase === 'koruma' ? styles.segActive : ''}
                  onClick={() => setSettings(s => ({ ...s, phase: 'koruma' }))}
                >
                  Koruma (%{settings.bfGoalCut} yağa kadar)
                </button>
                <button
                  className={settings.phase === 'bulk' ? styles.segActive : ''}
                  onClick={() => setSettings(s => ({ ...s, phase: 'bulk' }))}
                >
                  Lean Bulk (%{settings.bfGoalBulk}&apos;ye kadar)
                </button>
              </div>
            </div>

            <label className={styles.settingRow}>
              <span>Hedef kilo (kg)</span>
              <input
                type="text"
                inputMode="decimal"
                value={settings.goalWeight}
                onChange={e => {
                  const v = num(e.target.value);
                  if (v) setSettings(s => ({ ...s, goalWeight: v }));
                }}
              />
            </label>
            <label className={styles.settingRow}>
              <span>Protein hedefi (g/kg)</span>
              <input
                type="text"
                inputMode="decimal"
                value={settings.proteinPerKg}
                onChange={e => {
                  const v = num(e.target.value);
                  if (v) setSettings(s => ({ ...s, proteinPerKg: v }));
                }}
              />
            </label>
            <label className={styles.settingRow}>
              <span>Bulk fazlası (kcal)</span>
              <input
                type="text"
                inputMode="numeric"
                value={settings.surplus}
                onChange={e => {
                  const v = num(e.target.value);
                  if (v) setSettings(s => ({ ...s, surplus: v }));
                }}
              />
            </label>

            <div className={styles.settingGroup}>
              <span className={styles.settingLabel}>Veri</span>
              <div className={styles.dataBtns}>
                <button className={styles.ghostBtn} onClick={exportData}>
                  Yedek indir
                </button>
                <button className={styles.ghostBtn} onClick={() => fileRef.current?.click()}>
                  Yedek yükle
                </button>
                <button className={`${styles.ghostBtn} ${styles.dangerBtn}`} onClick={resetAll}>
                  Sıfırla
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                hidden
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) importData(f);
                  e.target.value = '';
                }}
              />
            </div>

            <p className={styles.sheetNote}>
              Plan: {settings.goalWeight} kg&apos;da kalarak %{settings.bfGoalCut} yağ oranına in
              (recomp) → sonra %{settings.bfGoalBulk}&apos;ye kadar temiz kütle al (lean bulk).
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
