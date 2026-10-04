import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { campaign, waLink } from '../data/campaign';
import { Logo, LogoMark } from '../brand';
import { Arrow } from '../ui';
import { HaveYourSay, SearchOverlay } from './overlays';

const links: [string, string][] = [
  ['Home', '/'],
  ['Candidates', '/candidates'],
  ['Vision', '/vision'],
  ['Manifesto', '/manifesto'],
  ['Community', '/community'],
  ['Faculty Pulse', '/faculty-pulse'],
  ["Counsel’s Room", '/counsels-room'],
  ['Join', '/join'],
  ['Events', '/events'],
  ['Newsroom', '/newsroom'],
];

function Nav({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);
  const cls = ({ isActive }: { isActive: boolean }) => `ulink label transition-colors hover:text-white ${isActive ? 'text-white' : 'text-mute'}`;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${solid || open ? 'border-b border-line bg-ink/80 backdrop-blur-xl' : ''}`}>
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 md:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Campaign home">
          <LogoMark className="h-9 w-9" />
          <span className="label hidden text-white sm:inline xl:hidden 2xl:inline">{campaign.faculty}</span>
        </Link>
        <ul className="hidden items-center gap-4 xl:flex 2xl:gap-5">
          {links.map(([l, h]) => <li key={h}><NavLink to={h} end={h === '/'} className={cls}>{l}</NavLink></li>)}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={onSearch} aria-label="Search" className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
          <Link to="/join" className="hidden min-h-10 items-center rounded-full bg-white px-5 2xl:inline-flex text-[12px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-blue-hi ">Join the movement</Link>
          <button className="grid h-11 w-11 place-items-center xl:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-white transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-white transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </nav>
      {open && (
        <div className="h-[calc(100dvh-4rem)] overflow-y-auto bg-ink px-5 pb-28 pt-4 xl:hidden">
          <ul>
            {links.map(([l, h]) => (
              <li key={h} className="border-b border-line">
                <NavLink to={h} end={h === '/'} className={({ isActive }) => `display flex min-h-14 items-center justify-between text-2xl ${isActive ? 'text-blue-hi' : ''}`}>{l} <Arrow /></NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const col = (h: string, items: [string, string][]) => (
    <nav aria-label={h}><p className="label text-mute">{h}</p><ul className="mt-4 space-y-2 text-sm">{items.map(([l, to]) => <li key={to}><Link className="ulink" to={to}>{l}</Link></li>)}</ul></nav>
  );
  return (
    <footer className="border-t border-line px-5 pb-32 pt-14 md:px-10">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo className="w-32" />
          <p className="label mt-5">{campaign.alliance} · {campaign.faculty}</p>
          <p className="mt-3 max-w-xs text-sm text-mute">Independent student campaign website.</p>
        </div>
        {col('Campaign', [['Candidates', '/candidates'], ['Vision', '/vision'], ['Manifesto', '/manifesto'], ['Community', '/community']])}
        {col('Engage', [['Counsel’s Room', '/counsels-room'], ['Faculty Pulse', '/faculty-pulse'], ['Join', '/join'], ['Events', '/events'], ['Newsroom', '/newsroom']])}
        <div><p className="label text-mute">Follow</p><ul className="mt-4 space-y-2 text-sm">{campaign.socials.map((s) => <li key={s.label}><a className="ulink" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul></div>
        <div><p className="label text-mute">Contact</p><ul className="mt-4 space-y-2 text-sm"><li><a className="ulink" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li><a className="ulink" href={`mailto:${campaign.email}`}>Email</a></li></ul></div>
      </div>
      <div className="mx-auto mt-12 max-w-[1280px] space-y-2 text-xs text-mute">
        <p>Campaign content on this site is written by the campaign. Student feedback and Faculty Pulse are unofficial. This site is not an official source of election information.</p>
        <p>© {new Date().getFullYear()} Faculty of Law leadership campaign. Not affiliated with or endorsed by CUEA or its Electoral Commission.</p>
      </div>
    </footer>
  );
}

export function Root() {
  const { pathname, hash } = useLocation();
  const [search, setSearch] = useState(false);
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 120);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
      <Nav onSearch={() => setSearch(true)} />
      <main id="main" key={pathname} className="page"><Outlet /></main>
      <Footer />
      <HaveYourSay />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
