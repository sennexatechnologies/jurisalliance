import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { Link } from 'react-router';

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: any }) {
  const [ref, seen] = useInView<HTMLElement>(0.15);
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function MaskText({ text, className = '', as: Tag = 'span' }: { text: string; className?: string; as?: any }) {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`${seen ? 'in' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="mask">
            <span style={{ transitionDelay: `${i * 55}ms` }}>{w}</span>
          </span>{' '}
        </span>
      ))}
    </Tag>
  );
}

export function useCountUp(target: number, run: boolean, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height)));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return [ref, p] as const;
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  external?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
};
export function Button({ children, href, onClick, variant = 'primary', external, type = 'button', disabled, className = '' }: BtnProps) {
  const ref = useRef<any>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = '');
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[13px] font-semibold uppercase tracking-[0.08em] transition-[transform,background-color,border-color] duration-300 disabled:opacity-40 ${
    variant === 'primary' ? 'bg-blue text-white hover:bg-blue-hi' : 'border border-white/20 text-white hover:border-white/60'
  } ${className}`;
  const props = { ref, className: cls, onPointerMove: move, onPointerLeave: leave };
  if (href && href.startsWith('/')) {
    return (
      <Link {...props} to={href}>
        {children}
      </Link>
    );
  }
  return href ? (
    <a {...props} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  ) : (
    <button {...props} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function SectionHead({ eyebrow, title, sub, id }: { eyebrow: string; title: ReactNode; sub?: string; id?: string }) {
  return (
    <div className="mb-12 md:mb-20">
      <Reveal>
        <p className="label text-blue-hi">{eyebrow}</p>
      </Reveal>
      <h2 id={id} className="display mt-5 text-[clamp(2.4rem,7.5vw,6.5rem)]">
        {typeof title === 'string' ? <MaskText text={title} /> : title}
      </h2>
      {sub && (
        <Reveal delay={150}>
          <p className="mt-6 max-w-xl text-lg text-mute">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

export const Section = ({ id, children, className = '', style }: { id: string; children: ReactNode; className?: string; style?: CSSProperties }) => (
  <section id={id} style={style} className={`relative px-5 py-24 md:px-10 md:py-40 ${className}`}>
    <div className="mx-auto max-w-[1280px]">{children}</div>
  </section>
);

export const Arrow = () => <span aria-hidden="true">→</span>;
