import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { fetchCommunity, firstSentence, fmtDate, resolveManifesto, type CommunityImage, type CommunityStory } from '../data/campaign';
import { Empty, ErrorState, LoadingState } from './kit';
import { Arrow, Button, Reveal } from '../ui';

export function useCommunity() {
  const [stories, setStories] = useState<CommunityStory[] | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(() => {
    setError(false); setStories(null);
    fetchCommunity().then(setStories).catch(() => setError(true));
  }, []);
  useEffect(load, [load]);
  return { stories, error, retry: load };
}

const hov = 'transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100';

// Real photos keep their authentic colour: no filters. Pulse placeholder until decoded; honest fallback on failure.
export function CommunityImg({ img, className = '', eager = false, sizes = '(min-width: 1024px) 40vw, 90vw', natural = false }: { img: CommunityImage; className?: string; eager?: boolean; sizes?: string; natural?: boolean }) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  if (state === 'error') return <div role="img" aria-label={img.alt} className="grid h-full min-h-32 w-full place-items-center bg-s2 p-4 text-center"><span className="label text-mute">Photo unavailable</span></div>;
  return (
    <span className={`relative block bg-s2 ${natural ? '' : 'h-full w-full'}`} style={natural && img.width && img.height ? { aspectRatio: `${img.width} / ${img.height}` } : undefined}>
      {state === 'loading' && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-white/[0.04] motion-reduce:animate-none" />}
      <img src={img.src} srcSet={img.srcSet} alt={img.alt} width={img.width} height={img.height} sizes={sizes} loading={eager ? 'eager' : 'lazy'} decoding="async"
        style={img.focus ? { objectPosition: img.focus } : undefined}
        onLoad={() => setState('ok')} onError={() => setState('error')}
        className={`h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${state === 'ok' ? 'opacity-100' : 'opacity-0'} ${className}`} />
    </span>
  );
}

export const storyMeta = (s: CommunityStory) => [s.date && fmtDate(s.date), s.location].filter(Boolean).join(' · ');
const NoImage = () => <div className="grid h-full min-h-40 place-items-center p-6 text-center"><span className="label text-mute">Image to be added</span></div>;

export function CommunityFilter({ value, options, onChange }: { value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <div role="group" aria-label="Filter stories by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {['All', ...options].map((c) => (
        <button key={c} aria-pressed={value === c} onClick={() => onChange(c)} className={`label min-h-11 shrink-0 rounded-full border px-4 transition-colors ${value === c ? 'border-blue bg-blue-deep' : 'border-line text-white/70 hover:border-white/40'}`}>{c}</button>
      ))}
    </div>
  );
}

export function ViewToggle({ value, onChange }: { value: 'grid' | 'timeline'; onChange: (v: 'grid' | 'timeline') => void }) {
  return (
    <div role="group" aria-label="Story layout" className="flex shrink-0 gap-4">
      {(['grid', 'timeline'] as const).map((v) => (
        <button key={v} aria-pressed={value === v} onClick={() => onChange(v)} className={`label relative min-h-11 capitalize transition-colors ${value === v ? 'text-white' : 'text-mute hover:text-white'}`}>
          {v}<span aria-hidden="true" className={`absolute inset-x-0 bottom-1.5 h-px bg-blue transition-opacity ${value === v ? 'opacity-100' : 'opacity-0'}`} />
        </button>
      ))}
    </div>
  );
}

