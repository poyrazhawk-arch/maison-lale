import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

export type SalonHours = { day: string; open: string; close: string };

export type Salon = {
  slug: string;
  title: string;
  shortTitle: string;
  city: string;
  state: string;
  street: string;
  neighborhood: string;
  address: string;
  phone: string;
  whatsappPhone: string;
  rating: number | null;
  reviewsCount: number | null;
  hours: SalonHours[];
  website: string | null;
};

const DAY_TR: Record<string, string> = {
  Monday: 'Pazartesi',
  Tuesday: 'Salı',
  Wednesday: 'Çarşamba',
  Thursday: 'Perşembe',
  Friday: 'Cuma',
  Saturday: 'Cumartesi',
  Sunday: 'Pazar',
};

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanPhone(phone: string): string {
  // Remove all non-digits, then ensure international format for Turkey
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('90')) return digits;
  if (digits.startsWith('0')) return '90' + digits.slice(1);
  if (digits.length === 10) return '90' + digits;
  return digits;
}

// Shorten very long salon titles (often contain address/service info)
function shortTitle(title: string): string {
  // Remove anything after common separators if title is too long
  const separators = [' | ', ' - ', ' – ', ', ', ': '];
  let short = title;
  for (const sep of separators) {
    if (short.length > 40 && short.includes(sep)) {
      short = short.split(sep)[0];
    }
  }
  return short.trim();
}

function parseHours(row: Record<string, string>): SalonHours[] {
  const hours: SalonHours[] = [];
  const seen = new Set<string>();

  for (let i = 0; i <= 7; i++) {
    const day = row[`popular_times_weekly/${i}/day`];
    const open = row[`popular_times_weekly/${i}/open`];
    const close = row[`popular_times_weekly/${i}/close`];
    if (day && open && close && !seen.has(day)) {
      seen.add(day);
      hours.push({
        day: DAY_TR[day] || day,
        open,
        close,
      });
    }
  }

  // Sort by day order
  const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const trOrder = order.map(d => DAY_TR[d]);
  hours.sort((a, b) => trOrder.indexOf(a.day) - trOrder.indexOf(b.day));

  return hours;
}

let _cache: Salon[] | null = null;

export function getSalons(): Salon[] {
  if (_cache) return _cache;

  const csvPath = path.join(process.cwd(), 'src/data/salons.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  // Strip UTF-8 BOM if present
  const content = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;

  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const slugCount = new Map<string, number>();
  const salons: Salon[] = [];

  for (const row of rows) {
    const title = row.title?.trim();
    if (!title) continue;

    const phone = row.phone?.trim() || '';
    const whatsappPhone = phone ? cleanPhone(phone) : '';

    let slug = toSlug(title);
    // Deduplicate slugs
    const count = slugCount.get(slug) ?? 0;
    slugCount.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;

    const hours = parseHours(row);

    salons.push({
      slug,
      title,
      shortTitle: shortTitle(title),
      city: row.city?.trim() || '',
      state: row.state?.trim() || '',
      street: row.street?.trim() || '',
      neighborhood: row.neighborhood?.trim() || '',
      address: row.address?.trim() || '',
      phone,
      whatsappPhone,
      rating: row.total_score ? parseFloat(row.total_score) : null,
      reviewsCount: row.reviews_count ? parseInt(row.reviews_count) : null,
      hours,
      website: row.website?.trim() || null,
    });
  }

  _cache = salons;
  return salons;
}

export function getSalonBySlug(slug: string): Salon | null {
  return getSalons().find(s => s.slug === slug) ?? null;
}
