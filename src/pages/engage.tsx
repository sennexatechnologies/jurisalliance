import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { campaign, events, eventEnd, eventStart, fetchPulseTopics, fmtDate, isPast, news, newsCategories, shareables, timeline, waLink, type PulseTopic } from '../data/campaign';
import { Breadcrumb, ContactBlock, CTASection, Empty, EventCard, NewsCard, PageHeader, PollChart, ShareButtons, usePoll, Cover } from '../components/kit';
import { FeedbackForm, IssueForm, VolunteerForm, volunteerAreas } from '../components/forms';
import { Logo, LogoMark, useMeta } from '../brand';
import { Arrow, Button, MaskText, Reveal, Section, useScrollProgress } from '../ui';
import { QuestionsSection } from './content';

const Block = ({ id, eyebrow, title, sub, children }: { id: string; eyebrow: string; title: string; sub?: string; children: React.ReactNode }) => (
  <Section id={id} className="scroll-mt-16 border-t border-line !py-20 md:!py-32">
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-24">
      <div>
        <Reveal><p className="label text-blue-hi">{eyebrow}</p></Reveal>
        <h2 className="display mt-5 text-[clamp(2.2rem,6vw,5rem)]"><MaskText text={title} /></h2>
        {sub && <Reveal delay={150}><p className="mt-6 max-w-md text-lg text-mute">{sub}</p></Reveal>}
      </div>
      <Reveal>{children}</Reveal>
    </div>
  </Section>
);

