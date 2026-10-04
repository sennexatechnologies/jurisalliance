import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { communityCategories, fmtDate } from '../data/campaign';
import { Breadcrumb, CTASection, ErrorState, LoadingState, ShareButtons } from '../components/kit';
import { CommunityCard, CommunityEmpty, CommunityFeature, CommunityFilter, CommunityGallery, CommunityGrid, CommunityHighlight, CommunityImg, CommunityTimeline, RelatedManifesto, ViewToggle, useCommunity } from '../components/community';
import { useMeta } from '../brand';
import { shareImages } from '../assets';
import { Arrow, Button, MaskText, Reveal } from '../ui';

export function Community() {
  useMeta({ title: 'Juris in the Community', description: 'How the campaign shows up, listens and engages: outreach, meetings, competitions and moments.', image: shareImages.team });
  const [params, setParams] = useSearchParams();
  const { stories, error, retry } = useCommunity();
  const raw = params.get('category') ?? 'All';
  const cat = (communityCategories as readonly string[]).includes(raw) ? raw : 'All';
  const view = params.get('view') === 'timeline' ? 'timeline' : 'grid';
  const patch = (k: string, v: string | null) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true, preventScrollReset: true }); };
  const list = useMemo(() => (stories ?? []).filter((s) => cat === 'All' || s.category === cat), [stories, cat]);
  const feat = list.find((s) => s.featured) ?? list[0];
  const rest = list.filter((s) => s !== feat);
  // Hero anchor: first landscape photo whose usage is not pending.
  const hero = (stories ?? []).find((s) => s.image && (s.image.width ?? 0) > (s.image.height ?? 0) * 1.3 && s.image.consent !== 'pending')?.image;
  return (
    <>
      <header className="relative overflow-hidden px-5 pb-14 pt-32 md:px-10 md:pb-20 md:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute -right-1/4 top-0 h-[50vw] w-[50vw] rounded-full bg-blue/[0.12] blur-[120px]" />
        <div className="relative mx-auto grid max-w-[1280px] items-end gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <p className="label text-blue-hi">Juris in the community</p>
            <h1 className="display mt-5 text-[clamp(2.6rem,8.5vw,7.5rem)]"><MaskText text="Leadership isn’t just" /><br /><MaskText text="what we promise." /></h1>
            <Reveal delay={200}>
              <p className="mt-6 max-w-md font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">It’s where we <span className="text-blue-hi">show up.</span></p>
              <Button href="#stories" className="mt-10">Explore the stories <Arrow /></Button>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-s1 lg:aspect-[5/4]">
              {hero ? <CommunityImg img={hero} eager sizes="(min-width: 1024px) 42vw, 100vw" /> : <div className="h-full" aria-hidden="true" />}
            </div>
          </Reveal>
        </div>
      </header>
      <section id="stories" className="scroll-mt-16 px-5 pb-24 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="sticky top-16 z-20 -mx-5 flex items-center gap-4 border-y border-line bg-ink/90 px-5 py-2 backdrop-blur-xl md:-mx-10 md:px-10">
            <div className="min-w-0 flex-1"><CommunityFilter value={cat} options={communityCategories} onChange={(v) => patch('category', v === 'All' ? null : v)} /></div>
            {stories && stories.length > 0 && <ViewToggle value={view} onChange={(v) => patch('view', v === 'timeline' ? 'timeline' : null)} />}
          </div>
          <div className="mt-8">
            {error ? <ErrorState onRetry={retry} /> : !stories ? <LoadingState rows={3} /> : !stories.length ? <CommunityEmpty /> : !list.length ? (
              <CommunityEmpty compact />
            ) : view === 'timeline' ? (
              <>
                <p className="label mb-8 text-mute" aria-live="polite">{list.length} {list.length === 1 ? 'story' : 'stories'}{cat !== 'All' ? ` in ${cat}` : ''}</p>
                <CommunityTimeline stories={list} />
              </>
            ) : (
              <>
                <p className="label mb-6 text-mute" aria-live="polite">{list.length} {list.length === 1 ? 'story' : 'stories'}{cat !== 'All' ? ` in ${cat}` : ''}</p>
                {feat && <CommunityFeature s={feat} />}
                <CommunityHighlight stories={list} />
                {rest.length > 0 && <div className="mt-3"><CommunityGrid stories={rest} /></div>}
              </>
            )}
          </div>
        </div>
      </section>
      <CTASection title="Seen something we should hear about?" text="Suggest a story, a moment or a place we should be. Nothing is published until it’s confirmed." actions={[{ label: 'Suggest a story', to: '/counsels-room?mode=suggest' }, { label: 'Read the manifesto', to: '/manifesto', ghost: true }]} />
    </>
  );
}

