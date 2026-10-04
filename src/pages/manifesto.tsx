import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { manifesto, manifestoPdf, manifestoTagline, resolveManifesto } from '../data/campaign';
import { CTASection, ShareButtons } from '../components/kit';
import { ManifestoChapter, ManifestoFeedback, ManifestoJumpNav, ManifestoModeSwitch, ReadingProgress, chapters, readTimes, useActiveCommitment, useReadingProgress, type Mode } from '../components/manifesto';
import { QuestionsSection } from './content';
import { useMeta } from '../brand';
import { shareImages } from '../assets';
import { Arrow, Button, MaskText, Reveal } from '../ui';

const ghost = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/60';

export function Manifesto() {
  useMeta({ title: 'The Juris Manifesto', description: `${manifestoTagline}. What we believe, what we intend to change and how we intend to pursue it: ${manifesto.length} commitments for the Faculty of Law.`, image: shareImages.team });
  const [params, setParams] = useSearchParams();
  const mode: Mode = params.get('mode') === 'quick' ? 'quick' : 'full';
  const rawItem = params.get('item');
  const resolved = resolveManifesto(rawItem);
  const item = resolved?.id ?? null;
  const chapter = chapters.find((c) => c.slug === params.get('chapter'))?.id ?? null;
  const body = useRef<HTMLDivElement>(null);
  const pct = useReadingProgress(body);
  const active = useActiveCommitment(mode);
  const setMode = (m: Mode) => { const p = new URLSearchParams(params); p.delete('item'); p.delete('chapter'); if (m === 'quick') p.set('mode', 'quick'); else p.delete('mode'); setParams(p, { replace: true, preventScrollReset: true }); };

  // Old ids / aliases resolve to the stable slug without a dead link.
  useEffect(() => {
    if (rawItem && resolved && rawItem !== resolved.id) { const p = new URLSearchParams(params); p.set('item', resolved.id); setParams(p, { replace: true, preventScrollReset: true }); }
  }, [rawItem, resolved, params, setParams]);

  useEffect(() => {
    const target = item ? `c-${item}` : chapter;
    if (!target) return;
    const t = setTimeout(() => {
      const el = document.getElementById(target);
      if (!el) return;
      el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      (el.querySelector(item ? 'h3' : 'h2') as HTMLElement | null)?.focus({ preventScroll: true });
    }, 200);
    return () => clearTimeout(t);
  }, [item, chapter, mode]);

  return (
    <>
      <ReadingProgress pct={pct} />
      <header className="relative overflow-hidden px-5 pb-12 pt-32 md:px-10 md:pb-20 md:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute -right-1/4 -top-1/4 h-[55vw] w-[55vw] rounded-full bg-blue/[0.12] blur-[140px]" />
        <div className="relative mx-auto max-w-[1280px]">
          <p className="label text-blue-hi">{manifestoTagline} · {manifesto.length} commitments · {chapters.length} chapters</p>
          <h1 className="display mt-5 text-[clamp(2.8rem,10vw,9rem)]"><MaskText text="The Juris" /><br /><MaskText text="Manifesto" /></h1>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight md:text-4xl">What we believe.<br />What we intend to change.<br /><span className="text-blue-hi">How we intend to pursue it.</span></p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#read">Read the Manifesto Online <Arrow /></Button>
              <a href={manifestoPdf.href} download={manifestoPdf.filename} className={ghost}>Download Full Manifesto PDF <span aria-hidden="true">↓</span></a>
            </div>
            <p className="label mt-5 text-mute">Quick Read ~{readTimes.quick} min · Full ~{readTimes.full} min · <Link to="/manifesto/publication" className="ulink text-white">Designed print edition</Link></p>
          </Reveal>
        </div>
      </header>
      <section id="read" className="scroll-mt-16 px-5 pb-24 md:px-10">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,1fr)] gap-x-12 lg:grid-cols-[15rem_1fr]">
          <ManifestoJumpNav active={active} pct={pct} mode={mode} onMode={setMode} />
          <div ref={body} className="min-w-0 space-y-14 pt-8 md:space-y-24 lg:pt-0">
            <ManifestoModeSwitch mode={mode} onChange={setMode} className="lg:max-w-xl" />
            {mode === 'quick' && <p className="text-mute">Quick Read keeps the campaign’s own words and trims only where meaning is unchanged. <button className="ulink text-white" onClick={() => setMode('full')}>Switch to the full manifesto</button></p>}
            {chapters.map((c) => <ManifestoChapter key={c.id} c={c} mode={mode} activeItem={item} />)}
            <div className="flex flex-col gap-4 rounded-3xl border border-line p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div><p className="label text-blue-hi">Share the whole manifesto</p><p className="mt-2 text-mute">Send it to a classmate. It opens at the top, in Quick Read or Full.</p></div>
              <ShareButtons title="The Juris Manifesto" path={mode === 'quick' ? '/manifesto?mode=quick' : '/manifesto'} />
            </div>
            <ManifestoFeedback />
          </div>
        </div>
      </section>
      <QuestionsSection />
      <CTASection title="See it in the Faculty." text="Commitments mean little without proof. Follow how they show up." actions={[{ label: 'Explore Community', to: '/community' }, { label: 'Meet the candidates', to: '/candidates', ghost: true }]} />
    </>
  );
}
