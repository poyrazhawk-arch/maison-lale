'use client';

import { useMemo, useRef, useState } from 'react';
import { dayIndex, type DayEntry, type TrendPoint } from '@/lib/coach';
import styles from './Koc.module.css';

// Grafik boyutları (viewBox birimi; CSS ile responsive ölçeklenir)
const W = 360;
const H = 190;
const PAD = { top: 14, right: 10, bottom: 24, left: 38 };

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

function fmtDate(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS_TR[m - 1]}`;
}

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = (span / count) / step;
  const mult = err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1;
  const s = step * mult;
  const start = Math.ceil(min / s) * s;
  const out: number[] = [];
  for (let v = start; v <= max + 1e-9; v += s) out.push(Math.round(v * 100) / 100);
  return out;
}

interface Tip {
  x: number;
  y: number;
  lines: string[];
}

function useTooltip() {
  const [tip, setTip] = useState<Tip | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const toLocal = (e: React.PointerEvent): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  return { tip, setTip, svgRef, toLocal };
}

function TooltipBox({ tip }: { tip: Tip }) {
  const boxW = Math.max(...tip.lines.map(l => l.length)) * 6.1 + 16;
  const boxH = tip.lines.length * 15 + 10;
  const x = Math.min(Math.max(tip.x - boxW / 2, 2), W - boxW - 2);
  const y = tip.y - boxH - 12 < 2 ? tip.y + 14 : tip.y - boxH - 12;
  return (
    <g pointerEvents="none">
      <rect x={x} y={y} width={boxW} height={boxH} rx={6} className={styles.tipBox} />
      {tip.lines.map((l, i) => (
        <text key={i} x={x + 8} y={y + 17 + i * 15} className={i === 0 ? styles.tipTitle : styles.tipText}>
          {l}
        </text>
      ))}
    </g>
  );
}

/** Kilo grafiği: gerçek tartımlar (nokta) + trend çizgisi + hedef bandı. */
export function WeightChart({
  trend,
  goalWeight,
  days = 30,
}: {
  trend: TrendPoint[];
  goalWeight: number;
  days?: number;
}) {
  const { tip, setTip, svgRef, toLocal } = useTooltip();

  const data = useMemo(() => {
    if (trend.length === 0) return [];
    const lastIdx = dayIndex(trend[trend.length - 1].date);
    return trend.filter(p => lastIdx - dayIndex(p.date) < days);
  }, [trend, days]);

  if (data.length < 2) {
    return <div className={styles.chartEmpty}>Grafik için en az 2 tartım gerekli.</div>;
  }

  const xs = data.map(p => dayIndex(p.date));
  const x0 = xs[0];
  const x1 = xs[xs.length - 1];
  const allY = data.flatMap(p => [p.weight, p.trend]).concat([goalWeight]);
  const yMin = Math.min(...allY) - 0.4;
  const yMax = Math.max(...allY) + 0.4;

  const sx = (d: number) => PAD.left + ((d - x0) / Math.max(1, x1 - x0)) * (W - PAD.left - PAD.right);
  const sy = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom);

  const ticks = niceTicks(yMin, yMax, 4);
  const trendPath = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(xs[i]).toFixed(1)},${sy(p.trend).toFixed(1)}`).join('');

  const bandTop = sy(goalWeight + 0.5);
  const bandBot = sy(goalWeight - 0.5);

  const onMove = (e: React.PointerEvent) => {
    const pt = toLocal(e);
    if (!pt) return;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < data.length; i++) {
      const d = Math.abs(sx(xs[i]) - pt.x);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const p = data[best];
    setTip({
      x: sx(xs[best]),
      y: sy(p.trend),
      lines: [fmtDate(p.date), `Tartım  ${p.weight.toFixed(1)} kg`, `Trend   ${p.trend.toFixed(2)} kg`],
    });
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className={styles.chart}
      role="img"
      aria-label="Kilo trend grafiği"
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={() => setTip(null)}
    >
      {/* hedef bandı: hedef ±0.5 kg */}
      <rect
        x={PAD.left}
        y={Math.min(bandTop, bandBot)}
        width={W - PAD.left - PAD.right}
        height={Math.abs(bandBot - bandTop)}
        className={styles.goalBand}
      />
      {ticks.map(t => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(t)} y2={sy(t)} className={styles.grid} />
          <text x={PAD.left - 6} y={sy(t) + 3.5} textAnchor="end" className={styles.axisText}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      <line x1={PAD.left} x2={W - PAD.right} y1={sy(goalWeight)} y2={sy(goalWeight)} className={styles.goalLine} />
      <text x={W - PAD.right} y={sy(goalWeight) - 4} textAnchor="end" className={styles.goalText}>
        hedef {goalWeight} kg
      </text>

      <path d={trendPath} className={styles.trendLine} />
      {data.map((p, i) => (
        <circle key={p.date} cx={sx(xs[i])} cy={sy(p.weight)} r={3.4} className={styles.dot} />
      ))}

      <text x={PAD.left} y={H - 6} className={styles.axisText}>{fmtDate(data[0].date)}</text>
      <text x={W - PAD.right} y={H - 6} textAnchor="end" className={styles.axisText}>
        {fmtDate(data[data.length - 1].date)}
      </text>

      {tip && (
        <>
          <line x1={tip.x} x2={tip.x} y1={PAD.top} y2={H - PAD.bottom} className={styles.crosshair} />
          <TooltipBox tip={tip} />
        </>
      )}
    </svg>
  );
}

