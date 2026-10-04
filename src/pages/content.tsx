import { pillars, questions } from '../data/campaign';
import { CTASection, FAQAccordion, PageHeader, VisionPillar } from '../components/kit';
import { Arrow, Button, MaskText, Section } from '../ui';

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
