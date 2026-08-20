import { stages } from '@/lib/content';

/**
 * A real sequence: each stage is impossible without the one before it,
 * which is the only reason this section is numbered.
 */
export default function PathSection() {
  return (
    <section className="section bg-white" id="path">
      <div className="wrap">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow text-gold-deep">The route to certification</p>
          <h2 className="h2 mt-4 text-balance">
            Seven months from first audit to a seal on your gate.
          </h2>
        </div>

        <ol className="mt-12 grid gap-px bg-ink/12 md:grid-cols-5" data-reveal-group>
          {stages.map((s, i) => (
            <li
              key={s.step}
              data-reveal
              className={`relative bg-white p-6 ${
                i === stages.length - 1 ? 'md:bg-parchment-dim' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold-deep">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-3 font-display text-[1.08rem] font-extrabold leading-snug">
                {s.title}
              </h3>
              <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink/45">
                {s.duration}
              </p>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-ink/70">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink/45" data-reveal>
          Stage 1 is what you book on this page.
        </p>
      </div>
    </section>
  );
}