export function CommunityStoryPage() {
  const { slug } = useParams();
  const { stories, error, retry } = useCommunity();
  const idx = stories?.findIndex((x) => x.slug === slug) ?? -1;
  const s = stories && idx >= 0 ? stories[idx] : undefined;
  useMeta({ title: s?.title ?? 'Community story', description: s?.summary, image: s?.image?.src ?? shareImages.team });
  const related = (stories ?? []).filter((x) => s && x.id !== s.id && x.layout !== 'photo-story' && (x.category === s.category || (s.manifesto && x.manifesto === s.manifesto))).slice(0, 3);
  const more = related.length ? related : (stories ?? []).filter((x) => s && x.id !== s.id && x.layout !== 'photo-story').slice(0, 3);
  const prev = stories && s ? stories[(idx - 1 + stories.length) % stories.length] : undefined;
  const next = stories && s ? stories[(idx + 1) % stories.length] : undefined;
  const story = s?.layout === 'photo-story';
  const facts: [string, string][] = s ? ([['Category', s.category], ['Date', s.date ? fmtDate(s.date) : ''], ['Location', s.location ?? ''], ['Photography', s.image?.credit ?? '']] as [string, string][]).filter(([, v]) => v) : [];
  return (
    <article className="px-5 pb-24 pt-28 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1100px]">
        <Breadcrumb items={[{ label: 'Community', to: '/community' }, { label: s?.title ?? 'Story' }]} />
        {error ? <ErrorState onRetry={retry} /> : !stories ? <LoadingState rows={1} className="" /> : !s ? (
          <ErrorState title="Story not found." text="It may have been archived or the link is out of date." onRetry={undefined} />
        ) : (
          <>
            <p className="label text-blue-hi">{s.category}</p>
            <h1 className="display mt-4 text-[clamp(2.4rem,7vw,6rem)]">{s.title}</h1>
            <p className="mt-6 max-w-2xl font-display text-xl font-medium leading-snug tracking-tight text-white/85 md:text-3xl">{s.summary}</p>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-5">
              {facts.map(([k, v]) => <div key={k}><dt className="label text-mute">{k}</dt><dd className="mt-1">{v}</dd></div>)}
              {(!s.date || !s.location) && <div><dt className="label text-mute">Details</dt><dd className="mt-1 text-mute">{[!s.date && 'date', !s.location && 'location'].filter(Boolean).join(' and ')} to be confirmed</dd></div>}
            </dl>
            {s.image && !story && (
              <figure className="mt-10">
                <div className={`overflow-hidden rounded-3xl bg-s2 ${(s.image.height ?? 0) > (s.image.width ?? 0) ? 'mx-auto aspect-[4/5] max-w-xl' : 'aspect-[16/9]'}`}><CommunityImg img={s.image} eager sizes="(min-width: 1100px) 1100px, 100vw" /></div>
                {(s.image.caption || s.image.credit) && <figcaption className="mt-3 text-sm text-mute">{s.image.caption}{s.image.credit && <span> Photo: {s.image.credit}</span>}</figcaption>}
              </figure>
            )}
            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-16">
              <div className="max-w-[65ch] space-y-6 text-[1.1875rem] leading-[1.75] text-white/85">
                {s.body.map((p, i) => <p key={i} className={i === 0 ? 'text-xl text-white md:text-2xl md:leading-relaxed' : ''}>{p}</p>)}
                {s.usageNote && <p className="rounded-xl border border-line p-4 text-sm text-mute">{s.usageNote}</p>}
              </div>
              <aside className="lg:sticky lg:top-24 lg:h-fit"><p className="label mb-3 text-mute">Share this story</p><ShareButtons title={s.title} path={`/community/${s.slug}`} /></aside>
            </div>
            {s.gallery.length > 0 && <div className="mt-14"><h2 className="label mb-5 text-mute">{story ? 'The photographs' : 'Gallery'} · {s.gallery.length}</h2><CommunityGallery items={s.gallery} variant={story ? 'story' : 'grid'} /></div>}
            <div className="mt-16 space-y-6">
              <RelatedManifesto id={s.manifesto} />
              <div className="flex flex-col gap-4 rounded-2xl border border-line bg-s1 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                <div><p className="label text-blue-hi">Counsel’s Room</p><p className="mt-2 text-lg text-white/80">Know a story we should tell, or a detail we should correct?</p></div>
                <div className="flex flex-col gap-3 sm:flex-row"><Button href="/counsels-room?mode=suggest" variant="ghost">Suggest a story <Arrow /></Button></div>
              </div>
            </div>
            {more.length > 0 && (
              <section className="mt-20 border-t border-line pt-10" aria-labelledby="rel">
                <h2 id="rel" className="display text-3xl md:text-5xl">More stories</h2>
                <div className="mt-8 grid gap-3 md:grid-cols-3">{more.map((r, i) => <CommunityCard key={r.id} s={r} i={i} />)}</div>
              </section>
            )}
            <nav aria-label="Story navigation" className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <Link to="/community" className="label ulink">← All stories</Link>
              {prev && next && stories!.length > 1 && (
                <span className="flex gap-6"><Link to={`/community/${prev.slug}`} className="label ulink inline-flex min-h-11 items-center">← {prev.title}</Link><Link to={`/community/${next.slug}`} className="label ulink inline-flex min-h-11 items-center">{next.title} →</Link></span>
              )}
            </nav>
          </>
        )}
      </div>
    </article>
  );
}