export function FacultyPulse() {
  const poll = usePoll();
  const [trends, setTrends] = useState<PulseTopic[] | null>(null);
  useEffect(() => { fetchPulseTopics().then(setTrends); }, []);
  const max = Math.max(1, ...(trends ?? []).map((t) => t.count));
  return (
    <>
      <PageHeader eyebrow="Unofficial student sentiment" title="Faculty Pulse" sub="What’s on the minds of students?" />
      <div className="px-5 pb-24 md:px-10"><div className="mx-auto max-w-[1280px] space-y-16">
        <PollChart data={poll} />
        <div className="grid gap-3 md:grid-cols-2">
          <section className="rounded-3xl border border-line bg-s1 p-6 md:p-10" aria-labelledby="trends">
            <h2 id="trends" className="label text-white">Most discussed topics</h2>
            {trends?.length ? (
              <ul className="mt-6 space-y-4">{trends.map((t) => <li key={t.category}><div className="flex justify-between text-sm"><span>{t.category}</span><span className="tabular-nums text-mute">{t.percentage}% · {t.count}</span></div><div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-blue" style={{ width: `${(t.count / max) * 100}%` }} /></div></li>)}</ul>
            ) : <div className="mt-6"><p className="label text-blue-hi">Data collection in progress</p><p className="mt-3 text-mute">Topics appear here once Counsel’s Room submissions have been reviewed and counted, grouped by category. Nothing is estimated.</p><Link to="/counsels-room" className="label ulink mt-5 inline-flex gap-2 text-white">Enter the Counsel’s Room <Arrow /></Link></div>}
            {trends?.length ? <p className="mt-6 text-xs text-mute">Last updated {fmtDate(trends.reduce((a, t) => (t.lastUpdated > a ? t.lastUpdated : a), trends[0].lastUpdated))}. Aggregated from reviewed submissions.</p> : null}
          </section>
          <section className="rounded-3xl border border-line bg-s1 p-6 md:p-10" aria-labelledby="themes">
            <h2 id="themes" className="label text-white">Feedback themes</h2>
            <p className="mt-6 text-mute">Themes from student feedback will be summarised here by the campaign team, clearly marked as campaign analysis of student messages.</p>
          </section>
        </div>
        <div className="rounded-2xl border border-line p-5 text-sm text-mute">
          <span className="label mr-2 text-white">How to read this page</span>
          Campaign content is written by the campaign. Student feedback comes from students. Faculty Pulse is unofficial. Official election information comes only from the Electoral Commission.
        </div>
      </div></div>

      <Block id="voice" eyebrow="Student voice" title="Your voice matters." sub="A question, a concern, an idea, a suggestion or an issue. Send it and we’ll read it."><FeedbackForm variant="voice" /></Block>
      <QuestionsSection limit={6} />
      <CTASection title="See something to fix? Help us fix it." actions={[{ label: 'Enter the Counsel’s Room', to: '/counsels-room' }, { label: 'Join the movement', to: '/join', ghost: true }, { label: 'Read the manifesto', to: '/manifesto', ghost: true }]} />
    </>
  );
}

const joinActions: [string, string, string, string][] = [
  ['Volunteer', 'Give an hour on campus. Small tasks, real difference.', 'Volunteer', '/join?area=General support#volunteer'],
  ['Support campaign operations', 'Bring a skill: research, design, writing, organising.', 'Apply', '/join?area=Policy#volunteer'],
  ['Help with outreach', 'Talk to classmates in your year group.', 'Sign up', '/join?area=Outreach#volunteer'],
  ['Support the digital campaign', 'Design, content, social and site support.', 'Sign up', '/join?area=Digital#volunteer'],
  ['Help with events', 'Set up, host and follow up.', 'Sign up', '/join?area=Events#volunteer'],
  ['Share the vision', 'Send one manifesto card to one classmate.', 'Go to sharing', '/newsroom#share'],
  ['Share feedback', 'Tell us what you think, anonymously if you prefer.', 'Open the Counsel’s Room', '/counsels-room'],
  ['Submit questions', 'Put a question to the campaign on the record.', 'Ask', '/counsels-room?mode=ask'],
  ['Attend a campaign event', 'Forums, dialogues and the debate.', 'See events', '/events'],
];

export function Join() {
  const [params] = useSearchParams();
  const area = params.get('area');
  const pre = volunteerAreas.find((a) => a === area) ?? undefined;
  return (
    <>
      <PageHeader eyebrow="Join the movement" title="Join the movement" sub="Leadership is bigger than three names."><Logo className="mb-10 w-28 md:w-36" /></PageHeader>
      <div className="px-5 pb-24 md:px-10"><div className="mx-auto max-w-[1280px]">
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="group mb-3 flex min-h-24 items-center justify-between gap-4 rounded-2xl bg-blue-deep p-6 transition-colors hover:bg-blue-press md:p-10">
          <span><span className="label text-white/80">Fastest way to reach us</span><span className="display mt-2 block text-3xl md:text-5xl">WhatsApp the campaign</span></span>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {joinActions.map(([t, d, cta, to], i) => (
            <Reveal as="li" key={t} delay={(i % 4) * 70}>
              <Link to={to} className="group flex h-full min-h-56 flex-col justify-between rounded-2xl border border-line bg-s1 p-6 transition-colors hover:border-blue/70">
                <div><span className="label text-blue-hi">0{i + 1}</span><h3 className="display mt-3 text-2xl">{t}</h3><p className="mt-3 text-mute">{d}</p></div>
                <span className="label mt-8 flex items-center gap-2">{cta} <span className="transition-transform group-hover:translate-x-1"><Arrow /></span></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div></div>
      <Block id="volunteer" eyebrow="Volunteer" title="Join the team" sub="Tell us where you can help. We’ll get back to you on the contact method you choose."><VolunteerForm key={pre} preselect={pre} /></Block>
      <Block id="issue" eyebrow="Submit an issue" title="What should we fix?" sub="One issue, one sentence is enough. Submissions inform the manifesto and each representatives’ meeting."><IssueForm /></Block>
      <QuestionsSection />
      <Section id="contact" className="border-t border-line !py-20 md:!py-32">
        <h2 className="display mb-10 text-[clamp(2rem,5vw,4rem)]"><MaskText text="Contact the campaign" /></h2>
        <ContactBlock />
        <div className="mt-6"><Button href="/counsels-room?mode=ask" variant="ghost">Submit a question <Arrow /></Button></div>
      </Section>
    </>
  );
}

function Timeline() {
  const [ref, p] = useScrollProgress<HTMLOListElement>();
  return (
    <ol ref={ref} className="relative ml-3 md:ml-0">
      <span aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-line md:left-[calc(25%-0.5px)]" />
      <span aria-hidden="true" className="absolute left-0 top-0 w-px bg-blue md:left-[calc(25%-0.5px)]" style={{ height: `${p * 100}%` }} />
      {timeline.map((t, i) => {
        const on = p >= i / timeline.length;
        return (
          <li key={t.event} className="relative grid gap-2 pb-12 pl-8 last:pb-0 md:grid-cols-[25%_1fr] md:pl-0">
            <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full transition-colors duration-500 md:left-[calc(25%-5px)] ${on ? 'bg-blue' : 'bg-white/20'}`} />
            <p className="label pt-1 text-mute md:pr-10 md:text-right">{t.date}</p>
            <div className={`transition-opacity duration-500 md:pl-10 ${on ? 'opacity-100' : 'opacity-40'}`}>
              <h3 className="display text-2xl md:text-4xl">{t.event}</h3><p className="mt-2 max-w-md text-mute">{t.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Events() {
  const upcoming = events.filter((e) => !isPast(e)).sort((a, b) => +eventStart(a) - +eventStart(b));
  const past = events.filter(isPast).sort((a, b) => +eventStart(b) - +eventStart(a));
  return (
    <>
      <PageHeader eyebrow="Events" title="Events" sub="Forums, dialogues and campus moments. Dates are added only once confirmed."><div className="mb-8 flex items-center gap-3"><LogoMark className="h-10 w-10" /><span className="label text-mute">Juris Leadership Alliance</span></div></PageHeader>
      <div className="px-5 pb-24 md:px-10"><div className="mx-auto max-w-[1280px] space-y-16">
        <section aria-labelledby="up">
          <h2 id="up" className="label mb-6 text-white">Upcoming events</h2>
          {upcoming.length ? <ul className="grid gap-3 md:grid-cols-2">{upcoming.map((e) => <EventCard key={e.id} e={e} />)}</ul> : (
            <Empty title="Nothing scheduled yet. Check back soon." text="Join the WhatsApp broadcast to hear as soon as a date is set." action={<Button href={waLink('Please add me to the campaign event updates.')} external>Get event updates <Arrow /></Button>} />
          )}
        </section>
        <section aria-labelledby="pa">
          <h2 id="pa" className="label mb-6 text-white">Past events</h2>
          {past.length ? <ul className="grid gap-3 md:grid-cols-2">{past.map((e) => <EventCard key={e.id} e={e} />)}</ul> : <p className="text-mute">No past events yet.</p>}
        </section>
      </div></div>
      <Section id="road" className="border-t border-line bg-s1">
        <div className="mb-16"><Reveal><p className="label text-blue-hi">Timeline</p></Reveal><h2 className="display mt-5 text-[clamp(2.4rem,7vw,6rem)]"><MaskText text="The road to election day" /></h2><p className="mt-6 max-w-xl text-lg text-mute">Dates are confirmed here as the Electoral Commission publishes them.</p></div>
        <Timeline />
      </Section>
      <CTASection title="Read the latest." actions={[{ label: 'Read the latest news', to: '/newsroom' }, { label: 'Join the movement', to: '/join', ghost: true }]} />
    </>
  );
}

const ics = (t: string) => t.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
function downloadIcs(e: (typeof events)[number]) {
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Campaign//EN', 'BEGIN:VEVENT', `UID:${e.id}@campaign`, `DTSTAMP:${ics(new Date().toISOString())}`,
    `DTSTART:${ics(eventStart(e).toISOString())}`, `DTEND:${ics(eventEnd(e).toISOString())}`, `SUMMARY:${e.title}`, `LOCATION:${e.location}`, `DESCRIPTION:${e.description.replace(/\n/g, ' ')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  a.download = `${e.id}.ics`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function EventDetail() {
  const { id } = useParams();
  const e = events.find((x) => x.id === id);
  useMeta({ title: e?.title ?? 'Event not found', description: e?.description });
  if (!e) return <PageHeader eyebrow="Events" title="Event not found" sub="It may have been removed or the link may be wrong."><Breadcrumb items={[{ label: 'Events', to: '/events' }]} /></PageHeader>;
  const past = isPast(e);
  return (
    <>
      <PageHeader eyebrow={past ? 'Past event' : 'Upcoming event'} title={e.title}>
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Events', to: '/events' }, { label: e.title }]} />
      </PageHeader>
      <div className="px-5 pb-24 md:px-10"><div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          <p className="max-w-2xl text-xl leading-relaxed">{e.description}</p>
          {e.agenda?.length ? <div><h2 className="label text-mute">Agenda</h2><ol className="mt-4 space-y-3">{e.agenda.map((a, i) => <li key={i} className="flex gap-4"><span className="label text-blue-hi">{String(i + 1).padStart(2, '0')}</span>{a}</li>)}</ol></div> : null}
          {e.speakers?.length ? <div><h2 className="label text-mute">Speakers & participants</h2><ul className="mt-4 space-y-2">{e.speakers.map((s) => <li key={s}>{s}</li>)}</ul></div> : null}
          <ShareButtons title={e.title} path={`/events/${e.id}`} />
        </div>
        <aside className="h-fit rounded-2xl border border-line bg-s1 p-6">
          <dl className="space-y-5">
            <div><dt className="label text-mute">Date</dt><dd className="mt-1">{fmtDate(e.date)}</dd></div>
            <div><dt className="label text-mute">Time</dt><dd className="mt-1">{e.time}{e.endTime ? ` – ${e.endTime}` : ''}</dd></div>
            <div><dt className="label text-mute">Location</dt><dd className="mt-1">{e.location}</dd></div>
          </dl>
          {!past && <div className="mt-8 flex flex-col gap-2">
            <Button href={waLink(`RSVP: ${e.title} (${fmtDate(e.date)})`)} external>RSVP on WhatsApp</Button>
            <Button variant="ghost" onClick={() => downloadIcs(e)}>Add to calendar</Button>
          </div>}
        </aside>
      </div></div>
      <CTASection title="More to come." actions={[{ label: 'Back to events', to: '/events' }, { label: 'Read the latest news', to: '/newsroom', ghost: true }]} />
    </>
  );
}

export function Newsroom() {
  const [cat, setCat] = useState('All');
  const list = news.filter((n) => cat === 'All' || n.category === cat);
  return (
    <>
      <PageHeader eyebrow="Newsroom" title="From the campaign" sub="Updates, manifesto releases, forums and announcements." />
      <div className="px-5 pb-24 md:px-10"><div className="mx-auto max-w-[1280px]">
        <div role="group" aria-label="Filter by category" className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {['All', ...newsCategories].map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`label min-h-10 shrink-0 rounded-full border px-4 transition-colors ${cat === c ? 'border-blue bg-blue-deep' : 'border-line text-white/70 hover:border-white/40'}`}>{c}</button>)}
        </div>
        {list.length ? <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{list.map((n, i) => <NewsCard key={n.id} n={n} i={i} />)}</ul> : <Empty title="Campaign updates are on the way." text="Nothing has been published in this category yet." />}
      </div></div>
      <Section id="share" className="border-t border-line bg-s1">
        <div className="mb-12"><p className="label text-blue-hi">Share</p><h2 className="display mt-5 text-[clamp(2.4rem,7vw,6rem)]"><MaskText text="Pass it on" /></h2><p className="mt-6 text-lg text-mute">Made for WhatsApp status, Instagram, TikTok and X.</p></div>
        <ul className="grid gap-3 md:grid-cols-3">
          {shareables.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 80}>
              <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl border border-line bg-gradient-to-br from-s2 to-ink p-6">
                <span className="label text-blue-hi">{s.kind}</span>
                <p className="display text-3xl md:text-4xl">{s.text}</p>
                <div><p className="label mb-4 text-mute">{campaign.faculty}</p><ShareButtons title={s.text} path="/" /></div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>
      <CTASection title="Meet the people." actions={[{ label: 'Meet the candidates', to: '/candidates' }, { label: 'Read the manifesto', to: '/manifesto', ghost: true }]} />
    </>
  );
}

export function Article() {
  const { id } = useParams();
  const n = news.find((x) => x.id === id);
  useMeta({ title: n?.title ?? 'Story not found', description: n?.content[0] });
  if (!n) return <PageHeader eyebrow="Newsroom" title="Story not found" sub="It may have moved."><Breadcrumb items={[{ label: 'Newsroom', to: '/newsroom' }]} /></PageHeader>;
  const related = news.filter((x) => x.id !== n.id).slice(0, 3);
  return (
    <>
      <article>
        <PageHeader eyebrow={`${n.category} · ${n.date ? fmtDate(n.date) : 'Undated'}`} title={n.title}>
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Newsroom', to: '/newsroom' }, { label: n.category }]} />
        </PageHeader>
        <div className="px-5 md:px-10"><div className="mx-auto max-w-3xl">
          {n.image ? <img src={n.image} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover" /> : <Cover category={n.category} title={n.title} className="aspect-[16/9] rounded-2xl" />}
          <p className="label mt-8 flex items-center gap-3 text-mute"><LogoMark className="h-8 w-8" />By {n.author} · Juris Leadership Alliance</p>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-white/85">{n.content.map((p, i) => <p key={i}>{p}</p>)}</div>
          <ShareButtons className="mt-12 border-t border-line pt-8" title={n.title} path={`/newsroom/${n.id}`} />
        </div></div>
      </article>
      <Section id="related" className="mt-16 border-t border-line">
        <h2 className="display mb-10 text-3xl md:text-5xl">Related stories</h2>
        <ul className="grid gap-3 md:grid-cols-3">{related.map((r, i) => <NewsCard key={r.id} n={r} i={i} />)}</ul>
      </Section>
      <CTASection title="Meet the candidates." actions={[{ label: 'Meet the candidates', to: '/candidates' }, { label: 'Read the manifesto', to: '/manifesto', ghost: true }, { label: 'Back to newsroom', to: '/newsroom', ghost: true }]} />
    </>
  );
}

export function NotFound() {
  return (
    <PageHeader eyebrow="404" title="Page not found" sub="That page doesn’t exist.">
      <div className="mb-8" />
      <div className="flex flex-wrap gap-3"><Button href="/">Go home <Arrow /></Button><Button href="/candidates" variant="ghost">Meet the candidates</Button><Button href="/counsels-room" variant="ghost">Counsel’s Room</Button></div>
    </PageHeader>
  );
}
