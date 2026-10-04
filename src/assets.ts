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

import kitchen640 from './assets/community/kitchen-640.webp';
import kitchen1280 from './assets/community/kitchen-1280.webp';
import evening640 from './assets/community/evening-640.webp';
import evening1280 from './assets/community/evening-1280.webp';
import team640 from './assets/community/team-640.webp';
import team1280 from './assets/community/team-1280.webp';
import office640 from './assets/community/office-640.webp';
import office1280 from './assets/community/office-1280.webp';
import youth640 from './assets/community/youth-640.webp';
import youth1280 from './assets/community/youth-1280.webp';

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

// Real campaign photography. Credit/date/location stay unset until supplied.
const cp = (s640: string, s1280: string, w: number, h: number, alt: string, caption?: string) => ({
  src: s1280, srcSet: `${s640} 640w, ${s1280} ${w}w`, width: w, height: h, alt, caption,
});
export const communityPhotos = {
  kitchen: cp(kitchen640, kitchen1280, 960, 1280, 'A woman in a black top rolls out dough on a floury table under a rough shelter while another person photographs the scene on a phone.'),
  evening: cp(evening640, evening1280, 1280, 853, 'Students and guests seated at round tables with gold cloths in a hall, listening during an evening gathering.'),
  team: cp(team640, team1280, 1280, 720, 'Fourteen members of the team, many in matching blue shirts, standing in a garden courtyard around a metal fire pit.'),
  office: cp(office640, office1280, 1200, 1600, 'Eight young people in formal wear stand around a seated older man and a woman in a wood-panelled office with Kenyan and US flags.'),
  youth: cp(youth640, youth1280, 1280, 960, 'A group of young people gather outdoors in front of a colourful community building, smiling and gesturing to the camera.'),
};
