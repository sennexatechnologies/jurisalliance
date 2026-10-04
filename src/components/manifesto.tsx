import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router';
import { community, firstSentence, manifesto, manifestoChapterIntros, manifestoFilters, resolveManifesto, splitLead, type ManifestoItem } from '../data/campaign';
import { ShareButtons } from './kit';
import { Arrow, Reveal } from '../ui';

export type Mode = 'quick' | 'full';

export const chapterSlug = (c: string) => c.toLowerCase().replace(/\s+/g, '-');
export const chapters = manifestoFilters.map((c, i) => ({
  id: `ch-${chapterSlug(c)}`, slug: chapterSlug(c), n: String(i + 1).padStart(2, '0'), title: c as string,
  intro: manifestoChapterIntros[c],
  items: manifesto.filter((m) => m.category === c),
})).filter((c) => c.items.length).map((c, i) => ({ ...c, n: String(i + 1).padStart(2, '0') }));
export type Chapter = (typeof chapters)[number];

const relatedStories = (id: string) => community.filter((s) => s.status === 'PUBLISHED' && s.manifesto === id);

/* ---------- Quick Read: condensed strictly from approved wording ---------- */
// Keeps original wording. Long or caveated items are kept whole rather than trimmed, so meaning never changes.
export function quickHow(h: string): { lead: string | null; text: string | null } {
  const { lead, text } = splitLead(h);
  const s = firstSentence(text);
  if (lead) return { lead, text: s.length <= 130 ? s : null };
  if (h.length <= 180) return { lead: null, text: h };
  return { lead: null, text: s.length <= 140 && !/depend|only|eligib/i.test(h) ? s : h };
}
export function quickWhat(m: ManifestoItem): string | null {
  if (m.proposal) return firstSentence(m.proposal);
  const leads = m.how.map((h) => splitLead(h).lead).filter(Boolean) as string[];
  if (leads.length >= 2) return leads.join(' · ');
  return m.how[0] ? firstSentence(m.how[0]) : null;
}
const wc = (s?: string) => (s ? s.split(/\s+/).length : 0);
const fullWords = manifesto.reduce((a, m) => a + wc(m.proposal) + wc(m.issue) + wc(m.impact) + wc(m.serves) + wc(m.measure) + m.how.reduce((x, h) => x + wc(h), 0) + (m.table?.reduce((x, r) => x + wc(r.text), 0) ?? 0), 0);
const quickWords = manifesto.reduce((a, m) => a + wc(quickWhat(m) ?? ''), 0) + manifesto.reduce((a, m) => a + m.how.reduce((x, h) => { const q = quickHow(h); return x + wc(q.lead ?? '') + wc(q.text ?? ''); }, 0) + wc(m.impact ?? m.serves), 0);
export const readTimes = { full: Math.max(1, Math.round(fullWords / 220)), quick: Math.max(1, Math.round(quickWords / 220)) };

/* ---------- Progress + active tracking ---------- */
export function useReadingProgress(ref: RefObject<HTMLElement | null>) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight + 64;
      const p = span > 0 ? Math.min(1, Math.max(0, (window.scrollY + 64 - top) / span)) : 0;
      setPct(Math.round(p * 100));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [ref]);
  return pct;
}

export function useActiveCommitment(deps: unknown) {
  const [active, setActive] = useState<string>(manifesto[0].id);
  useEffect(() => {
    const els = manifesto.map((m) => document.getElementById(`c-${m.id}`)).filter(Boolean) as HTMLElement[];
    const vis = new Map<string, number>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? vis.set(e.target.id, e.boundingClientRect.top) : vis.delete(e.target.id)));
      const first = [...vis.entries()].sort((a, b) => a[1] - b[1])[0];
      if (first) setActive(first[0].slice(2));
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [deps]);
  return active;
}

