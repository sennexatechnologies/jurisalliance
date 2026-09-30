import { Link } from 'react-router';
import { campaign, candidates, events, isPast, manifesto, news, pillars, team, waLink } from '../data/campaign';
import { CandidateCard, Empty, EventCard, ManifestoCard, NewsCard, PollChart, TeamMemberCard, usePoll } from '../components/kit';
import { openSay } from '../components/overlays';
import { Arrow, Button, MaskText, Reveal, Section } from '../ui';

function Head({ eyebrow, title, to, cta, sub }: { eyebrow: string; title: string; to: string; cta: string; sub?: string }) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
      <div>
        <Reveal><p className="label text-blue-hi">{eyebrow}</p></Reveal>
        <h2 className="display mt-5 text-[clamp(2.4rem,7vw,6rem)]"><MaskText text={title} /></h2>
        {sub && <Reveal delay={150}><p className="mt-5 max-w-xl text-lg text-mute">{sub}</p></Reveal>}
      </div>
      <Reveal><Button href={to} variant="ghost" className="shrink-0">{cta} <Arrow /></Button></Reveal>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-24 pt-28 md:px-10 md:pb-20">
      <img src={candidates[0].photo} alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_20%] opacity-60 md:object-[80%_15%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
      <div className="relative mx-auto w-full max-w-[1280px]">
        <Reveal><p className="label text-blue-hi">{campaign.faculty} · Leadership team</p></Reveal>
        <h1 className="display mt-5 text-[clamp(3.2rem,12vw,10.5rem)]"><MaskText text="The faculty we deserve." /></h1>
        <Reveal delay={300}>
          <p className="mt-8 font-display text-2xl font-semibold leading-tight tracking-tight md:text-4xl">Leadership with purpose.<br />Representation with results.</p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">Three candidates, one practical agenda: a Faculty of Law that communicates clearly, supports students early and reports back on every promise.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/vision">Explore the vision <Arrow /></Button>
            <Button href="/candidates" variant="ghost">Meet the candidates <Arrow /></Button>
          </div>
        </Reveal>
      </div>
      <div className="absolute bottom-6 right-6 hidden h-16 w-px overflow-hidden bg-white/15 md:block" aria-hidden="true">
        <span className="block h-1/2 w-full bg-white" style={{ animation: 'scrollcue 2s ease-in-out infinite' }} />
      </div>
    </section>
  );
}

function Positioning() {
  return (
    <Section id="positioning" className="border-t border-line bg-s1">
      <h2 className="display text-[clamp(2.6rem,9vw,8rem)]"><MaskText text="This is not about" /><br /><MaskText text="a title." /></h2>
      <Reveal delay={200}><p className="mt-10 font-display text-2xl font-semibold tracking-tight text-blue-hi md:text-5xl">It’s about what we do with it.</p></Reveal>
      <Reveal delay={300}><p className="mt-10 max-w-xl text-lg leading-relaxed text-mute">A Faculty leadership team is a channel between students and the people who decide. The job is to make that channel clear, fast and honest, and to show the work.</p></Reveal>
    </Section>
  );
}

