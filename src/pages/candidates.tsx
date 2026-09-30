import { Link, useParams } from 'react-router';
import { candidates, manifesto, questions, storySections, type Candidate } from '../data/campaign';
import { Breadcrumb, CTASection, FAQAccordion, PageHeader, Placeholder, ShareButtons } from '../components/kit';
import { Arrow, Button, MaskText, Reveal, Section } from '../ui';

function CandidateProfile({ c, page = false }: { c: Candidate; page?: boolean }) {
  return (
    <article id={c.id} className="scroll-mt-24 border-t border-line px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-s2">
              <img loading={page ? 'eager' : 'lazy'} src={c.photo} alt={`${c.position} candidate${c.placeholderPhoto ? ' (placeholder portrait)' : ''}`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <span className="label absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 backdrop-blur">{c.number}</span>
              {c.placeholderPhoto && <span className="label absolute right-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-mute backdrop-blur">Placeholder photo</span>}
            </div>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <p className="label text-blue-hi">{c.number} — {c.position}</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,6vw,5rem)]">{c.name}</h2>
            <p className="mt-4 text-lg text-white/80">{c.intro ?? c.officeText}</p>
            <ShareButtons className="mt-6" title={`${c.position} candidate: ${c.name}`} path={`/candidates/${c.id}`} />
          </Reveal>

          <div className="mt-14 space-y-10">
            {storySections.map(([k, label]) => (
              <Reveal key={k}>
                <h3 className="label text-mute">{label}</h3>
                <div className="mt-3">{c.story[k] ? <p className="max-w-xl text-lg leading-relaxed text-white/85">{c.story[k]}</p> : <Placeholder />}</div>
              </Reveal>
            ))}
            <Reveal>
              <h3 className="label text-mute">My experience</h3>
              <div className="mt-3">
                {c.experience.length ? <ul className="border-l border-line">{c.experience.map((x) => <li key={x} className="relative pb-4 pl-6 text-white/85"><span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-blue" />{x}</li>)}</ul> : <Placeholder>Leadership experience to be supplied and verified. Nothing is listed until then.</Placeholder>}
              </div>
            </Reveal>
            <Reveal>
              <div className="grid gap-8 sm:grid-cols-2">
                <div><h3 className="label text-mute">Academic background</h3><div className="mt-3">{c.academic ? <p>{c.academic}</p> : <Placeholder>To be supplied.</Placeholder>}</div></div>
                <div><h3 className="label text-mute">Achievements</h3><div className="mt-3">{c.achievements.length ? <ul className="space-y-2">{c.achievements.map((a) => <li key={a}>{a}</li>)}</ul> : <Placeholder>Listed once verified.</Placeholder>}</div></div>
              </div>
            </Reveal>
            <Reveal>
              <h3 className="label text-mute">Core values</h3>
              <ul className="mt-3 flex flex-wrap gap-2">{c.values.map((v) => <li key={v} className="label rounded-full border border-line px-4 py-2 text-white/80">{v}</li>)}</ul>
            </Reveal>
            <Reveal>
              <h3 className="label text-mute">Key priorities</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                {c.priorities.map((id) => { const m = manifesto.find((x) => x.id === id)!; return (
                  <li key={id}><Link to={`/manifesto?item=${id}`} className="group flex min-h-16 items-center justify-between rounded-xl border border-line px-4 py-3 transition-colors hover:border-blue/60"><span className="font-display font-semibold">{m.title}</span><span className="transition-transform group-hover:translate-x-1"><Arrow /></span></Link></li>
                ); })}
              </ul>
              <p className="mt-3 text-xs text-mute">Placeholder allocation. To be confirmed with the candidate.</p>
            </Reveal>
            <Reveal>
              <blockquote className="rounded-2xl border border-line bg-s1 p-6 md:p-8">
                {c.quote ? <p className="display text-2xl md:text-3xl">“{c.quote}”</p> : <p className="text-mute">Quote to be supplied by the candidate. We don’t publish quotes that haven’t been given.</p>}
              </blockquote>
            </Reveal>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/vision">Explore my vision <Arrow /></Button>
              <Button href="/manifesto" variant="ghost">Read the manifesto <Arrow /></Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

const rel = [
  ['President', 'Overall leadership', 'Sets direction, chairs the team, answers for commitments.'],
  ['Vice President', 'Coordination & representation', 'Joins up the work and carries every year group’s concerns to the table.'],
  ['Secretary of Academic Affairs', 'Academic advocacy', 'Speaks for students on teaching, assessment and academic processes.'],
];

export function Candidates() {
  return (
    <>
      <PageHeader eyebrow="Candidates" title="Meet the team" sub="Three candidates. One leadership vision." />
      <nav aria-label="Candidates" className="sticky top-16 z-20 border-y border-line bg-ink/80 backdrop-blur-xl">
        <ul className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-5 py-3 md:px-10">
          {candidates.map((c) => <li key={c.id} className="shrink-0"><a href={`#${c.id}`} className="label inline-flex min-h-10 items-center rounded-full border border-line px-4 hover:border-white/50">{c.number} {c.position}</a></li>)}
        </ul>
      </nav>
      {candidates.map((c) => <CandidateProfile key={c.id} c={c} />)}

      <Section id="one-team" className="border-t border-line bg-s1">
        <h2 className="display text-[clamp(2.6rem,8vw,7rem)]"><MaskText text="One team." /><br /><MaskText text="One direction." /></h2>
        <p className="mt-6 max-w-xl text-lg text-mute">Each office does a different job. Together they cover leading, connecting and advocating.</p>
        <div className="mt-16 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {rel.flatMap(([t, k, d], i) => {
            const card = (
              <Reveal key={t} delay={i * 100} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-ink p-6">
                  <p className="label text-blue-hi">{t}</p>
                  <div className="my-6 flex items-center gap-3 text-mute" aria-hidden="true"><span className="h-8 w-px bg-blue" /><span>↓</span></div>
                  <div><p className="display text-2xl">{k}</p><p className="mt-3 text-mute">{d}</p></div>
                </div>
              </Reveal>
            );
            return i < 2 ? [card, <span key={`p${i}`} aria-hidden="true" className="grid place-items-center font-display text-3xl text-blue-hi max-md:py-1">+</span>] : [card];
          })}
        </div>
      </Section>

      <Section id="questions" className="border-t border-line">
        <h2 className="display text-[clamp(2rem,5vw,4rem)]"><MaskText text="Questions we’re hearing" /></h2>
        <div className="mt-10"><FAQAccordion items={questions.slice(0, 4)} /></div>
      </Section>
      <CTASection title="Read the plan behind the people." actions={[{ label: 'Read the manifesto', to: '/manifesto' }, { label: 'Ask a question', to: '/faculty-pulse#ask', ghost: true }]} />
    </>
  );
}

export function CandidatePage() {
  const { id } = useParams();
  const c = candidates.find((x) => x.id === id);
  const idx = candidates.findIndex((x) => x.id === id);
  if (!c) return <PageHeader eyebrow="Not found" title="No such candidate" sub="Check the link or return to the team page."><Breadcrumb items={[{ label: 'Candidates', to: '/candidates' }]} /></PageHeader>;
  const next = candidates[(idx + 1) % candidates.length];
  return (
    <>
      <div className="px-5 pt-28 md:px-10 md:pt-36"><div className="mx-auto max-w-[1280px]"><Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Candidates', to: '/candidates' }, { label: c.position }]} /></div></div>
      <CandidateProfile c={c} page />
      <CTASection title={`Next: ${next.position}`} actions={[{ label: 'Read their story', to: `/candidates/${next.id}` }, { label: 'All candidates', to: '/candidates', ghost: true }]} />
    </>
  );
}
