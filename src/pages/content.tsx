import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { manifesto, manifestoFilters, pillars, questions, team, teamGroups, type ManifestoItem } from '../data/campaign';
import { CTASection, Empty, FAQAccordion, ManifestoCard, PageHeader, PlanChain, ShareButtons, TeamMemberCard, VisionPillar } from '../components/kit';
import { Arrow, Button, MaskText, Reveal, Section } from '../ui';

export function QuestionsSection({ limit = 4 }: { limit?: number }) {
  return (
    <Section id="questions" className="border-t border-line">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="display text-[clamp(2rem,5vw,4rem)]"><MaskText text="Questions we’re hearing" /></h2>
        <Button href="/counsels-room?mode=ask" variant="ghost">Ask a question <Arrow /></Button>
      </div>
      <FAQAccordion items={questions.slice(0, limit)} />
    </Section>
  );
}

export function Vision() {
  return (
    <>
      <PageHeader eyebrow="The vision" title="The vision" sub="Where we want to take the Faculty of Law." />
      <div className="px-5 md:px-10"><div className="mx-auto max-w-[1280px]">
        <nav aria-label="Pillars" className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {pillars.map((p) => <a key={p.id} href={`#${p.id}`} className="label inline-flex min-h-10 shrink-0 items-center rounded-full border border-line px-4 hover:border-white/50">{p.n} {p.title.split(' ')[0]}</a>)}
        </nav>
        {pillars.map((p) => <VisionPillar key={p.id} p={p} full />)}
      </div></div>
      <CTASection title="From vision to plan." text="Every pillar is backed by specific manifesto commitments." actions={[{ label: 'Read the full manifesto', to: '/manifesto' }, { label: 'Meet the candidates', to: '/candidates', ghost: true }]} />
    </>
  );
}

function Detail({ item, onClose }: { item: ManifestoItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); };
  }, [onClose]);
  const blocks: [string, string][] = [['The issue', item.issue], ['What we propose', item.proposal], ['Who it serves', item.serves], ['How progress could be measured', item.measure]];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center md:p-8" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="m-title" onClick={(e) => e.stopPropagation()} className="max-h-[92dvh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-line bg-s1 p-6 md:rounded-3xl md:p-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label text-blue-hi">{item.n} / {manifesto.length} · {item.category} · {item.status}</p>
            <h3 id="m-title" className="display mt-3 text-4xl md:text-6xl">{item.title}</h3>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-xl hover:border-white/60">×</button>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-[3fr_2fr]">
          <div className="space-y-8">
            {blocks.slice(0, 2).map(([k, v]) => <div key={k}><p className="label text-mute">{k}</p><p className="mt-2 text-lg leading-relaxed">{v}</p></div>)}
            <div>
              <p className="label text-mute">How it would work</p>
              <ul className="mt-2 space-y-2">{item.how.map((h) => <li key={h} className="flex gap-3 text-white/85"><span className="text-blue-hi">—</span>{h}</li>)}</ul>
            </div>
            {blocks.slice(2).map(([k, v]) => <div key={k}><p className="label text-mute">{k}</p><p className="mt-2 text-white/85">{v}</p></div>)}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ShareButtons title={`Manifesto: ${item.title}`} path={`/manifesto?item=${item.id}`} />
              <Link to="/counsels-room?mode=ask" className="label ulink inline-flex gap-2">Ask a question <Arrow /></Link>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-line bg-s2 p-6">
            <p className="label mb-6">Promise → Plan</p>
            <PlanChain m={item} />
          </aside>
        </div>
      </div>
    </div>
  );
}

export function Manifesto() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [f, setF] = useState<string>('All');
  const active = manifesto.find((m) => m.id === params.get('item')) ?? null;
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return manifesto.filter((m) => (f === 'All' || m.category === f) && (!t || `${m.title} ${m.category} ${m.issue} ${m.proposal} ${m.how.join(' ')} ${m.serves}`.toLowerCase().includes(t)));
  }, [q, f]);
  const close = () => { const p = new URLSearchParams(params); p.delete('item'); setParams(p, { replace: true }); };
  return (
    <>
      <PageHeader eyebrow="Manifesto" title="The manifesto" sub="Ten commitments. Each one states the issue, the proposal, how it would work, who it serves and how you would know it happened." />
      <section className="px-5 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="sticky top-16 z-20 -mx-5 border-y border-line bg-ink/85 px-5 py-4 backdrop-blur-xl md:-mx-10 md:px-10">
            <label className="sr-only" htmlFor="msearch">Search the manifesto</label>
            <input id="msearch" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the manifesto..." className="w-full rounded-full border border-line bg-s1 px-5 py-3.5 text-base placeholder:text-white/35 focus:border-blue focus:outline-none" />
            <div role="group" aria-label="Filter by topic" className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
              {['All', ...manifestoFilters].map((c) => (
                <button key={c} aria-pressed={f === c} onClick={() => setF(c)} className={`label min-h-10 shrink-0 rounded-full border px-4 transition-colors ${f === c ? 'border-blue bg-blue' : 'border-line text-white/70 hover:border-white/40'}`}>{c}</button>
              ))}
            </div>
          </div>
          <p className="label mt-6 text-mute" aria-live="polite">{list.length} of {manifesto.length} commitments</p>
          <div className="mt-6 pb-24">
            {list.length ? (
              <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
                {list.map((m, i) => <ManifestoCard key={m.id} m={m} i={i} onOpen={() => setParams({ item: m.id }, { replace: true })} />)}
              </div>
            ) : (
              <Empty title="Nothing matches that." text="Try a different word or clear the filter. If something isn’t covered, tell us." action={<Button href="/counsels-room?mode=ask">Ask a question <Arrow /></Button>} />
            )}
          </div>
        </div>
      </section>
      <QuestionsSection />
      <CTASection title="Something unclear?" text="Ask. Every question gets an answer." actions={[{ label: 'Ask a question', to: '/counsels-room?mode=ask' }, { label: 'Meet the candidates', to: '/candidates', ghost: true }]} />
      {active && <Detail item={active} onClose={close} />}
    </>
  );
}

export function Team() {
  return (
    <>
      <PageHeader eyebrow="The team" title="The team behind the vision" sub="Law students who volunteered their time. Names and photos are added as each member confirms." />
      <div className="px-5 pb-24 md:px-10"><div className="mx-auto max-w-[1280px] space-y-16">
        {teamGroups.map((g) => {
          const m = team.filter((t) => t.group === g);
          return (
            <section key={g} aria-labelledby={`g-${g}`}>
              <h2 id={`g-${g}`} className="label mb-6 border-b border-line pb-3 text-white">{g}</h2>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5">{m.map((t, i) => <TeamMemberCard key={t.id} t={t} i={i} />)}</ul>
            </section>
          );
        })}
      </div></div>
      <CTASection title="Want to be part of it?" actions={[{ label: 'Join the team', to: '/join#volunteer' }, { label: 'Meet the candidates', to: '/candidates', ghost: true }]} />
    </>
  );
}
