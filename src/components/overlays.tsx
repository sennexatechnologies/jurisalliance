import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { buildIndex } from '../data/campaign';
import { FeedbackForm } from './forms';

export const openSay = () => window.dispatchEvent(new Event('open-say'));

function useModal(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); };
  }, [open, onClose]);
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const index = useMemo(buildIndex, []);
  useModal(open, onClose);
  useEffect(() => { if (open) { setQ(''); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return index
      .map((h) => ({ h, s: (h.title.toLowerCase().includes(t) ? 3 : 0) + (h.text.toLowerCase().includes(t) ? 1 : 0) }))
      .filter((x) => x.s).sort((a, b) => b.s - a.s).slice(0, 12).map((x) => x.h);
  }, [q, index]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-ink/95 px-5 pt-20 backdrop-blur-xl md:px-10" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Search" className="mx-auto max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 border-b border-white/20 pb-4">
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search candidates, manifesto, news…" aria-label="Search the site"
            onKeyDown={(e) => { if (e.key === 'Enter' && hits[0]) { nav(hits[0].to); onClose(); } }}
            className="display w-full bg-transparent text-3xl outline-none placeholder:text-white/25 md:text-5xl" />
          <button onClick={onClose} aria-label="Close search" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-xl">×</button>
        </div>
        <ul className="mt-6 max-h-[65dvh] overflow-y-auto">
          {hits.map((h, i) => (
            <li key={i} className="border-b border-line">
              <Link to={h.to} onClick={onClose} className="group flex min-h-16 items-center justify-between gap-4 py-4">
                <span><span className="label text-blue-hi">{h.type}</span><span className="mt-1 block font-display text-xl font-semibold tracking-tight">{h.title}</span></span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
          {q.trim().length >= 2 && !hits.length && <li className="py-8 text-mute">No results for “{q}”. Try “academic”, “welfare” or “vision”, or <Link className="ulink text-white" to="/counsels-room?mode=ask" onClick={onClose}>ask the campaign</Link>.</li>}
          {q.trim().length < 2 && <li className="py-8 text-mute">Type at least two letters. Try “academic”.</li>}
        </ul>
      </div>
    </div>
  );
}

const tabs = [
  { id: 'Question', label: 'Ask a question' },
  { id: 'Idea', label: 'Share an idea' },
  { id: 'Issue', label: 'Report an issue' },
  { id: 'Feedback', label: 'Give feedback' },
];

export function HaveYourSay() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(tabs[0].id);
  const close = () => setOpen(false);
  useModal(open, close);
  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener('open-say', on);
    return () => window.removeEventListener('open-say', on);
  }, []);
  return (
    <>
      <button onClick={() => setOpen(true)} aria-haspopup="dialog"
        className="fixed inset-x-4 bottom-4 z-30 flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-deep px-6 text-[13px] font-semibold uppercase tracking-[0.08em] shadow-[0_10px_40px_-10px_rgba(59,123,255,0.7)] transition-colors hover:bg-blue-press sm:inset-x-auto sm:bottom-6 sm:right-6">
        Have your say <span aria-hidden="true">→</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={close}>
          <div role="dialog" aria-modal="true" aria-labelledby="say-title" onClick={(e) => e.stopPropagation()} className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-line bg-s1 p-6 sm:rounded-3xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label text-blue-hi">Student voice</p>
                <h2 id="say-title" className="display mt-2 text-3xl">Have your say</h2>
              </div>
              <button onClick={close} aria-label="Close" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-xl">×</button>
            </div>
            <div role="tablist" className="mt-6 grid grid-cols-2 gap-2">
              {tabs.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`label min-h-11 rounded-full border px-3 transition-colors ${tab === t.id ? 'border-blue bg-blue-deep' : 'border-line text-white/70 hover:border-white/40'}`}>{t.label}</button>
              ))}
            </div>
            <div className="mt-6" key={tab}><FeedbackForm variant="panel" panelType={tab} /></div>
          </div>
        </div>
      )}
    </>
  );
}
