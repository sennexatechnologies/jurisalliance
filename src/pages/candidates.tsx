import { Link, useParams } from 'react-router';
import { candidates, manifesto, type Candidate } from '../data/campaign';
import { Photo, Logo, useMeta } from '../brand';
import { shareImages } from '../assets';
import { Breadcrumb, CTASection, PageHeader, Placeholder, ShareButtons } from '../components/kit';
import { Arrow, Button, MaskText, Reveal, Section } from '../ui';

const Label = ({ children }: { children: React.ReactNode }) => <h3 className="label text-mute">{children}</h3>;
const Para = ({ v, note }: { v: string | null; note?: string }) => (v ? <p className="max-w-xl text-lg leading-relaxed text-white/85">{v}</p> : <Placeholder>{note ?? 'To be supplied by the candidate.'}</Placeholder>);
const Block = ({ label, children }: { label: string; children: React.ReactNode }) => <Reveal><Label>{label}</Label><div className="mt-3">{children}</div></Reveal>;

const Values = ({ c }: { c: Candidate }) => <ul className="flex flex-wrap gap-2">{c.values.map((v) => <li key={v} className="label rounded-full border border-line px-4 py-2 text-white/80">{v}</li>)}</ul>;
const Experience = ({ c }: { c: Candidate }) => c.experience.length
  ? <ul className="border-l border-line">{c.experience.map((x) => <li key={x} className="relative pb-4 pl-6 text-white/85"><span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-blue" />{x}</li>)}</ul>
  : <Placeholder>Experience to be supplied and verified. Nothing is listed until then.</Placeholder>;
const Priorities = ({ c, numbered = false }: { c: Candidate; numbered?: boolean }) => (
  <>
    <ul className={numbered ? 'border-t border-line' : 'grid gap-2 sm:grid-cols-3'}>
      {c.priorities.map((id, i) => {
        const m = manifesto.find((x) => x.id === id);
        if (!m) return null;
        return numbered ? (
          <li key={id}><Link to={`/manifesto?item=${id}`} className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-2 border-b border-line py-5"><span className="label text-blue-hi">0{i + 1}</span><span className="display text-2xl group-hover:text-blue-hi">{m.title}</span><span className="transition-transform group-hover:translate-x-1"><Arrow /></span></Link></li>
        ) : (
          <li key={id}><Link to={`/manifesto?item=${id}`} className="group flex min-h-16 items-center justify-between rounded-xl border border-line px-4 py-3 transition-colors hover:border-blue/60"><span className="font-display font-semibold">{m.title}</span><span className="transition-transform group-hover:translate-x-1"><Arrow /></span></Link></li>
        );
      })}
    </ul>
    <p className="mt-3 text-xs text-mute">Placeholder allocation from the manifesto. To be confirmed with the candidate.</p>
  </>
);
const Statement = ({ c }: { c: Candidate }) => (
  <blockquote className="rounded-2xl border border-line bg-s1 p-6 md:p-8">
    {c.statement ? <p className="display text-2xl md:text-3xl">{c.statement}</p> : <p className="text-mute">Candidate statement to be supplied by {c.name}. We don’t publish words that haven’t been given.</p>}
  </blockquote>
);

function Portrait({ c, page, ratio = 'aspect-[4/5]' }: { c: Candidate; page?: boolean; ratio?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-s2 ${ratio}`}>
      <Photo id={c.id} alt={c.imageAlt} focus={c.focus} eager={page} sizes="(min-width: 1024px) 40vw, 92vw" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <span className="label absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 backdrop-blur">{c.number}</span>
    </div>
  );
}

function Head({ c, as: H = 'h2' }: { c: Candidate; as?: 'h1' | 'h2' }) {
  return (
    <Reveal>
      <p className="label text-blue-hi">{c.number} · {c.position}</p>
      <H className="display mt-4 text-[clamp(2.4rem,6vw,5rem)]">{c.name}</H>
      <p className="mt-4 max-w-xl text-lg text-white/80">{c.intro ?? c.officeText}</p>
      <ShareButtons className="mt-6" title={`${c.position} candidate: ${c.name}`} path={`/candidates/${c.id}`} />
    </Reveal>
  );
}

// President: sticky portrait left, long-form narrative right
function President({ c, page }: { c: Candidate; page?: boolean }) {
  return (
    <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
      <div className="lg:sticky lg:top-24 lg:self-start"><Reveal><Portrait c={c} page={page} /></Reveal></div>
      <div>
        <Head c={c} as={page ? 'h1' : 'h2'} />
        <div className="mt-14 space-y-10">
          <Block label="Who I am"><Para v={c.story.who} /></Block>
          <Block label="Why I’m running"><Para v={c.story.why} /></Block>
          <Block label="Leadership experience"><Experience c={c} /></Block>
          <Block label="Core values"><Values c={c} /></Block>
          <Block label="Priorities"><Priorities c={c} /></Block>
          <Block label="My commitment"><Para v={c.story.commitment} /></Block>
          <Block label="Candidate statement"><Statement c={c} /></Block>
        </div>
      </div>
    </div>
  );
}

// Vice President: portrait right, office role as a lead panel, two-column cards
function VicePresident({ c, page }: { c: Candidate; page?: boolean }) {
  const card = 'rounded-2xl border border-line bg-s1 p-6';
  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="grid items-end gap-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div><Head c={c} as={page ? 'h1' : 'h2'} /></div>
        <Reveal className="lg:order-last"><Portrait c={c} page={page} ratio="aspect-[4/5] lg:aspect-[4/5]" /></Reveal>
      </div>
      <div className="mt-14 grid gap-3 md:grid-cols-2">
        <Reveal className={card}><Label>Who I am</Label><div className="mt-3"><Para v={c.story.who} /></div></Reveal>
        <Reveal className={card}><Label>Why I’m running</Label><div className="mt-3"><Para v={c.story.why} /></div></Reveal>
        <Reveal className={card}><Label>Experience</Label><div className="mt-3"><Experience c={c} /></div></Reveal>
        <Reveal className={card}><Label>Core values</Label><div className="mt-3"><Values c={c} /></div></Reveal>
        <Reveal className={`${card} md:col-span-2`}><Label>Priorities</Label><div className="mt-3"><Priorities c={c} /></div></Reveal>
        <Reveal className="md:col-span-2 rounded-2xl border border-blue/40 bg-blue/10 p-6 md:p-8"><Label>Role within the leadership team</Label><p className="display mt-3 text-2xl md:text-3xl">{c.officeRole}</p><p className="mt-3 max-w-2xl text-white/80">{c.officeText}</p></Reveal>
        <Reveal className="md:col-span-2"><Label>Candidate statement</Label><div className="mt-3"><Statement c={c} /></div></Reveal>
      </div>
    </div>
  );
}

// Secretary: wide portrait banner, numbered academic priorities, concerns prompt
function Secretary({ c, page }: { c: Candidate; page?: boolean }) {
  return (
    <div className="mx-auto max-w-[1280px]">
      <Reveal><Portrait c={c} page={page} ratio="aspect-[4/5] md:aspect-[16/10]" /></Reveal>
      <div className="mt-10"><Head c={c} as={page ? 'h1' : 'h2'} /></div>
      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="space-y-10">
          <Block label="Who I am"><Para v={c.story.who} /></Block>
          <Block label="Why I’m running"><Para v={c.story.why} /></Block>
          <Block label="Experience"><Experience c={c} /></Block>
          <Block label="Core values"><Values c={c} /></Block>
        </div>
        <div className="space-y-10">
          <Block label="Academic priorities"><Priorities c={c} numbered /></Block>
          <Block label="Student academic concerns">
            <p className="max-w-xl text-white/85">Concerns about teaching, assessment, timetables or academic processes are collected in the Counsel’s Room under Academics. Students decide what is shared publicly.</p>
            <Link to="/counsels-room?mode=issue&category=Academics" className="label ulink mt-4 inline-flex gap-2 text-white">Raise an academic concern <Arrow /></Link>
          </Block>
          <Block label="Candidate statement"><Statement c={c} /></Block>
        </div>
      </div>
    </div>
  );
}

const layouts: Record<string, typeof President> = { president: President, 'vice-president': VicePresident, 'secretary-academic-affairs': Secretary };

function Profile({ c, page = false }: { c: Candidate; page?: boolean }) {
  const L = layouts[c.id] ?? President;
  return (
    <article id={c.id} aria-label={`${c.position}: ${c.name}`} className="scroll-mt-24 border-t border-line px-5 py-20 md:px-10 md:py-32">
      <L c={c} page={page} />
      <div className="mx-auto mt-16 flex max-w-[1280px] flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href="/vision">Explore the vision <Arrow /></Button>
        <Button href="/manifesto" variant="ghost">Read the manifesto <Arrow /></Button>
        <Button href="/counsels-room?mode=ask" variant="ghost">Ask a question <Arrow /></Button>
        {!page && <Button href={`/candidates/${c.id}`} variant="ghost">Open full page <Arrow /></Button>}
      </div>
    </article>
  );
}

const rel: [string, string, string][] = [
  ['President', 'Overall student leadership', 'Sets direction, chairs the leadership team and answers for the campaign’s commitments.'],
  ['Vice President', 'Coordination and representation', 'Supports coordination across the team and carries students’ concerns to the table.'],
  ['Secretary of Academic Affairs', 'Academic-focused representation', 'Speaks for students on teaching, assessment and academic processes.'],
];

export function Candidates() {
  useMeta({ title: 'Meet the candidates', description: 'The President, Vice President and Secretary of Academic Affairs candidates of the Juris Leadership Alliance.', image: shareImages.team });
  return (
    <>
      <PageHeader eyebrow="Candidates" title="Meet the candidates" sub="Three candidates. One leadership vision.">
        <Logo eager className="mb-10 w-28 md:w-40" />
      </PageHeader>
      <nav aria-label="Candidates" className="sticky top-16 z-20 border-y border-line bg-ink/80 backdrop-blur-xl">
        <ul className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-5 py-3 md:px-10">
          {candidates.map((c) => <li key={c.id} className="shrink-0"><a href={`#${c.id}`} className="label inline-flex min-h-10 items-center rounded-full border border-line px-4 hover:border-white/50">{c.number} {c.position}</a></li>)}
        </ul>
      </nav>
      {candidates.map((c) => <Profile key={c.id} c={c} />)}

      <Section id="one-team" className="border-t border-line bg-s1">
        <h2 className="display text-[clamp(2.6rem,8vw,7rem)]"><MaskText text="Three offices." /><br /><MaskText text="One team." /></h2>
        <p className="mt-6 max-w-xl text-lg text-mute">Each office has a different job. Together they cover leading, connecting and advocating.</p>
        <ol className="mx-auto mt-16 max-w-2xl">
          {rel.map(([t, k, d], i) => (
            <li key={t}>
              <Reveal delay={i * 100}>
                <div className="rounded-2xl border border-line bg-ink p-6 md:p-8">
                  <p className="label text-blue-hi">{t}</p>
                  <p className="display mt-3 text-2xl md:text-3xl">{k}</p>
                  <p className="mt-3 text-mute">{d}</p>
                </div>
              </Reveal>
              {i < rel.length - 1 && <div aria-hidden="true" className="flex flex-col items-center py-2 text-blue-hi"><span className="h-8 w-px bg-blue" /><span>↓</span></div>}
            </li>
          ))}
        </ol>
      </Section>
      <CTASection title="Read the plan behind the people." actions={[{ label: 'Read the manifesto', to: '/manifesto' }, { label: 'Explore the vision', to: '/vision', ghost: true }, { label: 'Ask a question', to: '/counsels-room?mode=ask', ghost: true }]} />
    </>
  );
}

export function CandidatePage() {
  const { id } = useParams();
  const idx = candidates.findIndex((x) => x.id === id);
  const c = candidates[idx];
  useMeta({ title: c ? `${c.name}, ${c.position}` : 'Candidate not found', description: c?.intro ?? c?.officeText, image: c ? shareImages[c.id] : undefined });
  if (!c) return <PageHeader eyebrow="Not found" title="No such candidate" sub="Check the link or return to the candidates."><Breadcrumb items={[{ label: 'Candidates', to: '/candidates' }]} /></PageHeader>;
  const prev = candidates[(idx + candidates.length - 1) % candidates.length];
  const next = candidates[(idx + 1) % candidates.length];
  return (
    <>
      <div className="px-5 pt-28 md:px-10 md:pt-36"><div className="mx-auto max-w-[1280px]"><Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Candidates', to: '/candidates' }, { label: c.position }]} /></div></div>
      <Profile c={c} page />
      <nav aria-label="Candidate navigation" className="border-t border-line px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to={`/candidates/${prev.id}`} className="label ulink inline-flex min-h-11 items-center gap-2">← Previous candidate <span className="text-mute">{prev.position}</span></Link>
          <Link to="/candidates" className="label inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 hover:border-white/50">Back to candidates</Link>
          <Link to={`/candidates/${next.id}`} className="label ulink inline-flex min-h-11 items-center gap-2 sm:justify-end"><span className="text-mute">{next.position}</span> Next candidate →</Link>
        </div>
      </nav>
    </>
  );
}