export function ReadingProgress({ pct }: { pct: number }) {
  return (
    <div role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="pointer-events-none fixed inset-x-0 top-16 z-30 h-[3px] bg-white/[0.06]">
      <div className="h-full origin-left bg-gradient-to-r from-blue to-blue-hi motion-safe:transition-[width] motion-safe:duration-200" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- Mode switch: editorial, not a tab bar ---------- */
export function ManifestoModeSwitch({ mode, onChange, className = '', compact = false }: { mode: Mode; onChange: (m: Mode) => void; className?: string; compact?: boolean }) {
  const opts: [Mode, string, string][] = [['quick', 'Quick Read', `~${readTimes.quick} min · what, how, impact`], ['full', 'Full Manifesto', `~${readTimes.full} min · every detail`]];
  return (
    <div role="group" aria-label="Reading mode" className={`flex gap-x-8 border-b border-line ${className}`}>
      {opts.map(([k, l, s]) => {
        const on = mode === k;
        return (
          <button key={k} aria-pressed={on} onClick={() => onChange(k)} className={`relative min-h-11 pb-3 text-left transition-colors ${on ? 'text-white' : 'text-white/55 hover:text-white/85'}`}>
            <span className={`block font-display font-bold uppercase leading-none tracking-tight ${compact ? 'text-[13px]' : 'text-base md:text-xl'}`}>{l}</span>
            {!compact && <span className="label mt-1.5 block !text-[10px] normal-case tracking-normal text-mute">{s}</span>}
            <span aria-hidden="true" className={`absolute inset-x-0 -bottom-px h-0.5 origin-left bg-blue transition-transform duration-300 motion-reduce:transition-none ${on ? 'scale-x-100' : 'scale-x-0'}`} />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Navigation: one sticky layer on mobile, rail on desktop ---------- */
function ContentsList({ active, activeChId, onPick }: { active: string; activeChId?: string; onPick?: () => void }) {
  return (
    <ol className="space-y-5">
      {chapters.map((c) => (
        <li key={c.id}>
          <a href={`#${c.id}`} onClick={onPick} aria-current={c.id === activeChId ? 'location' : undefined} className={`label flex min-h-9 items-center gap-3 transition-colors hover:text-white ${c.id === activeChId ? 'text-white' : 'text-mute'}`}><span className="text-blue-hi">{c.n}</span>{c.title}</a>
          <ul className="mt-1 border-l border-line">
            {c.items.map((m) => (
              <li key={m.id}><a href={`#c-${m.id}`} onClick={onPick} aria-current={m.id === active ? 'true' : undefined} className={`-ml-px flex min-h-10 items-center gap-2 border-l pl-4 text-sm transition-colors hover:text-white ${m.id === active ? 'border-blue text-white' : 'border-transparent text-mute'}`}><span className="font-mono text-[11px] text-mute">{m.n}</span>{m.title}</a></li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function ManifestoJumpNav({ active, pct, mode, onMode }: { active: string; pct: number; mode: Mode; onMode: (m: Mode) => void }) {
  const cur = manifesto.find((m) => m.id === active) ?? manifesto[0];
  const ch = chapters.find((c) => c.items.some((i) => i.id === active));
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const out = (e: PointerEvent) => { if (bar.current && !bar.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('keydown', k); window.addEventListener('pointerdown', out);
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('pointerdown', out); };
  }, [open]);
  return (
    <>
      {/* mobile + tablet: ONE compact sticky layer; the full contents open as a sheet beneath it */}
      <div ref={bar} className="sticky top-16 z-20 -mx-5 border-b border-line bg-ink/95 backdrop-blur-xl md:-mx-10 lg:hidden">
        <button aria-expanded={open} aria-controls="m-sheet" onClick={() => setOpen(!open)} className="flex min-h-12 w-full items-center gap-3 px-5 text-left md:px-10">
          <span className="min-w-0 flex-1" aria-live="polite">
            <span className="label block truncate !text-[10px] text-mute">Chapter {ch?.n} · {ch?.title}</span>
            <span className="label block truncate text-white">{cur.n} / {String(manifesto.length).padStart(2, '0')} · {cur.title}</span>
          </span>
          <span className="label shrink-0 tabular-nums text-mute">{pct}%</span>
          <span className="label inline-flex shrink-0 items-center gap-1 text-white">Jump <span aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span></span>
        </button>
        {open && (
          <div id="m-sheet" className="absolute inset-x-0 top-full max-h-[calc(100dvh-8rem)] overflow-y-auto border-b border-line bg-s1 px-5 py-6 shadow-2xl md:px-10">
            <ManifestoModeSwitch mode={mode} onChange={(m) => { onMode(m); setOpen(false); }} className="mb-6" />
            <nav aria-label="Manifesto contents"><ContentsList active={active} activeChId={ch?.id} onPick={() => setOpen(false)} /></nav>
          </div>
        )}
      </div>
      {/* desktop: persistent rail */}
      <aside className="sticky top-24 hidden h-fit max-h-[calc(100dvh-8rem)] overflow-y-auto pr-4 lg:block">
        <ManifestoModeSwitch mode={mode} onChange={onMode} compact className="mb-8 !gap-x-4" />
        <nav aria-label="Manifesto contents">
          <p className="label mb-3 flex justify-between text-mute"><span>Contents</span><span className="tabular-nums">{pct}%</span></p>
          <div aria-hidden="true" className="mb-5 h-px bg-line"><div className="h-px bg-blue" style={{ width: `${pct}%` }} /></div>
          <ContentsList active={active} activeChId={ch?.id} />
        </nav>
      </aside>
    </>
  );
}

/* ---------- Commitment pieces ---------- */
const body = 'text-[1.0625rem] leading-[1.75] text-white/85 md:text-[1.1875rem]';

export function ManifestoActionList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((h, i) => {
        const { lead, text } = splitLead(h);
        return (
          <li key={h} className="flex gap-4 rounded-2xl border border-line bg-s2 p-4 md:gap-5 md:p-6">
            <span className="label mt-1.5 shrink-0 text-blue-hi">{String(i + 1).padStart(2, '0')}</span>
            <p className={`${body} max-w-[68ch]`}>{lead && <strong className="font-semibold text-white">{lead}. </strong>}{text}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Block({ label, children, accent = false }: { label: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={accent ? 'border-l-2 border-blue pl-5 md:pl-7' : ''}>
      <p className={`label ${accent ? 'text-blue-hi' : 'text-mute'}`}>{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function CommitteeList({ rows }: { rows: NonNullable<ManifestoItem['table']> }) {
  return (
    <dl className="divide-y divide-line rounded-2xl border border-line bg-s2">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-1 p-4 md:grid-cols-[11rem_1fr_9rem] md:gap-6 md:p-5">
          <dt className="font-display text-lg font-semibold tracking-tight">{r.label}</dt>
          <dd className="text-[1rem] leading-relaxed text-white/80">{r.text}</dd>
          <dd className="label text-mute md:text-right">{r.ref}</dd>
        </div>
      ))}
    </dl>
  );
}

export function RelatedCommunity({ id }: { id: string }) {
  const s = relatedStories(id);
  if (!s.length) return null;
  return <Link to={`/community/${s[0].slug}`} className="label ulink inline-flex min-h-11 items-center gap-2 text-white">See it in action <Arrow /></Link>;
}

export function ManifestoCommitment({ m, highlighted }: { m: ManifestoItem; highlighted: boolean }) {
  const hasImpact = m.impact || m.serves || m.measure;
  return (
    <article id={`c-${m.id}`} aria-labelledby={`t-${m.id}`} className={`scroll-mt-32 rounded-3xl border bg-s1 p-5 transition-colors duration-700 md:p-10 lg:scroll-mt-8 ${highlighted ? 'border-blue' : 'border-line'}`}>
      <header className="border-b border-line pb-6 md:pb-8">
        <div className="flex items-start justify-between gap-4">
          <p className="label text-blue-hi">{m.category}</p>
          <span aria-hidden="true" className="-mt-2 font-display text-6xl font-bold leading-none tracking-tighter text-white/[0.12] md:text-8xl">{m.n}</span>
        </div>
        <h3 id={`t-${m.id}`} tabIndex={-1} className="display mt-2 text-[clamp(1.9rem,4.6vw,3.5rem)] focus:outline-none">{m.title}</h3>
        {m.tagline && <p className="mt-4 max-w-2xl font-display text-xl font-semibold leading-snug tracking-tight text-white/90 md:text-2xl">{m.tagline}</p>}
      </header>
      <div className="mt-8 space-y-9 md:mt-10 md:space-y-11">
        {m.issue && <Block label="The issue"><p className={`${body} max-w-[68ch] text-white/70`}>{m.issue}</p></Block>}
        {m.proposal && <Block label="Our commitment" accent><p className="max-w-[62ch] text-[1.25rem] font-medium leading-[1.6] text-white md:text-[1.5rem]">{m.proposal}</p></Block>}
        {m.how.length > 0 && <Block label="How we’ll pursue it"><ManifestoActionList items={m.how} /></Block>}
        {m.table && <Block label="The committees"><CommitteeList rows={m.table} /></Block>}
        {hasImpact && (
          <Block label="Impact">
            <div className="grid gap-3 md:grid-cols-2">
              {m.impact && <p className={`${body} rounded-2xl border border-line p-5 md:col-span-2 md:p-6`}>{m.impact}</p>}
              {m.serves && <div className="rounded-2xl border border-line p-5 md:p-6"><p className="label text-mute">Who it serves</p><p className={`${body} mt-3`}>{m.serves}</p></div>}
              {m.measure && <div className="rounded-2xl border border-line p-5 md:p-6"><p className="label text-mute">How we’ll measure progress</p><p className={`${body} mt-3`}>{m.measure}</p></div>}
            </div>
          </Block>
        )}
        {m.note && <p role="note" className="rounded-2xl border border-blue/40 bg-blue/10 p-5 text-[1rem] leading-relaxed text-white/90 md:p-6"><span className="label mr-2 text-blue-hi">Please note</span>{m.note}</p>}
      </div>
      <footer className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <Link to="/counsels-room?mode=ask" className="label ulink inline-flex min-h-11 items-center gap-2 text-white">Question this commitment <Arrow /></Link>
          <RelatedCommunity id={m.id} />
        </div>
        <ShareButtons title={`Manifesto: ${m.title}`} path={`/manifesto?item=${m.id}`} />
      </footer>
    </article>
  );
}

export function QuickCommitment({ m, i }: { m: ManifestoItem; i: number }) {
  const what = quickWhat(m);
  const how = m.how.slice(0, 4).map(quickHow);
  const more = m.how.length - how.length;
  const impact = m.impact ?? m.serves;
  const rows: [string, React.ReactNode][] = [];
  if (what) rows.push(['What', <p className="text-[1.0625rem] font-medium leading-relaxed text-white">{what}</p>]);
  if (how.length) rows.push(['How', (
    <ul className="space-y-2">
      {how.map((h, k) => <li key={k} className="flex gap-3 leading-relaxed"><span className="mt-0.5 text-blue-hi" aria-hidden="true">—</span><span>{h.lead && <strong className="font-semibold text-white">{h.lead}{h.text ? '. ' : ''}</strong>}{h.text}</span></li>)}
      {more > 0 && <li className="label text-mute">+ {more} more in the full manifesto</li>}
    </ul>
  )]);
  if (impact) rows.push(['Impact', <p className="leading-relaxed">{impact}</p>]);
  return (
    <Reveal delay={(i % 2) * 80}>
      <article id={`c-${m.id}`} aria-labelledby={`t-${m.id}`} className="h-full scroll-mt-32 rounded-3xl border border-line bg-s1 p-5 md:p-7 lg:scroll-mt-8">
        <p className="label text-blue-hi">{m.n} · {m.category}</p>
        <h3 id={`t-${m.id}`} tabIndex={-1} className="display mt-2 text-3xl focus:outline-none md:text-4xl">{m.title}</h3>
        {m.tagline && <p className="mt-2 font-display text-lg font-semibold tracking-tight text-white/85">{m.tagline}</p>}
        <dl className="mt-5 divide-y divide-line">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1.5 py-4 sm:grid-cols-[5rem_1fr] sm:gap-4"><dt className="label pt-0.5 text-mute">{k}</dt><dd className="text-white/80">{v}</dd></div>
          ))}
        </dl>
        {m.note && <p className="mb-2 rounded-xl bg-blue/10 p-3 text-sm text-white/85"><span className="label mr-2 text-blue-hi">Note</span>{m.note}</p>}
        <Link to={`/manifesto?item=${m.id}&mode=full`} className="label ulink mt-2 inline-flex min-h-11 items-center gap-2 text-white">Read in full <Arrow /></Link>
      </article>
    </Reveal>
  );
}

/* ---------- Chapter ---------- */
export function ManifestoChapter({ c, mode, activeItem }: { c: Chapter; mode: Mode; activeItem: string | null }) {
  const [shareOpen, setShareOpen] = useState(false);
  const first = c.items[0].n, last = c.items[c.items.length - 1].n;
  const total = manifesto.length;
  const startPct = ((Number(first) - 1) / total) * 100;
  return (
    <section id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-32 lg:scroll-mt-8">
      <header className="mb-6 border-b border-line pb-6 md:mb-8">
        <div className="flex items-center justify-between gap-4">
          <p className="label text-blue-hi">Chapter {c.n}</p>
          <p className="label text-mute">{c.items.length} {c.items.length === 1 ? 'commitment' : 'commitments'} · {first === last ? first : `${first}–${last}`} of {String(total).padStart(2, '0')}</p>
        </div>
        <h2 id={`${c.id}-h`} className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)]">{c.title}</h2>
        {c.intro && <p className={`${body} mt-4 max-w-[62ch]`}>{c.intro}</p>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div aria-hidden="true" className="relative h-1 w-40 rounded-full bg-white/10"><span className="absolute h-1 rounded-full bg-blue" style={{ left: `${startPct}%`, width: `${(c.items.length / total) * 100}%` }} /></div>
          <button aria-expanded={shareOpen} onClick={() => setShareOpen(!shareOpen)} className="label ulink min-h-11 text-white">{shareOpen ? 'Hide share options' : 'Share this chapter'}</button>
        </div>
        {shareOpen && <ShareButtons className="mt-2" title={`Manifesto, chapter ${c.n}: ${c.title}`} path={`/manifesto?chapter=${c.slug}`} />}
      </header>
      <div className={mode === 'quick' ? 'grid gap-3 xl:grid-cols-2' : 'space-y-5'}>
        {c.items.map((m, i) => (mode === 'quick' ? <QuickCommitment key={m.id} m={m} i={i} /> : <ManifestoCommitment key={m.id} m={m} highlighted={activeItem === m.id} />))}
      </div>
    </section>
  );
}

/* ---------- Counsel's Room ---------- */
const MODES = [
  ['ask', 'Ask', 'Not sure what a commitment means? Ask.'],
  ['rant', 'Challenge', 'Disagree with an idea? Say so.'],
  ['issue', 'Raise a concern', 'Something missing or wrong? Flag it.'],
  ['suggest', 'Suggest', 'Have a better way? Propose it.'],
] as const;
export function ManifestoFeedback() {
  return (
    <section aria-labelledby="mf" className="relative overflow-hidden rounded-3xl border border-blue/30 bg-s1 p-6 md:p-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue/20 blur-[100px]" />
      <div className="relative">
        <p className="label text-blue-hi">Counsel’s Room</p>
        <h2 id="mf" className="display mt-4 text-[clamp(2.2rem,6vw,5rem)]">Read it? Now push back.</h2>
        <p className="mt-4 max-w-lg text-lg text-white/75">Every commitment is open to scrutiny. Ask, challenge, raise a concern or suggest. Your message goes on the record.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map(([m, l, d]) => (
            <li key={m}><Link to={`/counsels-room?mode=${m}`} className="group flex h-full min-h-32 flex-col justify-between rounded-2xl border border-line bg-s2 p-5 transition-colors hover:border-blue">
              <span className="font-display text-xl font-semibold tracking-tight">{l}</span>
              <span className="mt-4 flex items-end justify-between gap-3 text-sm text-mute"><span>{d}</span><span aria-hidden="true" className="text-white transition-transform group-hover:translate-x-1">→</span></span>
            </Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { resolveManifesto };
