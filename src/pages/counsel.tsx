import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  counselModes, fetchBoard, fetchStatus, issueCategories, sendSignal, statusLabel, submitCounsel, waLink,
  type CounselInput, type CounselMode, type CounselStatus, type CounselSubmission, type IssueCategory,
} from '../data/campaign';
import { Logo, LogoMark, useMeta } from '../brand';
import { Chips, Field, field } from '../components/forms';
import { CTASection, Empty, PageHeader, ShareButtons } from '../components/kit';
import { Arrow, Button, MaskText, Reveal, Section } from '../ui';

const MODERATION_NOTICE = 'Speak freely, but do not post private personal information, threats, harassment or unverified accusations about identifiable people.';

const modeCopy: Record<CounselMode, { eyebrow: string; title: string; prompt: string; label: string; placeholder: string; cta: string; ctaAnon: string }> = {
  ask: { eyebrow: 'Ask the campaign', title: 'Ask the campaign', prompt: 'Have a question? Put it on the record.', label: 'Your question', placeholder: 'What would you like to know?', cta: 'Ask the question', ctaAnon: 'Ask the question' },
  rant: { eyebrow: 'Rant', title: 'Rant', prompt: 'What’s on your mind?', label: 'What’s on your mind?', placeholder: 'Say it plainly.', cta: 'Submit anonymously', ctaAnon: 'Submit anonymously' },
  suggest: { eyebrow: 'Suggest', title: 'Share an idea', prompt: 'What could make student life or the Faculty experience better?', label: 'Your idea', placeholder: 'Describe the idea in a few sentences.', cta: 'Submit idea', ctaAnon: 'Submit idea' },
  issue: { eyebrow: 'Raise an issue', title: 'Raise an issue', prompt: 'Something broken that needs attention? Describe it.', label: 'The issue', placeholder: 'e.g. Timetable changes reach students too late', cta: 'Raise issue', ctaAnon: 'Raise issue' },
};

const responseFormats = ['Public answer on the board', 'Private reply', 'Answer at a forum', 'No preference'];

const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

// ---------- Form ----------
function Seg({ anonymous, onChange, allowContact }: { anonymous: boolean; onChange: (a: boolean) => void; allowContact: boolean }) {
  const opt = (a: boolean, title: string, text: string) => (
    <label className={`block cursor-pointer rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-hi ${anonymous === a ? 'border-blue bg-blue/10' : 'border-line hover:border-white/40'}`}>
      <input type="radio" name="privacy" className="sr-only" checked={anonymous === a} onChange={() => onChange(a)} />
      <span className="label text-white">{title}</span>
      <span className="mt-1 block text-sm text-mute">{text}</span>
    </label>
  );
  return (
    <fieldset>
      <legend className="label text-mute">How do you want to send this?</legend>
      <div className={`mt-3 grid gap-2 ${allowContact ? 'sm:grid-cols-2' : ''}`}>
        {opt(true, 'Anonymous', 'No name or contact details asked for or sent.')}
        {allowContact && opt(false, 'Contact me', 'You give a way to reach you. Only the campaign team sees it.')}
      </div>
    </fieldset>
  );
}

type Result = { delivered: boolean; reference: string; mode: CounselMode; text: string; anonymous: boolean };