export default function Home() {
  const poll = usePoll();
  const upcoming = events.filter((e) => !isPast(e)).slice(0, 3);
  return (
    <>
      <Hero />
      <Positioning />

      <Section id="candidates">
        <Head eyebrow="The candidates" title="The people behind the vision" to="/candidates" cta="Meet the team" />
        <div className="grid gap-8 md:grid-cols-3">{candidates.map((c, i) => <CandidateCard key={c.id} c={c} i={i} />)}</div>
      </Section>

      <Section id="vision" className="bg-s1">
        <Head eyebrow="The vision" title="Where we want to take the Faculty" to="/vision" cta="Explore the vision" sub="Seven pillars, each with a problem, a vision and a way to measure it." />
        <ul className="border-t border-line">
          {pillars.slice(0, 4).map((p) => (
            <Reveal as="li" key={p.id}>
              <Link to={`/vision#${p.id}`} className="group grid items-baseline gap-2 border-b border-line py-6 md:grid-cols-[1fr_3fr_3fr] md:py-8">
                <span className="label text-blue-hi">{p.n}</span>
                <span className="display text-2xl transition-colors group-hover:text-blue-hi md:text-4xl">{p.title}</span>
                <span className="text-mute">{p.vision}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <p className="label mt-6 text-mute">+ {pillars.length - 4} more pillars</p>
      </Section>

      <Section id="manifesto">
        <Head eyebrow="Manifesto highlights" title="Ten commitments. Ten plans." to="/manifesto" cta="Read the full manifesto" />
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
          {manifesto.slice(0, 4).map((m, i) => <ManifestoCard key={m.id} m={m} i={i} to={`/manifesto?item=${m.id}`} />)}
        </div>
      </Section>

      <Section id="team" className="bg-s1">
        <Head eyebrow="The team" title="The team behind the vision" to="/team" cta="Meet the full team" />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {team.filter((t) => t.role.includes('Lead') || t.role.includes('Coordinator')).slice(0, 5).map((t, i) => <TeamMemberCard key={t.id} t={t} i={i} />)}
        </ul>
      </Section>

      <Section id="pulse">
        <Head eyebrow="Faculty Pulse" title="What students are saying" to="/faculty-pulse" cta="Open Faculty Pulse" />
        <PollChart data={poll} />
      </Section>

      <Section id="join" className="bg-s1">
        <Head eyebrow="Join the movement" title="Leadership is bigger than three names" to="/join" cta="Join the movement" />
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl bg-blue p-6 transition-colors hover:bg-blue-hi md:p-10">
          <span><span className="label text-white/80">Fastest way to reach us</span><span className="display mt-2 block text-3xl md:text-5xl">WhatsApp the campaign</span></span>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>
      </Section>

      <Section id="events">
        <Head eyebrow="Events" title="Upcoming events" to="/events" cta="View all events" />
        {upcoming.length ? <ul className="grid gap-3 md:grid-cols-3">{upcoming.map((e) => <EventCard key={e.id} e={e} />)}</ul> : (
          <Empty title="Nothing scheduled yet. Check back soon." text="Forums and dialogues are announced here first." action={<Button href="/newsroom" variant="ghost">Read the latest news <Arrow /></Button>} />
        )}
      </Section>

      <Section id="news" className="bg-s1">
        <Head eyebrow="Newsroom" title="From the campaign" to="/newsroom" cta="Visit the newsroom" />
        {news.length ? <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{news.slice(0, 4).map((n, i) => <NewsCard key={n.id} n={n} i={i} />)}</ul> : <Empty title="Campaign updates are on the way." text="Stories will appear here." />}
      </Section>

      <Section id="voice">
        <div className="grid gap-10 rounded-3xl border border-line bg-s1 p-8 md:p-16 lg:grid-cols-2">
          <div>
            <Reveal><p className="label text-blue-hi">Student voice</p></Reveal>
            <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5rem)]"><MaskText text="Your voice matters." /></h2>
            <Reveal delay={150}><p className="mt-6 max-w-md text-lg text-mute">Ask a question, share an idea, report an issue or tell us straight what’s going on. Every message is read.</p></Reveal>
          </div>
          <Reveal className="flex flex-col justify-end gap-3">
            <Button onClick={openSay}>Have your say <Arrow /></Button>
            <Button href="/faculty-pulse#ask" variant="ghost">Ask the campaign <Arrow /></Button>
            <Button href="/faculty-pulse#straight" variant="ghost">Say it straight <Arrow /></Button>
          </Reveal>
        </div>
      </Section>

      <section className="relative overflow-hidden border-t border-line px-5 py-32 md:px-10 md:py-52">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/25 blur-[120px]" style={{ animation: 'drift 18s ease-in-out infinite' }} />
        <div className="relative mx-auto max-w-[1280px]">
          <h2 className="display text-[clamp(2.8rem,10vw,9rem)]"><MaskText text="The next chapter" /><br /><MaskText text="starts with us." /></h2>
          <Reveal delay={200}>
            <p className="mt-8 max-w-lg text-lg text-white/75">Explore the vision. Ask the hard questions. Be part of the conversation.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/manifesto">Explore the manifesto <Arrow /></Button>
              <Button href="/join" variant="ghost">Join the movement <Arrow /></Button>
              <Button href={waLink()} external variant="ghost">Contact the campaign <Arrow /></Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
