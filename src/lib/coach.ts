// Koç — adaptif koruma kalorisi motoru.
// Tüm hesaplar saf fonksiyon: girdi günlük kayıtlar, çıktı tahmin + koçluk mesajları.

export interface DayEntry {
  date: string; // YYYY-MM-DD (yerel)
  weight?: number; // kg
  kcal?: number;
  protein?: number; // g
  carb?: number; // g
  fat?: number; // g
  steps?: number;
  bodyFat?: number; // % (opsiyonel, ara sıra ölçüm)
}

export type Phase = 'koruma' | 'bulk';

export interface Settings {
  goalWeight: number; // kg — korumada sabit kalınacak kilo
  phase: Phase;
  proteinPerKg: number; // g/kg hedefi
  surplus: number; // bulk fazında eklenecek kcal
  bfGoalCut: number; // korumanın bittiği yağ oranı (%)
  bfGoalBulk: number; // bulk'ın bittiği yağ oranı (%)
}

export const DEFAULT_SETTINGS: Settings = {
  goalWeight: 71,
  phase: 'koruma',
  proteinPerKg: 2.0,
  surplus: 300,
  bfGoalCut: 10,
  bfGoalBulk: 12,
};

export const COLLECTION_DAYS = 14; // maintenance tahmini için gereken minimum gün
const KCAL_PER_KG = 7700; // 1 kg vücut ağırlığı ≈ 7700 kcal
const EMA_ALPHA = 0.3; // trend kilo yumuşatma katsayısı
const WINDOW_DAYS = 28; // adaptif tahmin penceresi

export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dayIndex(date: string): number {
  // YYYY-MM-DD → gün sayısı (UTC üzerinden, saat dilimi kaymalarına dayanıklı)
  const [y, m, d] = date.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

export function sortEntries(entries: DayEntry[]): DayEntry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

// Kullanıcının uygulama öncesi haftası (28 Haz – 4 Tem 2026): 2650 kcal,
// 160P/296K/78Y, ~22.500 adım, 71 kg sabit. İlk açılışta geçmiş olarak yüklenir.
export const SEED_ENTRIES: DayEntry[] = [
  '2026-06-28',
  '2026-06-29',
  '2026-06-30',
  '2026-07-01',
  '2026-07-02',
  '2026-07-03',
  '2026-07-04',
].map(date => ({
  date,
  weight: 71,
  kcal: 2650,
  protein: 160,
  carb: 296,
  fat: 78,
  steps: 22500,
}));

/** Tohum kayıtları, kullanıcının kendi girdiği günleri ezmeden birleştirir. */
export function mergeSeedEntries(entries: DayEntry[]): DayEntry[] {
  const have = new Set(entries.map(e => e.date));
  return [...entries, ...SEED_ENTRIES.filter(s => !have.has(s.date))];
}

export interface TrendPoint {
  date: string;
  weight: number;
  trend: number;
}

/** Üstel hareketli ortalama ile günlük dalgalanmadan arındırılmış "trend kilo". */
export function computeTrend(entries: DayEntry[]): TrendPoint[] {
  const withWeight = sortEntries(entries).filter(
    (e): e is DayEntry & { weight: number } => typeof e.weight === 'number' && e.weight > 0
  );
  const out: TrendPoint[] = [];
  let ema = 0;
  for (let i = 0; i < withWeight.length; i++) {
    const w = withWeight[i].weight;
    ema = i === 0 ? w : ema + EMA_ALPHA * (w - ema);
    out.push({ date: withWeight[i].date, weight: w, trend: ema });
  }
  return out;
}

export interface MaintenanceEstimate {
  ready: boolean; // 14 günlük veri toplandı mı
  loggedDays: number; // kilo + kalori birlikte girilen gün sayısı
  maintenance: number | null; // kcal/gün — adaptif tahmin
  roughGuess: number; // formül bazlı kaba tahmin (veri toplama döneminde gösterilir)
  slopePerWeek: number | null; // kg/hafta — trend kilonun eğimi
  avgKcal: number | null; // penceredeki ortalama alım
  avgSteps: number | null; // penceredeki ortalama adım
  windowDays: number; // tahminde kullanılan gün sayısı
  confidence: number; // ± kcal aralığı
  trend: TrendPoint[];
  currentTrendWeight: number | null;
  latestBodyFat: { date: string; value: number } | null;
}

/** Trend noktaları üzerinde doğrusal regresyon → kg/gün eğim. */
function trendSlopePerDay(points: TrendPoint[]): number {
  const xs = points.map(p => dayIndex(p.date));
  const ys = points.map(p => p.trend);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varx = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (ys[i] - my);
    varx += (xs[i] - mx) ** 2;
  }
  return varx === 0 ? 0 : cov / varx;
}