function Confirmation({ r, onEdit, onNew }: { r: Result; onEdit: () => void; onNew: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(r.reference); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };
  if (!r.delivered) {
    return (
      <div role="status" className="rounded-3xl border border-amber-400/40 bg-s1 p-6 md:p-10">
        <LogoMark className="h-10 w-10" />
        <h3 className="display mt-6 text-3xl">Not sent yet.</h3>
        <p className="mt-3 text-mute">The Counsel’s Room isn’t connected to the campaign’s inbox yet, so your message has not been received by anyone. It is still in the form, nothing was stored.</p>
        <p className="mt-3 text-mute">If you want it to reach the campaign now, you can send it on WhatsApp. That is not anonymous: WhatsApp shows your phone number to the campaign.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href={waLink(`[${r.mode}] ${r.text}`)} external>Send on WhatsApp <Arrow /></Button>
          <Button variant="ghost" onClick={onEdit}>Back to my message</Button>
        </div>
      </div>
    );
  }
  return (
    <div role="status" className="rounded-3xl border border-blue/50 bg-s1 p-6 md:p-10">
      <LogoMark className="h-10 w-10" />
      <h3 className="display mt-6 text-3xl md:text-4xl">{r.mode === 'ask' ? 'Question received.' : 'Received.'}</h3>
      <p className="label mt-6 text-mute">Your reference</p>
      <p className="display mt-2 text-4xl text-blue-hi md:text-6xl">Counsel #{r.reference}</p>
      <p className="mt-4 max-w-md text-mute">Save this reference. It doesn’t contain any personal information{r.anonymous ? ', and because you chose anonymous it is the only way to recognise this message as yours' : ''}. It will be used to check the status once that feature is switched on.</p>
      <p className="mt-3 max-w-md text-mute">The campaign reviews every message before anything appears publicly. Being received is not a promise of a particular outcome.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onClick={copy}>{copied ? 'Copied' : 'Copy reference'}</Button>
        <Button variant="ghost" onClick={onNew}>Send another</Button>
        <Button variant="ghost" href="/faculty-pulse">See Faculty Pulse <Arrow /></Button>
      </div>
    </div>
  );
}

