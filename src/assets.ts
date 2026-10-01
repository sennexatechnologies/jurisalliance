import p480 from './assets/img/president-480.webp';
import p800 from './assets/img/president-800.webp';
import p1024 from './assets/img/president-1024.webp';
import v480 from './assets/img/vice-president-480.webp';
import v800 from './assets/img/vice-president-800.webp';
import v1024 from './assets/img/vice-president-1024.webp';
import s480 from './assets/img/secretary-480.webp';
import s800 from './assets/img/secretary-800.webp';
import s1024 from './assets/img/secretary-1024.webp';
import l256 from './assets/img/logo-256.webp';
import l512 from './assets/img/logo-512.webp';
import l1024 from './assets/img/logo-1024.webp';

export type ImageSet = { 480: string; 800: string; 1024: string };

// Keyed by candidate id. Originals are kept untouched in src/assets/source/.
export const photoSets: Record<string, ImageSet> = {
  president: { 480: p480, 800: p800, 1024: p1024 },
  'vice-president': { 480: v480, 800: v800, 1024: v1024 },
  'secretary-academic-affairs': { 480: s480, 800: s800, 1024: s1024 },
};

export const logoSet = { 256: l256, 512: l512, 1024: l1024 };

// Static 1200x630 share images live in /public/og
export const shareImages: Record<string, string> = {
  president: '/og/president.jpg',
  'vice-president': '/og/vice-president.jpg',
  'secretary-academic-affairs': '/og/secretary.jpg',
  team: '/og/jla.jpg',
};