function katchGuess(weightKg: number, avgSteps: number | null): number {
  // Yağ oranını ~%12 varsayan Katch-McArdle + adım bazlı aktivite çarpanı.
  const lbm = weightKg * 0.88;
  const bmr = 370 + 21.6 * lbm;
  const s = avgSteps ?? 8000;
  const mult = s < 4000 ? 1.3 : s < 7000 ? 1.45 : s < 10000 ? 1.6 : s < 13000 ? 1.72 : 1.85;
  return Math.round((bmr * mult) / 10) * 10;
}

export function estimateMaintenance(entries: DayEntry[], settings: Settings): MaintenanceEstimate {
  const sorted = sortEntries(entries);
  const trend = computeTrend(sorted);

  const complete = sorted.filter(
    e => typeof e.weight === 'number' && typeof e.kcal === 'number' && e.kcal! > 0
  );
  const loggedDays = complete.length;

  const lastWeight =
    trend.length > 0 ? trend[trend.length - 1].weight : settings.goalWeight;

  const allSteps = sorted.filter(e => typeof e.steps === 'number' && e.steps! > 0);
  const avgStepsAll =
    allSteps.length > 0
      ? Math.round(allSteps.reduce((s, e) => s + e.steps!, 0) / allSteps.length)
      : null;

  const bfEntries = sorted.filter(e => typeof e.bodyFat === 'number' && e.bodyFat! > 0);
  const latestBodyFat =
    bfEntries.length > 0
      ? { date: bfEntries[bfEntries.length - 1].date, value: bfEntries[bfEntries.length - 1].bodyFat! }
      : null;

  // Kaba tahmin: 5+ tam gün varsa formül yerine gerçek alım + kilo gidişatı
  // kullanılır (kilo sabitse ortalama alım ≈ koruma kalorisi).
  let roughGuess = katchGuess(lastWeight, avgStepsAll);
  if (complete.length >= 5) {
    const avgK = complete.reduce((s, e) => s + e.kcal!, 0) / complete.length;
    const slope = trend.length >= 5 ? trendSlopePerDay(trend.slice(-14)) : 0;
    const guess = Math.min(4500, Math.max(1200, avgK - slope * KCAL_PER_KG));
    roughGuess = Math.round(guess / 10) * 10;
  }

  const base: MaintenanceEstimate = {
    ready: false,
    loggedDays,
    maintenance: null,
    roughGuess,
    slopePerWeek: null,
    avgKcal: null,
    avgSteps: avgStepsAll,
    windowDays: 0,
    confidence: 0,
    trend,
    currentTrendWeight: trend.length > 0 ? trend[trend.length - 1].trend : null,
    latestBodyFat,
  };

  if (loggedDays < COLLECTION_DAYS || trend.length < COLLECTION_DAYS) return base;

  // Pencere: son 28 gün (son kayıt tarihinden geriye).
  const lastIdx = dayIndex(sorted[sorted.length - 1].date);
  const inWindow = (d: string) => lastIdx - dayIndex(d) < WINDOW_DAYS;

  const winTrend = trend.filter(p => inWindow(p.date));
  const winKcal = complete.filter(e => inWindow(e.date));
  if (winTrend.length < 10 || winKcal.length < 10) return base;

  const span = dayIndex(winTrend[winTrend.length - 1].date) - dayIndex(winTrend[0].date);
  if (span < 10) return base;

  const slopePerDay = trendSlopePerDay(winTrend);

  const avgKcal = winKcal.reduce((s, e) => s + e.kcal!, 0) / winKcal.length;

  let maintenance = avgKcal - slopePerDay * KCAL_PER_KG;
  maintenance = Math.min(4500, Math.max(1200, maintenance));
  maintenance = Math.round(maintenance / 10) * 10;

  const winSteps = sorted.filter(e => inWindow(e.date) && typeof e.steps === 'number' && e.steps! > 0);
  const avgSteps =
    winSteps.length > 0
      ? Math.round(winSteps.reduce((s, e) => s + e.steps!, 0) / winSteps.length)
      : avgStepsAll;

  // Güven aralığı: gün sayısı arttıkça daralır.
  const confidence = Math.max(75, 300 - winKcal.length * 8);

  return {
    ...base,
    ready: true,
    maintenance,
    slopePerWeek: Math.round(slopePerDay * 7 * 1000) / 1000,
    avgKcal: Math.round(avgKcal),
    avgSteps,
    windowDays: winKcal.length,
    confidence: Math.round(confidence / 5) * 5,
  };
}

export type MsgLevel = 'good' | 'info' | 'warning' | 'serious';

export interface CoachMessage {
  level: MsgLevel;
  text: string;
}

