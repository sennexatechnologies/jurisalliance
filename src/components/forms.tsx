import { useState, type ReactNode } from 'react';
import { askCategories, categories, submitToBackend, waLink, type SubmissionKind } from '../data/campaign';
import { Arrow, Button } from '../ui';

const field = 'mt-2 w-full rounded-xl border border-line bg-s1 px-4 py-3.5 text-base text-white placeholder:text-white/35 focus:border-blue focus:outline-none aria-[invalid=true]:border-red-400';

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label text-mute">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-mute">{hint}</span>}
      {error && <span role="alert" className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function Chips({ legend, options, value, onChange, multi }: { legend: string; options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  const toggle = (o: string) => onChange(multi ? (value.includes(o) ? value.filter((x) => x !== o) : [...value, o]) : [o]);
  return (
    <fieldset>
      <legend className="label text-mute">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((c) => (
          <label key={c} className={`label cursor-pointer rounded-full border px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-hi ${value.includes(c) ? 'border-blue bg-blue text-white' : 'border-line text-white/70 hover:border-white/40'}`}>
            <input type={multi ? 'checkbox' : 'radio'} name={legend} className="sr-only" checked={value.includes(c)} onChange={() => toggle(c)} />{c}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Confirmation({ delivered, waMessage, title = 'Thank you.', onReset }: { delivered: boolean; waMessage: string; title?: string; onReset: () => void }) {
  return (
    <div role="status" className="rounded-3xl border border-blue/50 bg-s1 p-8 md:p-10">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-blue text-xl" aria-hidden="true">✓</span>
      <h3 className="display mt-6 text-3xl">{title}</h3>
      {delivered ? (
        <p className="mt-3 text-mute">Received. The campaign will review it.</p>
      ) : (
        <>
          <p className="mt-3 text-mute">This form isn’t connected to the campaign inbox yet, so nothing has been sent. To make sure it reaches us, send it on WhatsApp.</p>
          <div className="mt-6"><Button href={waLink(waMessage)} external>Send on WhatsApp <Arrow /></Button></div>
        </>
      )}
      <button className="label ulink mt-8 text-mute" onClick={onReset}>Send another</button>
    </div>
  );
}

const Privacy = () => (
  <p className="text-xs text-mute">Name and contact are optional. Messages are read by the campaign team and are not guaranteed to be anonymous, so don’t include anything you wouldn’t want us to read.</p>
);

function useSubmit(kind: SubmissionKind) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [delivered, setDelivered] = useState(false);
  const send = async (payload: Record<string, unknown>) => {
    setState('sending');
    setDelivered((await submitToBackend(kind, payload)).delivered);
    setState('done');
  };
  return { state, delivered, send, reset: () => setState('idle') };
}

export type FeedbackVariant = 'voice' | 'ask' | 'straight' | 'panel';
const voiceTypes = ['Question', 'Concern', 'Idea', 'Suggestion', 'Issue'];

export function FeedbackForm({ variant, panelType }: { variant: FeedbackVariant; panelType?: string }) {
  const { state, delivered, send, reset } = useSubmit(variant);
  const [type, setType] = useState([voiceTypes[1]]);
  const [cat, setCat] = useState([variant === 'ask' ? askCategories[1] : categories[0]]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [msg, setMsg] = useState('');
  const [s, setS] = useState({ working: '', notWorking: '', change: '', priority: '' });
  const [err, setErr] = useState('');

  const straightAny = Object.values(s).some((v) => v.trim());
  const reset2 = () => { reset(); setMsg(''); setS({ working: '', notWorking: '', change: '', priority: '' }); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (variant === 'straight' ? !straightAny : msg.trim().length < 5) return setErr(variant === 'straight' ? 'Answer at least one prompt.' : 'Please write a few words.');
    setErr('');
    send({ type: panelType ?? type[0], category: cat[0], name, contact, message: variant === 'straight' ? s : msg });
  };

  const wa = variant === 'straight'
    ? `Say it straight — working: ${s.working} | not working: ${s.notWorking} | change: ${s.change} | prioritise: ${s.priority}`
    : `${panelType ?? (variant === 'ask' ? 'Question' : type[0])} (${cat[0]}): ${msg}`;

  if (state === 'done') return <Confirmation delivered={delivered} waMessage={wa} onReset={reset2} title={variant === 'ask' ? 'Question received.' : 'Thank you.'} />;

  const streetPrompts: [keyof typeof s, string][] = [['working', 'What is working?'], ['notWorking', 'What isn’t?'], ['change', 'What should change?'], ['priority', 'What should leadership prioritise?']];
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {variant === 'voice' && <Chips legend="What is it?" options={voiceTypes} value={type} onChange={setType} />}
      {variant !== 'straight' && <Chips legend="Category" options={variant === 'ask' ? askCategories : categories} value={cat} onChange={setCat} />}
      {variant === 'straight' ? (
        streetPrompts.map(([k, l]) => (
          <Field key={k} label={l}><textarea rows={3} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} className={field} /></Field>
        ))
      ) : (
        <Field label={variant === 'ask' ? 'What would you like to know?' : 'Message'} error={err}>
          <textarea rows={variant === 'panel' ? 4 : 5} required aria-invalid={!!err} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={variant === 'ask' ? 'What would you like to know?' : 'Tell us what’s on your mind'} className={field} />
        </Field>
      )}
      {variant === 'straight' && err && <p role="alert" className="text-xs text-red-400">{err}</p>}
      {variant !== 'ask' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name (optional)"><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} /></Field>
          <Field label="Contact (optional)" hint="Only if you want a reply"><input value={contact} onChange={(e) => setContact(e.target.value)} className={field} /></Field>
        </div>
      )}
      <Privacy />
      <Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : variant === 'ask' ? 'Submit question' : variant === 'straight' ? 'Say it straight' : 'Send your thought'} <Arrow /></Button>
    </form>
  );
}

export const volunteerAreas = ['Communication', 'Digital', 'Research', 'Outreach', 'Events', 'Creative', 'Policy', 'General support'];

export function VolunteerForm({ preselect }: { preselect?: string }) {
  const { state, delivered, send, reset } = useSubmit('volunteer');
  const [f, setF] = useState({ name: '', year: '', availability: 'Flexible', method: 'WhatsApp', contact: '' });
  const [areas, setAreas] = useState<string[]>(preselect ? [preselect] : []);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!f.name.trim()) x.name = 'Enter your name.';
    if (!f.year.trim()) x.year = 'Enter your year or class.';
    if (!areas.length) x.areas = 'Pick at least one area.';
    if (f.method === 'Email' ? !/^\S+@\S+\.\S+$/.test(f.contact) : f.contact.replace(/\D/g, '').length < 9) x.contact = f.method === 'Email' ? 'Enter a valid email.' : 'Enter a valid phone number.';
    setErrs(x);
    if (Object.keys(x).length) return;
    send({ ...f, areas });
  };
  if (state === 'done') return <Confirmation title="You’re on the list." delivered={delivered} onReset={reset} waMessage={`Hello, I’d like to volunteer. Name: ${f.name}, ${f.year}. Areas: ${areas.join(', ')}. Availability: ${f.availability}.`} />;
  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errs.name}><input aria-invalid={!!errs.name} value={f.name} onChange={set('name')} autoComplete="name" className={field} /></Field>
        <Field label="Year / class" error={errs.year}><input aria-invalid={!!errs.year} value={f.year} onChange={set('year')} placeholder="e.g. Year 2" className={field} /></Field>
      </div>
      <div>
        <Chips multi legend="Area of interest" options={volunteerAreas} value={areas} onChange={setAreas} />
        {errs.areas && <p role="alert" className="mt-2 text-xs text-red-400">{errs.areas}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Availability">
          <select value={f.availability} onChange={set('availability')} className={field}>{['Weekdays', 'Evenings', 'Weekends', 'Flexible'].map((o) => <option key={o}>{o}</option>)}</select>
        </Field>
        <Field label="Preferred contact method">
          <select value={f.method} onChange={set('method')} className={field}>{['WhatsApp', 'Phone call', 'Email'].map((o) => <option key={o}>{o}</option>)}</select>
        </Field>
      </div>
      <Field label={f.method === 'Email' ? 'Email address' : 'Phone number'} error={errs.contact}><input aria-invalid={!!errs.contact} value={f.contact} onChange={set('contact')} inputMode={f.method === 'Email' ? 'email' : 'tel'} className={field} /></Field>
      <p className="text-xs text-mute">Details are sent only to the campaign team and are not stored on this page.</p>
      <Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Join the team'} <Arrow /></Button>
    </form>
  );
}

export function IssueForm() {
  const { state, delivered, send, reset } = useSubmit('issue');
  const [cat, setCat] = useState([categories[0]]);
  const [issue, setIssue] = useState('');
  const [msg, setMsg] = useState('');
  if (state === 'done') return <Confirmation delivered={delivered} waMessage={`Issue (${cat[0]}): ${issue}${msg ? `\n${msg}` : ''}`} onReset={() => { reset(); setIssue(''); setMsg(''); }} />;
  return (
    <form onSubmit={(e) => { e.preventDefault(); send({ category: cat[0], issue, message: msg }); }} className="space-y-6">
      <Chips legend="Category" options={categories} value={cat} onChange={setCat} />
      <Field label="The issue"><input required maxLength={140} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Timetable changes reach students too late" className={field} /></Field>
      <Field label="Message (optional)"><textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} className={field} /></Field>
      <Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit issue'} <Arrow /></Button>
    </form>
  );
}
