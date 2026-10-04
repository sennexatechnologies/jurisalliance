import { useEffect } from 'react';
import { logoSet, photoSets, shareImages } from './assets';

export function Photo({ id, alt, eager = false, sizes = '(min-width: 1024px) 40vw, 90vw', className = '', focus = '50% 20%' }: { id: string; alt: string; eager?: boolean; sizes?: string; className?: string; focus?: string }) {
  const s = photoSets[id];
  if (!s) return null;
  return (
    <img
      src={s[800]}
      srcSet={`${s[480]} 480w, ${s[800]} 800w, ${s[1024]} 1024w`}
      sizes={sizes}
      width={1024}
      height={1280}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      className={className}
      style={{ objectPosition: focus }}
    />
  );
}

const logoAlt = 'Juris Leadership Alliance (JLA) official logo';

// The supplied artwork sits on white, so it is always shown on a deliberate white brand panel.
export function Logo({ className = 'w-40', eager = false }: { className?: string; eager?: boolean }) {
  return (
    <span className={`inline-block aspect-square overflow-hidden rounded-2xl bg-white ${className}`}>
      <img
        src={logoSet[512]}
        srcSet={`${logoSet[256]} 256w, ${logoSet[512]} 512w, ${logoSet[1024]} 1024w`}
        sizes="(min-width: 768px) 240px, 160px"
        width={1024}
        height={1024}
        alt={logoAlt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </span>
  );
}

// Compact mark: an unaltered crop of the same artwork (scales + JL), framed as a circle.
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-white ${className}`} role="img" aria-label={logoAlt}>
      <img src={logoSet[256]} alt="" width={256} height={256} decoding="async" className="absolute max-w-none" style={{ width: '170%', left: '-35%', top: '-25%' }} />
    </span>
  );
}

function setMeta(sel: string, attr: string, key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

const SITE = 'Juris Leadership Alliance';

// Updates title + share tags for the current page. Crawlers that don't run JS (WhatsApp, X) will only see the defaults in index.html.
export function useMeta({ title, description, image }: { title: string; description?: string; image?: string }) {
  useEffect(() => {
    const prev = document.title;
    const full = `${title} · ${SITE}`;
    document.title = full;
    const abs = (p: string) => (p.startsWith('http') ? p : `${location.origin}${p}`);
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    setMeta('meta[property="og:url"]', 'property', 'og:url', location.href);
    setMeta('meta[property="og:image"]', 'property', 'og:image', abs(image ?? shareImages.team));
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
    return () => { document.title = prev; };
  }, [title, description, image]);
}
