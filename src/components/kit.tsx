import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import {
  campaign, eventStart, fetchPoll, fmtDate, previewPoll, waLink,
  type Candidate, type EventItem, type ManifestoItem, type NewsItem, type PollData, type Question, type TeamMember, type VisionPillarT,
} from '../data/campaign';
import { Photo } from '../brand';
import { Arrow, Button, MaskText, Reveal, useCountUp, useInView } from '../ui';

export const Placeholder = ({ children = 'To be supplied by the candidate.' }: { children?: ReactNode }) => (
  <p className="rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-mute">{children}</p>
);

export function PageHeader({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute -right-1/4 top-0 h-[50vw] w-[50vw] rounded-full bg-blue/15 blur-[120px]" />
      <div className="relative mx-auto max-w-[1280px]">
        {children}
        <p className="label text-blue-hi">{eyebrow}</p>
        <h1 className="display mt-5 text-[clamp(2.8rem,10vw,9rem)]"><MaskText text={title} /></h1>
        {sub && <Reveal delay={200}><p className="mt-6 max-w-xl text-lg text-mute md:text-xl">{sub}</p></Reveal>}
      </div>
    </header>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="label mb-8 flex flex-wrap items-center gap-2 text-mute">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.to ? <Link to={it.to} className="ulink hover:text-white">{it.label}</Link> : <span className="text-white" aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function ShareButtons({ title, path, className = '' }: { title: string; path?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const url = path ? `${location.origin}${path}` : location.href;
  const msg = `${title} — ${campaign.faculty} campaign`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };
  const b = 'label inline-flex min-h-11 items-center rounded-full border border-line px-4 transition-colors hover:border-white/50';
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label={`Share ${title}`}>
      <a className={`${b} !border-blue bg-blue hover:!bg-blue-hi`} href={`https://wa.me/?text=${encodeURIComponent(`${msg}\n${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <button className={b} onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
      <a className={b} href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">X</a>
    </div>
  );
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 p-8 md:p-14">
      <h3 className="display text-3xl md:text-5xl">{title}</h3>
      <p className="mt-4 max-w-md text-mute">{text}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export function CTASection({ title, text, actions }: { title: string; text?: string; actions: { label: string; to?: string; href?: string; ghost?: boolean }[] }) {
  return (
    <section className="relative overflow-hidden border-t border-line px-5 py-24 md:px-10 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/15 blur-[120px]" style={{ animation: 'drift 18s ease-in-out infinite' }} />
      <div className="relative mx-auto max-w-[1280px]">
        <h2 className="display text-[clamp(2.4rem,8vw,7rem)]"><MaskText text={title} /></h2>
        {text && <Reveal delay={150}><p className="mt-6 max-w-lg text-lg text-white/75">{text}</p></Reveal>}
        <Reveal delay={250}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {actions.map((a) => (
              <Button key={a.label} href={a.to ?? a.href} external={!!a.href && !a.to} variant={a.ghost ? 'ghost' : 'primary'}>{a.label} <Arrow /></Button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FAQAccordion({ items }: { items: Question[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="border-t border-line">
      {items.map((q) => {
        const on = open === q.id;
        return (
          <li key={q.id} className="border-b border-line">
            <h3>
              <button aria-expanded={on} aria-controls={`faq-${q.id}`} onClick={() => setOpen(on ? null : q.id)} className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left">
                <span className="font-display text-xl font-semibold tracking-tight md:text-2xl">{q.question}</span>
                <span aria-hidden="true" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-transform ${on ? 'rotate-45 border-blue' : ''}`}>+</span>
              </button>
            </h3>
            <div id={`faq-${q.id}`} hidden={!on} className="pb-6 pr-12">
              <p className="label mb-2 text-blue-hi">{q.category}</p>
              <p className="max-w-2xl text-white/80">{q.answer ?? 'Awaiting an answer.'}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function QuestionCard({ q }: { q: Question }) {
  return (
    <article className="rounded-2xl border border-line bg-s1 p-6">
      <p className="label text-blue-hi">{q.category} · {q.status}</p>
      <h3 className="mt-3 font-display text-xl font-semibold">{q.question}</h3>
      {q.answer && <p className="mt-3 text-mute">{q.answer}</p>}
    </article>
  );
}

export function CandidateCard({ c, i = 0 }: { c: Candidate; i?: number }) {
  return (
    <Reveal delay={i * 90}>
      <Link to={`/candidates/${c.id}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-s2">
          <Photo id={c.id} alt={c.imageAlt} focus={c.focus} sizes="(min-width: 768px) 30vw, 90vw" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <span className="label absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 backdrop-blur">{c.number}</span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="label text-blue-hi">{c.position}</p>
            <h3 className="display mt-2 text-3xl">{c.name}</h3>
          </div>
        </div>
        <p className="mt-4 text-mute">{c.intro ?? c.officeText}</p>
        <span className="label mt-4 inline-flex items-center gap-2">Read full story <span className="transition-transform group-hover:translate-x-1"><Arrow /></span></span>
      </Link>
    </Reveal>
  );
}

export function TeamMemberCard({ t, i = 0 }: { t: TeamMember; i?: number }) {
  return (
    <Reveal as="li" delay={(i % 5) * 70}>
      <article tabIndex={0} className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-s2 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-blue/60 md:p-5">
        {t.photo ? (
          <img loading="lazy" src={t.photo} alt={t.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <span aria-hidden="true" className="absolute right-3 top-2 font-display text-8xl font-bold text-white/[0.06] md:text-9xl">{t.name.charAt(0)}</span>
        )}
        <div className="relative">
          <p className="label text-blue-hi">{t.role}</p>
          <h3 className="mt-2 font-display text-lg font-semibold leading-tight">{t.name}</h3>
          <p className="mt-2 max-h-0 overflow-hidden text-sm leading-snug text-mute opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100 group-focus:max-h-32 group-focus:opacity-100 max-md:max-h-32 max-md:opacity-100">{t.line}</p>
        </div>
      </article>
    </Reveal>
  );
}

export function EventCard({ e }: { e: EventItem }) {
  const d = eventStart(e);
  return (
    <li>
      <Link to={`/events/${e.id}`} className="group flex h-full gap-5 rounded-2xl border border-line bg-s1 p-6 transition-colors hover:border-blue/60">
        <div className="w-16 shrink-0 text-center">
          <p className="font-display text-4xl font-bold leading-none">{d.getDate()}</p>
          <p className="label mt-1 text-blue-hi">{d.toLocaleDateString('en-KE', { month: 'short' })}</p>
        </div>
        <div>
          <p className="label text-mute">{e.time} · {e.location}</p>
          <h3 className="display mt-2 text-2xl">{e.title}</h3>
          <p className="mt-2 line-clamp-2 text-mute">{e.description}</p>
          <span className="label mt-4 inline-flex gap-2">Details <Arrow /></span>
        </div>
      </Link>
    </li>
  );
}

export function Cover({ category, title, className = '' }: { category: string; title: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-s2 to-ink ${className}`} role="img" aria-label={`${category} cover`}>
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-2/3 w-2/3 rounded-full bg-blue/25 blur-3xl" />
      <span aria-hidden="true" className="display absolute bottom-2 left-4 text-[6rem] leading-none text-white/[0.07] md:text-[8rem]">{category.slice(0, 3)}</span>
      <span className="sr-only">{title}</span>
    </div>
  );
}

export function NewsCard({ n, i = 0 }: { n: NewsItem; i?: number }) {
  return (
    <Reveal as="li" delay={i * 80}>
      <Link to={`/newsroom/${n.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink transition-colors hover:border-white/30">
        {n.image ? <img loading="lazy" src={n.image} alt="" className="aspect-[16/9] w-full object-cover" /> : <Cover category={n.category} title={n.title} className="aspect-[16/9]" />}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between"><span className="label text-blue-hi">{n.category}</span><span className="label text-mute">{n.date ? fmtDate(n.date) : 'Undated'}</span></div>
            <h3 className="display mt-4 text-2xl leading-[1.02]">{n.title}</h3>
            <p className="mt-3 text-mute">{n.excerpt}</p>
          </div>
          <span className="label mt-6 flex items-center gap-2">Read story <span className="transition-transform group-hover:translate-x-1"><Arrow /></span></span>
        </div>
      </Link>
    </Reveal>
  );
}

export function PlanChain({ m }: { m: ManifestoItem }) {
  const steps = [['Issue', m.issue], ['Proposal', m.proposal], ['Action', m.how[0]], ['Measurement', m.measure]];
  return (
    <ol>
      {steps.map(([k, v], i) => (
        <li key={k} className="relative flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <span className={`grid h-7 w-7 place-items-center rounded-full border font-mono text-[11px] ${i === 3 ? 'border-blue bg-blue text-white' : 'border-white/30'}`}>{i + 1}</span>
            {i < 3 && <span className="mt-1 w-px flex-1 bg-gradient-to-b from-white/30 to-white/5" />}
          </div>
          <div><p className="label text-blue-hi">{k}</p><p className="mt-1 text-white/85">{v}</p></div>
        </li>
      ))}
    </ol>
  );
}

export function ManifestoCard({ m, onOpen, to, i = 0 }: { m: ManifestoItem; onOpen?: () => void; to?: string; i?: number }) {
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <span className="font-display text-6xl font-bold tracking-tighter text-white/15 transition-colors group-hover:text-blue md:text-7xl">{m.n}</span>
        <span className="label rounded-full border border-line px-3 py-1.5 text-mute">{m.category}</span>
      </div>
      <div className="mt-10">
        <h3 className="display text-2xl md:text-3xl">{m.title}</h3>
        <p className="mt-3 max-w-md text-mute">{m.tagline}</p>
        <span className="label mt-6 inline-flex items-center gap-2">Open <span className="transition-transform group-hover:translate-x-1"><Arrow /></span></span>
      </div>
    </>
  );
  const cls = 'group flex h-full min-h-64 w-full flex-col justify-between bg-s1 p-6 text-left transition-colors duration-500 hover:bg-s2 md:p-8';
  return (
    <Reveal delay={(i % 2) * 80}>
      {to ? <Link to={to} className={cls}>{inner}</Link> : <button onClick={onOpen} className={cls}>{inner}</button>}
    </Reveal>
  );
}

export function VisionPillar({ p, full = false }: { p: VisionPillarT; full?: boolean }) {
  const rows: [string, string][] = [['Problem', p.problem], ['Vision', p.vision], ['Objective', p.objective], ['Approach', p.approach], ['Student benefit', p.benefit]];
  return (
    <Reveal className="scroll-mt-24">
      <article id={p.id} className="grid gap-8 border-t border-line py-12 md:grid-cols-[1fr_2fr] md:py-20">
        <div>
          <span className="font-display text-7xl font-bold tracking-tighter text-white/15 md:text-9xl">{p.n}</span>
          <h3 className="display mt-4 text-3xl md:text-4xl">{p.title}</h3>
          {full && <ShareButtons className="mt-6" title={`Vision: ${p.title}`} path={`/vision#${p.id}`} />}
        </div>
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {rows.map(([k, v], i) => (
            <div key={k} className={i === 1 ? 'sm:col-span-2' : ''}>
              <dt className={`label ${k === 'Vision' ? 'text-blue-hi' : 'text-mute'}`}>{k}</dt>
              <dd className={`mt-2 ${k === 'Vision' ? 'font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl' : 'text-white/85'}`}>{v}</dd>
            </div>
          ))}
          {full && <div className="sm:col-span-2"><Link to={`/manifesto?item=${p.manifesto}`} className="label ulink inline-flex gap-2 text-white">See the manifesto item <Arrow /></Link></div>}
        </dl>
      </article>
    </Reveal>
  );
}

// ---------- Poll ----------
export function usePoll() {
  const [data, setData] = useState<PollData | null>(null);
  useEffect(() => {
    if (new URLSearchParams(location.search).get('demo') === 'pulse') return setData(previewPoll());
    fetchPoll().then(setData);
  }, []);
  return data;
}

function Bar({ name, pct, votes, run, i }: { name: string; pct: number; votes: number; run: boolean; i: number }) {
  const n = useCountUp(pct, run);
  return (
    <li className="py-5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-xl font-semibold uppercase tracking-tight md:text-3xl">{name}</span>
        <span className="font-display text-3xl font-bold tabular-nums md:text-6xl">{n.toFixed(0)}<span className="text-blue-hi">%</span></span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${name}: ${pct.toFixed(0)} percent, ${votes} responses`}>
        <div className="h-full rounded-full bg-blue transition-[width] duration-[1400ms] ease-out" style={{ width: run ? `${pct}%` : 0, transitionDelay: `${i * 120}ms` }} />
      </div>
      <p className="label mt-2 text-mute">{votes} responses</p>
    </li>
  );
}

export function PollChart({ data }: { data: PollData | null }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const total = useCountUp(data?.totalResponses ?? 0, seen);
  const fmt = (s?: string) => (s ? new Date(s).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : '—');
  const status = !data ? 'Data collection in progress' : data.status === 'open' ? 'Open' : data.status === 'closed' ? 'Closed' : 'Pending';
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="label rounded-full border border-line px-3 py-1.5 text-white/80">Unofficial student sentiment</span>
        {data?.live && <span className="label flex items-center gap-2 rounded-full border border-red-500/40 px-3 py-1.5 text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-500" style={{ animation: 'pulse-dot 1.6s infinite' }} /> Live</span>}
        {data?.preview && <span className="label rounded-full border border-amber-400/50 px-3 py-1.5 text-amber-300">Preview data · not real</span>}
      </div>
      <div ref={ref} className="grid gap-10 rounded-3xl border border-line bg-s1 p-6 md:p-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
        {data && data.options.length ? (
          <ul className="divide-y divide-line">{data.options.map((o, i) => <Bar key={o.candidateName} name={o.candidateName} pct={o.percentage} votes={o.votes} run={seen} i={i} />)}</ul>
        ) : (
          <div className="flex min-h-64 flex-col justify-center">
            <div className="mb-8 space-y-4" aria-hidden="true">{[70, 45, 25].map((w) => <div key={w} className="h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-white/10" style={{ width: `${w}%` }} /></div>)}</div>
            <p className="display text-3xl md:text-5xl">Data collection<br />in progress</p>
            <p className="mt-4 max-w-md text-mute">Student pulse collection is underway. Nothing on this panel is estimated or invented.</p>
          </div>
        )}
        <dl className="grid content-start gap-6 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div><dt className="label text-mute">Total responses</dt><dd className="mt-2 font-display text-5xl font-bold tabular-nums">{data ? Math.round(total) : '—'}</dd></div>
          <div><dt className="label text-mute">Last updated</dt><dd className="mt-2">{fmt(data?.lastUpdated)}</dd></div>
          <div><dt className="label text-mute">Poll status</dt><dd className="mt-2">{status}</dd></div>
        </dl>
      </div>
      <p className="mt-6 max-w-2xl text-sm text-mute">This is an unofficial student sentiment snapshot and does not represent official election results.</p>
    </div>
  );
}

export function ContactBlock() {
  const rows = [
    ['WhatsApp', 'Fastest reply', waLink(), true],
    ['Email', campaign.email, `mailto:${campaign.email}`, false],
    ['Social', 'Instagram · TikTok · X', campaign.socials[0].href, true],
  ] as const;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {rows.map(([k, v, h, ext]) => (
        <a key={k} href={h} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group rounded-2xl border border-line bg-s1 p-6 transition-colors hover:border-blue/60">
          <p className="label text-blue-hi">{k}</p><p className="mt-3 font-display text-xl font-semibold">{v}</p>
          <span className="label mt-6 inline-flex gap-2">Open <Arrow /></span>
        </a>
      ))}
    </div>
  );
}