/** Çubuk grafik: kalori (referans çizgili) veya adım. */
export function BarChart({
  entries,
  field,
  refValue,
  refLabel,
  color,
  unit,
  days = 30,
}: {
  entries: DayEntry[];
  field: 'kcal' | 'steps';
  refValue?: number | null;
  refLabel?: string;
  color: string;
  unit: string;
  days?: number;
}) {
  const { tip, setTip, svgRef, toLocal } = useTooltip();

  const data = useMemo(() => {
    const withVal = entries
      .filter(e => typeof e[field] === 'number' && e[field]! > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (withVal.length === 0) return [];
    const lastIdx = dayIndex(withVal[withVal.length - 1].date);
    return withVal.filter(e => lastIdx - dayIndex(e.date) < days);
  }, [entries, field, days]);

  if (data.length === 0) {
    return <div className={styles.chartEmpty}>Henüz veri yok.</div>;
  }

  const xs = data.map(e => dayIndex(e.date));
  const x0 = xs[0];
  const x1 = xs[xs.length - 1];
  const slots = Math.max(1, x1 - x0 + 1);
  const vals = data.map(e => e[field]!);
  const yMax = Math.max(...vals, refValue ?? 0) * 1.12;

  const plotW = W - PAD.left - PAD.right;
  const barW = Math.max(2.5, Math.min(14, plotW / slots - 2));
  const sx = (d: number) => PAD.left + ((d - x0 + 0.5) / slots) * plotW;
  const sy = (v: number) => PAD.top + (1 - v / yMax) * (H - PAD.top - PAD.bottom);

  const ticks = niceTicks(0, yMax, 4).filter(t => t > 0);
  const baseY = H - PAD.bottom;

  const onMove = (e: React.PointerEvent) => {
    const pt = toLocal(e);
    if (!pt) return;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < data.length; i++) {
      const d = Math.abs(sx(xs[i]) - pt.x);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const v = vals[best];
    setTip({
      x: sx(xs[best]),
      y: sy(v),
      lines: [fmtDate(data[best].date), `${v.toLocaleString('tr-TR')} ${unit}`],
    });
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className={styles.chart}
      role="img"
      aria-label={field === 'kcal' ? 'Kalori grafiği' : 'Adım grafiği'}
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={() => setTip(null)}
    >
      {ticks.map(t => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(t)} y2={sy(t)} className={styles.grid} />
          <text x={PAD.left - 6} y={sy(t) + 3.5} textAnchor="end" className={styles.axisText}>
            {t >= 1000 ? `${Math.round(t / 100) / 10}k` : t}
          </text>
        </g>
      ))}
      <line x1={PAD.left} x2={W - PAD.right} y1={baseY} y2={baseY} className={styles.baseline} />

      {data.map((e, i) => {
        const v = vals[i];
        const y = sy(v);
        return (
          <rect
            key={e.date}
            x={sx(xs[i]) - barW / 2}
            y={y}
            width={barW}
            height={Math.max(1, baseY - y)}
            rx={Math.min(3, barW / 2)}
            fill={color}
            className={styles.bar}
          />
        );
      })}

      {refValue != null && refValue > 0 && (
        <>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(refValue)} y2={sy(refValue)} className={styles.refLine} />
          {refLabel && (
            <text x={W - PAD.right} y={sy(refValue) - 4} textAnchor="end" className={styles.goalText}>
              {refLabel}
            </text>
          )}
        </>
      )}

      <text x={PAD.left} y={H - 6} className={styles.axisText}>{fmtDate(data[0].date)}</text>
      <text x={W - PAD.right} y={H - 6} textAnchor="end" className={styles.axisText}>
        {fmtDate(data[data.length - 1].date)}
      </text>

      {tip && <TooltipBox tip={tip} />}
    </svg>
  );
}