export interface CoachPlan {
  targetKcal: number; // bugünkü kalori hedefi
  targetProtein: number; // g
  phaseLabel: string;
  messages: CoachMessage[];
}

function avgOf(entries: DayEntry[], key: 'protein' | 'kcal' | 'steps', days: number, last: string): number | null {
  const lastIdx = dayIndex(last);
  const vals = entries
    .filter(e => typeof e[key] === 'number' && e[key]! > 0 && lastIdx - dayIndex(e.date) < days)
    .map(e => e[key]!);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function buildCoachPlan(
  entries: DayEntry[],
  settings: Settings,
  est: MaintenanceEstimate
): CoachPlan {
  const msgs: CoachMessage[] = [];
  const sorted = sortEntries(entries);
  const today = todayStr();
  const lastDate = sorted.length > 0 ? sorted[sorted.length - 1].date : today;

  const base = est.ready && est.maintenance != null ? est.maintenance : est.roughGuess;
  const trendW = est.currentTrendWeight;
  const goal = settings.goalWeight;

  let target = base;
  const phaseLabel = settings.phase === 'koruma' ? 'KORUMA' : 'LEAN BULK';

  if (!est.ready) {
    const remaining = Math.max(0, COLLECTION_DAYS - est.loggedDays);
    msgs.push({
      level: 'info',
      text: `Veri toplama dönemindeyiz: ${est.loggedDays}/${COLLECTION_DAYS} gün tamamlandı. ${remaining} gün daha kilo + kalori girince koruma kalorini gidişattan hesaplayacağım.`,
    });
    msgs.push({
      level: 'info',
      text:
        est.loggedDays >= 5
          ? `Geçici hedef ~${est.roughGuess} kcal — kayıtlı günlerdeki gerçek alımına ve kilo gidişatına göre kalibre edildi. Bu bantta sabit kal.`
          : `Şimdilik kaba hedef ~${est.roughGuess} kcal. Bu dönemde kaloriyi sabit tutmaya çalış — tahmin o kadar isabetli çıkar.`,
    });
    msgs.push({
      level: 'info',
      text: 'Tartıya her sabah aynı saatte, tuvaletten sonra ve aç karnına çık. Tek günlük oynamalara takılma; ben trend kiloya bakıyorum.',
    });
  } else {
    if (settings.phase === 'koruma') {
      // Hedef: koruma kalorisi; trend hedeften saparsa yumuşak düzeltme.
      if (trendW != null && trendW > goal + 0.5) {
        target = base - 200;
        msgs.push({
          level: 'warning',
          text: `Trend kilon ${trendW.toFixed(1)} kg — hedefin (${goal} kg) üstüne çıktı. ${goal} kg'a dönene kadar hedefi ${target} kcal'e çekiyorum (−200).`,
        });
      } else if (trendW != null && trendW < goal - 0.5) {
        target = base + 200;
        msgs.push({
          level: 'warning',
          text: `Trend kilon ${trendW.toFixed(1)} kg — hedefin (${goal} kg) altına indi. Toparlanana kadar hedefi ${target} kcal'e çıkarıyorum (+200).`,
        });
      } else {
        msgs.push({
          level: 'good',
          text: `Trend kilon ${trendW != null ? trendW.toFixed(1) : '—'} kg, hedef bandındasın. Koruma kalorin ~${base} kcal (±${est.confidence}). Böyle devam.`,
        });
      }
      if (est.slopePerWeek != null && Math.abs(est.slopePerWeek) <= 0.15) {
        msgs.push({
          level: 'good',
          text: `Haftalık değişim ${est.slopePerWeek >= 0 ? '+' : ''}${est.slopePerWeek.toFixed(2)} kg — neredeyse düz çizgi. Recomp için tam istediğimiz tablo: kilo sabit, antrenman + protein işi yapsın.`,
        });
      }
    } else {
      // Lean bulk: maintenance + surplus.
      target = base + settings.surplus;
      msgs.push({
        level: 'info',
        text: `Lean bulk fazındasın: koruma ${base} kcal + ${settings.surplus} fazla = ${target} kcal hedef.`,
      });
      if (est.slopePerWeek != null) {
        if (est.slopePerWeek > 0.4) {
          msgs.push({
            level: 'serious',
            text: `Haftada +${est.slopePerWeek.toFixed(2)} kg alıyorsun — bu hızın çoğu yağ olur. Fazlayı 100-150 kcal azaltmayı düşün.`,
          });
        } else if (est.slopePerWeek < 0.1) {
          msgs.push({
            level: 'warning',
            text: `Haftalık artış +${est.slopePerWeek.toFixed(2)} kg — lean bulk için yavaş. Fazlaya +100 kcal ekleyebilirsin.`,
          });
        } else {
          msgs.push({
            level: 'good',
            text: `Haftada +${est.slopePerWeek.toFixed(2)} kg — lean bulk için ideal tempo (0.1-0.35 kg/hafta).`,
          });
        }
      }
    }
  }

  // Yağ oranı yolculuğu
  if (est.latestBodyFat) {
    const bf = est.latestBodyFat.value;
    if (settings.phase === 'koruma') {
      if (bf <= settings.bfGoalCut) {
        msgs.push({
          level: 'good',
          text: `Son ölçümün %${bf} — %${settings.bfGoalCut} hedefine ULAŞTIN! Ayarlardan Lean Bulk fazına geçebilirsin; %${settings.bfGoalBulk}'ye kadar kalori fazlası dönemi başlar.`,
        });
      } else {
        msgs.push({
          level: 'info',
          text: `Yağ oranı: %${bf} → hedef %${settings.bfGoalCut}. Kilo sabitken oranın düşmesi = kas kazanıp yağ yakıyorsun. Ölçümü 2-4 haftada bir aynı yöntemle tekrarla.`,
        });
      }
    } else if (bf >= settings.bfGoalBulk) {
      msgs.push({
        level: 'warning',
        text: `Yağ oranın %${bf} — %${settings.bfGoalBulk} üst sınırına geldin. Bulk'ı bitirip tekrar korumaya (veya mini cut'a) geçme zamanı.`,
      });
    }
  }

  // Protein kontrolü (son 7 gün)
  const targetProtein = Math.round(goal * settings.proteinPerKg);
  const avgProt = avgOf(sorted, 'protein', 7, lastDate);
  if (avgProt != null) {
    if (avgProt < targetProtein * 0.9) {
      msgs.push({
        level: 'warning',
        text: `Son 7 gün protein ortalaman ${Math.round(avgProt)} g — hedef ${targetProtein} g. Recomp'un motoru protein; her öğüne bir kaynak ekle.`,
      });
    } else {
      msgs.push({
        level: 'good',
        text: `Protein ortalaman ${Math.round(avgProt)} g — hedef ${targetProtein} g. Bu iş tamam.`,
      });
    }
  }

  // Adım tutarlılığı: tahminin geçerliliği aktiviteye bağlı.
  const steps7 = avgOf(sorted, 'steps', 7, lastDate);
  if (steps7 != null && est.avgSteps != null && est.avgSteps > 0) {
    const ratio = steps7 / est.avgSteps;
    if (ratio < 0.75) {
      msgs.push({
        level: 'warning',
        text: `Son 7 günde adımların ortalamanın %${Math.round((1 - ratio) * 100)} altında (${Math.round(steps7)} vs ${est.avgSteps}). Hareket düşerse koruma kalorin de düşer — hedefi buna göre yeniden hesaplayacağım.`,
      });
    } else if (ratio > 1.25) {
      msgs.push({
        level: 'info',
        text: `Adımların ortalamanın epey üstünde (${Math.round(steps7)} vs ${est.avgSteps}). Aktivite kalıcı olarak arttıysa koruma kalorin yukarı güncellenecek.`,
      });
    }
  }

  // Makro/kalori tutarlılık kontrolü (bugünkü kayıt)
  const todayEntry = sorted.find(e => e.date === today);
  if (
    todayEntry &&
    typeof todayEntry.kcal === 'number' &&
    typeof todayEntry.protein === 'number' &&
    typeof todayEntry.carb === 'number' &&
    typeof todayEntry.fat === 'number'
  ) {
    const macroKcal = todayEntry.protein * 4 + todayEntry.carb * 4 + todayEntry.fat * 9;
    if (todayEntry.kcal > 0 && Math.abs(macroKcal - todayEntry.kcal) / todayEntry.kcal > 0.12) {
      msgs.push({
        level: 'info',
        text: `Bugünkü makrolar ${Math.round(macroKcal)} kcal ediyor ama ${todayEntry.kcal} kcal girdin — arada %12'den fazla fark var. Tartım/etiket hatası olabilir, kontrol et.`,
      });
    }
  }

  // Kayıt disiplini
  if (sorted.length > 0) {
    const gap = dayIndex(today) - dayIndex(lastDate);
    if (gap >= 2) {
      msgs.push({
        level: 'serious',
        text: `${gap} gündür kayıt yok. Bu sistem günlük veriyle çalışır — bugünü mutlaka gir, dünü de hatırlıyorsan geriye dönük ekle.`,
      });
    }
  }

  return {
    targetKcal: Math.round(target / 10) * 10,
    targetProtein,
    phaseLabel,
    messages: msgs,
  };
}
