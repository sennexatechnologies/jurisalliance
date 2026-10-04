import { useEffect } from 'react';
import { Link } from 'react-router';
import { manifesto, manifestoPdf, manifestoTagline, splitLead } from '../data/campaign';
import { chapters } from '../components/manifesto';
import { useMeta } from '../brand';
import { logoSet } from '../assets';

// Designed print edition. Use the browser's Print > Save as PDF (A4). Page numbers and running footers come from @page in index.css.
export function Publication() {
  useMeta({ title: 'The Juris Manifesto: print edition', description: 'A designed, print-ready edition of the Juris Manifesto.' });
  useEffect(() => { document.documentElement.classList.add('pub'); return () => document.documentElement.classList.remove('pub'); }, []);
  return (
    <div className="pub-wrap bg-[#1a1d23] px-4 pb-16 pt-24 print:bg-white print:p-0">
      <div className="pub-toolbar mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <p className="label text-blue-hi">Print edition</p>
          <p className="mt-1 text-sm text-white/75">Choose Print, then Save as PDF. Paper size A4, margins Default, Background graphics on.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="label min-h-11 rounded-full bg-blue-deep px-5 text-white hover:bg-blue-press">Print / Save as PDF</button>
          <a href={manifestoPdf.href} download={manifestoPdf.filename} className="label inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-white hover:border-white">Official original PDF</a>
          <Link to="/manifesto" className="label inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-white hover:border-white">Read online</Link>
        </div>
      </div>

      <article className="pub-doc mx-auto max-w-[210mm] text-[#0b0d10]">
        {/* Cover */}
        <section className="pub-page pub-cover relative flex min-h-[297mm] flex-col justify-between overflow-hidden bg-[#050608] p-[18mm] text-white">
          <div aria-hidden="true" className="absolute -right-[30%] -top-[10%] h-[160mm] w-[160mm] rounded-full bg-[#3b7bff]/25 blur-[60px]" />
          <img src={logoSet[512]} alt="Juris Leadership Alliance" className="relative w-44" />
          <div className="relative">
            <p className="font-mono text-[10pt] uppercase tracking-[0.2em] text-[#6c9bff]">Juris Leadership Alliance</p>
            <h1 className="mt-6 font-display text-[64pt] font-extrabold uppercase leading-[0.9] tracking-tight">The<br />Manifesto</h1>
            <p className="mt-8 font-display text-[20pt] font-semibold tracking-tight text-[#6c9bff]">{manifestoTagline}</p>
          </div>
          <p className="relative font-mono text-[9pt] uppercase tracking-[0.2em] text-white/60">CUEA Faculty of Law · {manifesto.length} commitments · {chapters.length} chapters</p>
        </section>

        {/* Contents */}
        <section className="pub-page pub-break bg-white p-[18mm]">
          <p className="pub-label">Contents</p>
          <h2 className="pub-h1">What’s inside</h2>
          <ol className="mt-8 space-y-6">
            {chapters.map((c) => (
              <li key={c.id}>
                <a href={`#pub-${c.id}`} className="flex items-baseline gap-4 font-display text-[15pt] font-bold uppercase tracking-tight"><span className="text-[#2b63e8]">{c.n}</span>{c.title}</a>
                <ul className="mt-2 space-y-1 border-l-2 border-[#e3e6ec] pl-5">
                  {c.items.map((m) => <li key={m.id}><a href={`#pub-c-${m.id}`} className="flex gap-3 text-[11pt]"><span className="font-mono text-[9pt] text-[#5b6270]">{m.n}</span>{m.title}</a></li>)}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-[120mm] text-[10pt] leading-relaxed text-[#5b6270]">This edition sets out the approved manifesto in a print-ready layout. The official, original document remains the authoritative text and is available as a PDF on the website.</p>
        </section>

        {/* Chapters */}
        {chapters.map((c) => (
          <section key={c.id} id={`pub-${c.id}`} className="pub-page pub-break bg-white p-[18mm]">
            <header className="border-b-2 border-[#050608] pb-6">
              <p className="pub-label">Chapter {c.n}</p>
              <h2 className="pub-h1">{c.title}</h2>
              {c.intro && <p className="mt-4 max-w-[140mm] text-[11.5pt] leading-relaxed">{c.intro}</p>}
              <p className="mt-3 font-mono text-[9pt] uppercase tracking-widest text-[#5b6270]">{c.items.length} {c.items.length === 1 ? 'commitment' : 'commitments'}</p>
            </header>
            {c.items.map((m) => (
              <div key={m.id} id={`pub-c-${m.id}`} className="pub-commit mt-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="pub-label">Commitment {m.n}</p>
                    <h3 className="mt-2 font-display text-[22pt] font-extrabold uppercase leading-[1] tracking-tight">{m.title}</h3>
                  </div>
                  <span aria-hidden="true" className="font-display text-[44pt] font-extrabold leading-none text-[#e3e6ec]">{m.n}</span>
                </div>
                {m.tagline && <p className="mt-3 font-display text-[13pt] font-semibold">{m.tagline}</p>}
                <div className="mt-5 space-y-5 text-[10.5pt] leading-[1.6]">
                  {m.issue && <div><p className="pub-label">The issue</p><p className="mt-1">{m.issue}</p></div>}
                  {m.proposal && <div className="border-l-[3pt] border-[#2b63e8] pl-4"><p className="pub-label">Our commitment</p><p className="mt-1 text-[12pt] font-medium leading-snug">{m.proposal}</p></div>}
                  {m.how.length > 0 && (
                    <div><p className="pub-label">How we’ll pursue it</p>
                      <ol className="mt-2 space-y-2">
                        {m.how.map((h, i) => { const { lead, text } = splitLead(h); return <li key={i} className="pub-keep flex gap-3"><span className="font-mono text-[9pt] text-[#2b63e8]">{String(i + 1).padStart(2, '0')}</span><p>{lead && <strong>{lead}. </strong>}{text}</p></li>; })}
                      </ol>
                    </div>
                  )}
                  {m.table && (
                    <div><p className="pub-label">The committees</p>
                      <table className="mt-2 w-full border-collapse text-[9.5pt]"><tbody>
                        {m.table.map((r) => <tr key={r.label} className="pub-keep border-b border-[#e3e6ec] align-top"><th scope="row" className="w-[34mm] py-2 pr-3 text-left font-bold">{r.label}</th><td className="py-2 pr-3">{r.text}</td><td className="w-[30mm] py-2 text-right font-mono text-[8pt] text-[#5b6270]">{r.ref}</td></tr>)}
                      </tbody></table>
                    </div>
                  )}
                  {(m.impact || m.serves || m.measure) && (
                    <div><p className="pub-label">Impact</p>
                      {m.impact && <p className="mt-1">{m.impact}</p>}
                      {m.serves && <p className="mt-1"><strong>Who it serves. </strong>{m.serves}</p>}
                      {m.measure && <p className="mt-1"><strong>How we’ll measure progress. </strong>{m.measure}</p>}
                    </div>
                  )}
                  {m.note && <p className="rounded border border-[#2b63e8]/40 bg-[#2b63e8]/[0.07] p-3 text-[10pt]"><strong>Please note. </strong>{m.note}</p>}
                </div>
              </div>
            ))}
          </section>
        ))}

        {/* Closing */}
        <section className="pub-page pub-break flex min-h-[297mm] flex-col justify-between bg-[#050608] p-[18mm] text-white">
          <img src={logoSet[512]} alt="" className="w-32" />
          <div>
            <h2 className="font-display text-[40pt] font-extrabold uppercase leading-[0.95] tracking-tight">Read it.<br />Question it.<br /><span className="text-[#6c9bff]">Push back.</span></h2>
            <p className="mt-8 max-w-[120mm] text-[12pt] leading-relaxed text-white/80">Every commitment is open to scrutiny. Ask, challenge, raise a concern or suggest an improvement in Counsel’s Room on the Juris website.</p>
          </div>
          <p className="font-mono text-[9pt] uppercase tracking-[0.2em] text-white/60">Juris Leadership Alliance · {manifestoTagline}</p>
        </section>
      </article>
    </div>
  );
}