function CounselForm({ mode }: { mode: CounselMode }) {
  const c = modeCopy[mode];
  const [cat, setCat] = useState<string[]>([issueCategories[0]]);
  const [anonymous, setAnonymous] = useState(true);
  const [msg, setMsg] = useState('');
  const [desc, setDesc] = useState('');
  const [support, setSupport] = useState('');
  const [fmtPref, setFmtPref] = useState([responseFormats[3]]);
  const [contact, setContact] = useState('');
  const [publicOk, setPublicOk] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const allowContact = mode !== 'rant';
  const anon = allowContact ? anonymous : true;
  useEffect(() => { setErr({}); setResult(null); }, [mode]);
  useEffect(() => { if (anon && fmtPref[0] === 'Private reply') setFmtPref([responseFormats[3]]); }, [anon, fmtPref]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (msg.trim().length < (mode === 'issue' ? 5 : 10)) x.msg = mode === 'issue' ? 'Describe the issue in a few words.' : 'Please write a little more.';
    if (mode === 'issue' && desc.trim().length < 10) x.desc = 'Add a short description.';
    if (!anon && contact.trim().length < 5) x.contact = 'Add an email or phone number, or switch to Anonymous.';
    setErr(x);
    if (Object.keys(x).length) return;
    const input: CounselInput = {
      mode, category: cat[0] as IssueCategory, message: msg.trim(), anonymous: anon, publicOk,
      context: mode === 'issue' ? [desc.trim(), support.trim() && `Supporting information: ${support.trim()}`].filter(Boolean).join('\n\n') : mode === 'suggest' ? desc.trim() : undefined,
      responseFormat: mode === 'ask' ? fmtPref[0] : undefined,
      contact: anon ? undefined : contact.trim(),
    };
    setSending(true);
    const res = await submitCounsel(input);
    setSending(false);
    setResult({ ...res, mode, anonymous: anon, text: [`${c.title} (${cat[0]}): ${msg.trim()}`, input.context].filter(Boolean).join('\n') });
  };

  const reset = () => { setResult(null); setMsg(''); setDesc(''); setSupport(''); setContact(''); setPublicOk(false); };
  if (result) return <Confirmation r={result} onEdit={() => setResult(null)} onNew={reset} />;

  return (
    <form onSubmit={submit} className="space-y-6" noValidate aria-label={c.title}>
      <Chips legend="Category" options={[...issueCategories]} value={cat} onChange={setCat} />

      {mode === 'issue' ? (
        <Field label={c.label} error={err.msg}><input aria-invalid={!!err.msg} maxLength={140} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={c.placeholder} className={field} /></Field>
      ) : (
        <Field label={c.label} error={err.msg}>
          <textarea aria-invalid={!!err.msg} rows={mode === 'rant' ? 9 : 5} maxLength={1500} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={c.placeholder} className={field} />
        </Field>
      )}

      {mode === 'issue' && (
        <>
          <Field label="Description" error={err.desc}><textarea aria-invalid={!!err.desc} rows={4} maxLength={1500} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What happened, where, and who it affects." className={field} /></Field>
          <Field label="Supporting information (optional)" hint="Dates, places, unit codes. Not other people’s personal details."><textarea rows={2} maxLength={800} value={support} onChange={(e) => setSupport(e.target.value)} className={field} /></Field>
        </>
      )}
      {mode === 'suggest' && (
        <Field label="Context (optional)" hint="Who it would help, and why it matters."><textarea rows={3} maxLength={800} value={desc} onChange={(e) => setDesc(e.target.value)} className={field} /></Field>
      )}
      {mode === 'ask' && (
        <Chips legend="Preferred way to get an answer (optional)" options={anon ? responseFormats.filter((f) => f !== 'Private reply') : responseFormats} value={fmtPref} onChange={setFmtPref} />
      )}

      {allowContact ? <Seg anonymous={anonymous} onChange={setAnonymous} allowContact /> : (
        <div className="rounded-2xl border border-blue bg-blue/10 p-4"><span className="label text-white">Anonymous only</span><span className="mt-1 block text-sm text-mute">No name or contact details asked for or sent.</span></div>
      )}

      {!anon && (
        <Field label="Email or phone number" hint="Only the campaign team sees this. It is never shown publicly." error={err.contact}>
          <input aria-invalid={!!err.contact} value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" className={field} />
        </Field>
      )}

      <label className="flex cursor-pointer items-start gap-3 text-sm text-white/85">
        <input type="checkbox" checked={publicOk} onChange={(e) => setPublicOk(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#3b7bff]" />
        <span>You may show this on the public Counsel’s Board after moderation. <span className="text-mute">Off by default. Your name and contact details are never shown.</span></span>
      </label>

      {mode === 'issue' && (
        <p className="rounded-xl border border-line p-4 text-sm text-mute">This is not an emergency service or a formal university complaint channel. If you are in danger or need urgent help, contact the university or emergency services directly. Raising an issue here does not guarantee a particular outcome.</p>
      )}
      <p className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-mute"><span className="label mr-2 text-white">Before you send</span>{MODERATION_NOTICE}</p>

      <Button type="submit" disabled={sending}>{sending ? 'Sending…' : (anon ? c.ctaAnon : c.cta)} <Arrow /></Button>
      <p className="text-xs text-mute">Anonymous means we don’t ask for or publish who you are. Your internet connection can still be seen by the hosting service, as with any website.</p>
    </form>
  );
}

// ---------- Board ----------
function Signal({ reference }: { reference: string }) {
  const [state, setState] = useState<'idle' | 'sent' | 'failed'>('idle');
  const send = async (v: 'yes' | 'not-sure') => setState((await sendSignal(reference, v)) ? 'sent' : 'failed');
  return (
    <div className="mt-5 border-t border-line pt-4">
      <p className="label text-mute" id={`sig-${reference}`}>Is this an issue you care about?</p>
      {state === 'sent' ? <p className="mt-3 text-sm text-mute">Thanks. Counted in the totals only. No one can see who answered.</p> : (
        <div className="mt-3 flex gap-2" role="group" aria-labelledby={`sig-${reference}`}>
          <button onClick={() => send('yes')} className="label min-h-10 rounded-full border border-line px-5 hover:border-white/50">Yes</button>
          <button onClick={() => send('not-sure')} className="label min-h-10 rounded-full border border-line px-5 hover:border-white/50">Not sure</button>
        </div>
      )}
      {state === 'failed' && <p role="alert" className="mt-2 text-xs text-red-400">Couldn’t record that. Try again later.</p>}
    </div>
  );
}

export function BoardCard({ s }: { s: CounselSubmission }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-s1 p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="label text-blue-hi">Counsel #{s.reference}</p>
        <p className="label text-mute">{fmt(s.createdAt)}</p>
      </div>
      <p className="label mt-2 text-mute">{s.category}</p>
      <p className="label mt-6 text-white">Counsel asked</p>
      <p className="mt-2 whitespace-pre-line text-white/90">{s.message}</p>
      <p className="label mt-6 text-white">Campaign response</p>
      {s.response ? <p className="mt-2 whitespace-pre-line text-white/90">{s.response}{s.respondedAt && <span className="label mt-2 block text-mute">{fmt(s.respondedAt)}</span>}</p> : <p className="mt-2 text-mute">No response yet.</p>}
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <p className="label text-mute">Status</p>
        <p className="label rounded-full border border-line px-3 py-1.5">{statusLabel[s.status]}</p>
      </div>
      <Signal reference={s.reference} />
      <ShareButtons className="mt-5" title={`Counsel #${s.reference}`} path="/counsels-room#board" />
    </article>
  );
}

export function useBoard() {
  const [board, setBoard] = useState<CounselSubmission[] | null | undefined>(undefined);
  useEffect(() => { fetchBoard().then(setBoard); }, []);
  return board; // undefined = loading, null = not connected
}

// ---------- Status lookup ----------
function StatusLookup() {
  const [ref, setRef] = useState('');
  const [out, setOut] = useState<null | 'loading' | 'unavailable' | 'none' | { status: CounselStatus; response: string | null }>(null);
  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ref.trim().length < 4) return;
    setOut('loading');
    const r = await fetchStatus(ref);
    setOut(r === 'unavailable' ? 'unavailable' : r === null ? 'none' : r);
  };
  return (
    <form onSubmit={go} className="rounded-2xl border border-line bg-s1 p-6 md:p-8">
      <h3 className="display text-2xl">Check a submission</h3>
      <p className="mt-2 text-mute">Enter the reference you saved, e.g. JLA-7F42.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="ref">Reference</label>
        <input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="JLA-XXXX" autoCapitalize="characters" className={`${field} !mt-0 sm:max-w-xs`} />
        <Button type="submit" variant="ghost">Check status</Button>
      </div>
      <div aria-live="polite" className="mt-4 text-sm">
        {out === 'loading' && <p className="text-mute">Checking…</p>}
        {out === 'unavailable' && <p className="text-mute">Status lookup isn’t switched on yet. Keep your reference, it will work once the Counsel’s Room is connected.</p>}
        {out === 'none' && <p className="text-mute">No submission found for that reference.</p>}
        {out && typeof out === 'object' && (
          <div><p><span className="label mr-2 text-mute">Status</span>{statusLabel[out.status]}</p>{out.response && <p className="mt-2 text-white/85">{out.response}</p>}</div>
        )}
      </div>
    </form>
  );
}