/* ---------- Featured: asymmetric, image-led ---------- */
export function CommunityFeature({ s }: { s: CommunityStory }) {
  const portrait = !!s.image && (s.image.height ?? 0) > (s.image.width ?? 0);
  return (
    <Reveal>
      <Link to={`/community/${s.slug}`} className={`group grid overflow-hidden rounded-3xl border border-line bg-s1 transition-colors hover:bg-s2 ${portrait ? 'lg:grid-cols-[5fr_6fr]' : 'lg:grid-cols-[3fr_2fr]'}`}>
        <div className={`overflow-hidden bg-s2 ${portrait ? 'aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[34rem]' : 'aspect-[4/3] lg:aspect-auto lg:min-h-[28rem]'}`}>
          {s.image ? <CommunityImg img={s.image} eager sizes="(min-width: 1024px) 50vw, 100vw" className={hov} /> : <NoImage />}
        </div>
        <div className="flex flex-col justify-between gap-10 p-6 md:p-10 lg:p-12">
          <div>
            <p className="label text-blue-hi">Featured · {s.category}</p>
            <h3 className="display mt-4 text-3xl md:text-5xl">{s.title}</h3>
            <p className="mt-5 max-w-[34ch] text-lg leading-relaxed text-white/75 md:text-xl">{s.summary}</p>
          </div>
          <div>
            {storyMeta(s) && <p className="label mb-5 text-mute">{storyMeta(s)}</p>}
            <span className="label inline-flex items-center gap-2">Read story <span className="transition-transform group-hover:translate-x-1"><Arrow /></span></span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ---------- Cards: wide (image-led), tall (photo-led), medium, compact (text-only) ---------- */
export type CardVariant = 'wide' | 'tall' | 'medium' | 'compact';
export function CommunityCard({ s, variant = 'medium', i = 0, inGrid = false }: { s: CommunityStory; variant?: CardVariant; i?: number; inGrid?: boolean }) {
  const v: CardVariant = !s.image && variant !== 'compact' ? 'compact' : variant;
  const span = !inGrid ? '' : v === 'wide' ? 'md:col-span-2 lg:col-span-4' : 'lg:col-span-2';
  const imgBox = v === 'wide' ? 'aspect-[16/9] lg:aspect-[2/1]' : v === 'tall' ? 'aspect-[4/3] md:aspect-[4/5]' : 'aspect-[4/3]';
  return (
    <Reveal delay={(i % 3) * 80} className={span}>
      <Link to={`/community/${s.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-s1 transition-colors hover:bg-s2">
        {v !== 'compact' && <div className={`overflow-hidden bg-s2 ${imgBox}`}>{s.image ? <CommunityImg img={s.image} sizes={v === 'wide' ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 90vw'} className={hov} /> : <NoImage />}</div>}
        <div className="flex flex-1 flex-col justify-between gap-6 p-5 md:p-6">
          <div>
            <p className="label text-blue-hi">{s.category}</p>
            <h3 className={`display mt-3 ${v === 'compact' ? 'text-2xl' : 'text-2xl md:text-3xl'}`}>{s.title}</h3>
            <p className="mt-3 line-clamp-3 text-mute">{s.summary}</p>
          </div>
          <div className="flex items-center justify-between gap-3"><span className="label text-mute">{storyMeta(s)}</span><span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></div>
        </div>
      </Link>
    </Reveal>
  );
}

// 6-column rhythm: 4+2, 2+4 repeating, so rows alternate wide and tall.
export const variantFor = (i: number): CardVariant => (i % 4 === 0 || i % 4 === 3 ? 'wide' : 'tall');

export function CommunityGrid({ stories }: { stories: CommunityStory[] }) {
  return <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">{stories.map((s, i) => <CommunityCard key={s.id} s={s} i={i} inGrid variant={variantFor(i)} />)}</div>;
}

/* ---------- Highlight band: only renders when an approved highlight line exists ---------- */
export function CommunityHighlight({ stories }: { stories: CommunityStory[] }) {
  const h = stories.find((s) => s.highlight);
  if (!h) return null;
  return (
    <Reveal>
      <Link to={`/community/${h.slug}`} className="group mt-3 block rounded-3xl border border-blue/30 bg-blue/10 p-8 md:p-14">
        <p className="label text-blue-hi">Highlight · {h.category}</p>
        <p className="display mt-4 text-[clamp(1.8rem,5vw,4rem)]">{h.highlight}</p>
        <span className="label mt-6 inline-flex items-center gap-2">{h.title} <Arrow /></span>
      </Link>
    </Reveal>
  );
}

/* ---------- Timeline ---------- */
export function CommunityTimeline({ stories }: { stories: CommunityStory[] }) {
  const sorted = [...stories].sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : a.date ? -1 : b.date ? 1 : 0));
  return (
    <ol className="relative border-l border-line pl-6 md:pl-10">
      {sorted.map((s) => (
        <li key={s.id} className="relative pb-10 last:pb-0">
          <span aria-hidden="true" className={`absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full md:-left-[47px] ${s.date ? 'bg-blue' : 'border border-white/40 bg-ink'}`} />
          <p className="label text-mute">{s.date ? fmtDate(s.date) : 'Date to be confirmed'}{s.location ? ` · ${s.location}` : ''}</p>
          <Link to={`/community/${s.slug}`} className="group mt-3 grid gap-4 rounded-2xl border border-line bg-s1 p-3 transition-colors hover:bg-s2 sm:grid-cols-[10rem_1fr] sm:items-center md:p-4">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-s2">{s.image ? <CommunityImg img={s.image} sizes="160px" className={hov} /> : <NoImage />}</div>
            <div className="p-2"><p className="label text-blue-hi">{s.category}</p><h3 className="display mt-2 text-xl md:text-2xl">{s.title}</h3><p className="mt-2 line-clamp-2 text-mute">{s.summary}</p></div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Gallery, photo-story and lightbox ---------- */
const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Lightbox({ items, index, onIndex, onClose }: { items: CommunityImage[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const n = items.length;
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    box.current?.querySelector<HTMLElement>('[data-close]')?.focus();
    return () => { document.body.style.overflow = overflow; prev?.focus(); };
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && box.current) {
        const f = [...box.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [go, onClose]);
  const cur = items[index];
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); [1, -1].forEach((d) => { const im = new Image(); im.src = items[(index + d + n) % n].src; }); }, [index, items, n]);
  const btn = 'label inline-flex min-h-11 items-center rounded-full border border-white/25 bg-ink/60 px-5 backdrop-blur transition-colors hover:border-white';
  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label={`Photo ${index + 1} of ${n}`} className="fixed inset-0 z-50 flex flex-col bg-black/95"
      onClick={onClose} onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}>
      <div className="flex items-center justify-between p-4 md:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="label text-white/80" aria-live="polite">{index + 1} / {n}</p>
        <button data-close className={btn} onClick={onClose}>Close</button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
        {!loaded && <span aria-hidden="true" className="absolute h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white motion-reduce:animate-none" />}
        <img key={cur.src} src={cur.src} srcSet={cur.srcSet} sizes="100vw" alt={cur.alt} width={cur.width} height={cur.height} onLoad={() => setLoaded(true)} onClick={(e) => e.stopPropagation()}
          className={`max-h-full max-w-full rounded-xl object-contain transition-opacity duration-300 motion-reduce:transition-none ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div className="flex flex-col items-center gap-3 p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
        {(cur.caption || cur.credit) && <p className="max-w-xl text-center text-sm text-white/80">{cur.caption}{cur.caption && cur.credit ? ' · ' : ''}{cur.credit && <span className="text-white/60">Photo: {cur.credit}</span>}</p>}
        {n > 1 && <div className="flex gap-2"><button className={btn} onClick={() => go(-1)}>← Previous</button><button className={btn} onClick={() => go(1)}>Next →</button></div>}
      </div>
    </div>
  );
}

export function CommunityGallery({ items, variant = 'grid' }: { items: CommunityImage[]; variant?: 'grid' | 'story' }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  if (!items.length) return null;
  const trigger = (g: CommunityImage, i: number, cls: string, inner: React.ReactNode) => (
    <button onClick={() => setOpen(i)} aria-haspopup="dialog" aria-label={`Open photo ${i + 1} of ${items.length}: ${g.alt}`} className={`group block w-full overflow-hidden rounded-2xl bg-s2 text-left ${cls}`}>{inner}</button>
  );
  return (
    <>
      {variant === 'story' ? (
        <ul className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>li]:mb-3 [&>li]:break-inside-avoid">
          {items.map((g, i) => (
            <li key={g.src}>
              {trigger(g, i, '', <CommunityImg img={g} natural sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className={hov} />)}
              {(g.caption || g.credit) && <p className="mt-2 px-1 text-sm text-mute">{g.caption}{g.credit && <span> Photo: {g.credit}</span>}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((g, i) => <li key={g.src}>{trigger(g, i, 'aspect-square', <CommunityImg img={g} sizes="(min-width: 768px) 30vw, 45vw" className={hov} />)}</li>)}
        </ul>
      )}
      {open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}

/* ---------- Cross-links (data-driven only) ---------- */
export function RelatedManifesto({ id }: { id?: string }) {
  const m = resolveManifesto(id);
  if (!m) return null;
  const line = m.tagline ?? (m.proposal ? firstSentence(m.proposal) : undefined);
  return (
    <aside aria-labelledby="rm" className="rounded-2xl border border-blue/40 bg-blue/10 p-6 md:p-8">
      <p id="rm" className="label text-blue-hi">Related manifesto · Commitment {m.n}</p>
      <p className="display mt-3 text-2xl md:text-4xl">{m.title}</p>
      {line && <p className="mt-3 max-w-xl text-lg text-white/80">{line}</p>}
      <Button href={`/manifesto?item=${m.id}`} className="mt-6">Read the commitment <Arrow /></Button>
    </aside>
  );
}

export function CommunityEmpty({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <Empty
        title="Stories are being documented."
        text="Outreach, meetings, competitions and moments will be published here once they have been recorded and approved. Nothing is shown until it is real."
        action={<div className="flex flex-col gap-3 sm:flex-row"><Button href="/counsels-room?mode=suggest" variant="ghost">Suggest a story <Arrow /></Button>{!compact && <Button href="/manifesto" variant="ghost">Read the manifesto <Arrow /></Button>}</div>}
      />
      {!compact && (
        <ul className="mt-3 grid gap-3 md:grid-cols-3" aria-label="Story placeholders">
          {['Outreach', 'Meetings', 'Moments'].map((c) => (
            <li key={c} className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-white/15 text-center"><span className="label text-mute">{c}<br />Placeholder</span></li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Homepage section body: one featured + two supporting stories, or the empty state.
export function CommunityPreview() {
  const { stories, error, retry } = useCommunity();
  if (error) return <ErrorState onRetry={retry} />;
  if (!stories) return <LoadingState rows={3} />;
  if (!stories.length) return <CommunityEmpty compact />;
  const feat = stories.find((s) => s.featured) ?? stories[0];
  const rest = stories.filter((s) => s !== feat && s.layout !== 'photo-story').slice(0, 2);
  return (
    <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
      <CommunityFeature s={feat} />
      <div className="grid gap-3 lg:grid-rows-2">{rest.map((s, i) => <CommunityCard key={s.id} s={s} i={i} variant="medium" />)}</div>
    </div>
  );
}