// ---------- Page ----------
const trust: [string, string][] = [
  ['Anonymous submissions', 'Choose Anonymous and we never ask for your name or contact details.'],
  ['Moderated discussion', 'Every message is reviewed before anything is shown publicly.'],
  ['No public personal information', 'Names and contact details are never displayed on the board.'],
];

export function CounselsRoom() {
  useMeta({ title: 'The Counsel’s Room', description: 'A space for students to ask questions, raise concerns, share ideas and give feedback.' });
  const [params, setParams] = useSearchParams();
  const mode = (counselModes.find((m) => m.id === params.get('mode'))?.id ?? 'ask') as CounselMode;
  const catFilter = params.get('category') ?? 'All';
  const board = useBoard();

  useEffect(() => {
    if (params.get('mode')) { const t = setTimeout(() => document.getElementById('compose')?.scrollIntoView({ behavior: 'smooth' }), 200); return () => clearTimeout(t); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (m: CounselMode) => {
    const p = new URLSearchParams(params); p.set('mode', m); setParams(p, { replace: true });
    document.getElementById('compose')?.scrollIntoView({ behavior: 'smooth' });
  };
  const setCat = (c: string) => { const p = new URLSearchParams(params); if (c === 'All') p.delete('category'); else p.set('category', c); setParams(p, { replace: true }); };
  const shown = (board ?? []).filter((s) => catFilter === 'All' || s.category === catFilter);
  const c = modeCopy[mode];

  return (
    <>
      <PageHeader eyebrow="The Counsel’s Room" title="The floor is yours." sub="A space for students to ask questions, raise concerns, share ideas and provide feedback.">
        <div className="mb-8 flex items-center gap-3"><LogoMark className="h-10 w-10" /><span className="label text-mute">A Juris Leadership Alliance space</span></div>
      </PageHeader>

      <section aria-labelledby="modes" className="px-5 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <h2 id="modes" className="sr-only">Choose how you want to speak</h2>
          <div role="radiogroup" aria-label="How do you want to speak?" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {counselModes.map((m, i) => (
              <Reveal key={m.id} delay={i * 70}>
                <button role="radio" aria-checked={mode === m.id} onClick={() => pick(m.id)} className={`group flex min-h-44 w-full flex-col justify-between rounded-2xl border p-6 text-left transition-colors ${mode === m.id ? 'border-blue bg-blue/10' : 'border-line bg-s1 hover:border-white/40'}`}>
                  <span className="label text-blue-hi">0{i + 1}</span>
                  <span><span className="display block text-3xl">{m.verb}</span><span className="mt-2 block text-mute">{m.blurb}</span></span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Section id="compose" className="scroll-mt-16 !py-16 md:!py-24">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="label text-blue-hi">{c.eyebrow}</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,4.2rem)]">{c.title}</h2>
            <p className="mt-5 max-w-sm text-xl text-white/85">{c.prompt}</p>
            <div className="mt-10 rounded-2xl border border-line bg-s1 p-6">
              <p className="display text-xl">Your voice matters.</p>
              <p className="mt-2 text-sm text-mute">Share what you think. We will treat submissions with respect and review them responsibly.</p>
              <ul className="mt-5 space-y-3">
                {trust.map(([t, d]) => <li key={t} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-deep" /><span><span className="label block text-white">{t}</span><span className="text-sm text-mute">{d}</span></span></li>)}
              </ul>
            </div>
          </div>
          <div key={mode}>
            <CounselForm mode={mode} />
          </div>
        </div>
      </Section>

      <Section id="board" className="scroll-mt-16 border-t border-line bg-s1">
        <div className="mb-10 md:mb-14">
          <Reveal><p className="label text-blue-hi">Public, moderated</p></Reveal>
          <h2 className="display mt-5 text-[clamp(2.4rem,7vw,6rem)]"><MaskText text="The Counsel’s Board" /></h2>
          <Reveal delay={150}><p className="mt-5 max-w-xl text-lg text-mute">Questions and issues students have chosen to share.</p></Reveal>
        </div>
        <div role="group" aria-label="Filter by category" className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {['All', ...issueCategories].map((cat) => (
            <button key={cat} aria-pressed={catFilter === cat} onClick={() => setCat(cat)} className={`label min-h-10 shrink-0 rounded-full border px-4 transition-colors ${catFilter === cat ? 'border-blue bg-blue-deep' : 'border-line text-white/70 hover:border-white/40'}`}>{cat}</button>
          ))}
        </div>
        {board === undefined ? <p className="text-mute" aria-live="polite">Loading…</p> : shown.length ? (
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{shown.map((s) => <li key={s.id}><BoardCard s={s} /></li>)}</ul>
        ) : (
          <Empty title="No public submissions yet." text={board === null ? 'The board is empty until the Counsel’s Room is connected and students have chosen to share. Nothing here is made up.' : 'Nothing has been approved for this category yet.'} action={<Button onClick={() => pick('ask')}>Be the first to speak <Arrow /></Button>} />
        )}
        <p className="mt-6 max-w-2xl text-xs text-mute">Only submissions approved by the campaign appear here. A status of “Resolved” is used only where there is evidence the matter was resolved.</p>
      </Section>

      <Section id="status" className="border-t border-line !py-16 md:!py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <StatusLookup />
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-line p-6 md:p-8">
            <div><Logo className="w-28" /><p className="label mt-6 text-blue-hi">Where it goes</p><p className="display mt-3 text-2xl md:text-3xl">Aggregated into Faculty Pulse.</p><p className="mt-3 text-mute">Reviewed submissions feed anonymised topic totals on Faculty Pulse. Individual messages are never shown there.</p></div>
            <Link to="/faculty-pulse" className="label ulink inline-flex gap-2 self-start text-white">Open Faculty Pulse <Arrow /></Link>
          </div>
        </div>
      </Section>

      <CTASection title="Then let’s get to work." text="Read what we’re proposing, or help us deliver it." actions={[{ label: 'Faculty Pulse', to: '/faculty-pulse' }, { label: 'Read the manifesto', to: '/manifesto', ghost: true }, { label: 'Join the movement', to: '/join', ghost: true }]} />
    </>
  );
}
