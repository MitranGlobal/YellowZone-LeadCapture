import { precedents } from '@/lib/content';

/**
 * The argument: a standard is a proven instrument in other sectors.
 * Presented as three precedent entries, each showing the before/after
 * that certification created in its field.
 */
export default function StandardSection() {
  return (
    <section className="section bg-ink text-white" id="standard">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div data-reveal>
            <p className="eyebrow text-gold">The instrument</p>
            <h2 className="h2 mt-4 text-balance text-white">
              A standard is how a sector stops guessing.
            </h2>
          </div>

          <div className="lede space-y-5 text-white/72" data-reveal>
            <p>
              We are not building an assessment product. We are building
              wellbeing infrastructure: schools are assessed, high-performing
              campuses are studied, their practices are documented and
              standardised, and other schools implement and certify against
              them.
            </p>
            <p>
              It is the Blue Zones logic — find the places where people are
              measurably doing better, work out what they share, then make it
              repeatable — applied to Indian classrooms.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-px border border-white/12 bg-white/12 md:grid-cols-3" data-reveal-group>
          {precedents.map((p) => {
            const isUs = p.mark === 'Yellow Zone';
            return (
              <article
                key={p.mark}
                data-reveal
                className={isUs ? 'bg-gold p-7 text-ink sm:p-8' : 'bg-ink p-7 sm:p-8'}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className={`font-display text-[1.4rem] font-extrabold ${
                      isUs ? 'text-ink' : 'text-white'
                    }`}
                  >
                    {p.mark}
                  </h3>
                  {p.href ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/45 underline-offset-4 hover:text-gold hover:underline"
                    >
                      Reference
                    </a>
                  ) : (
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink/55">
                      In build
                    </span>
                  )}
                </div>

                <p
                  className={`mt-1 font-mono text-[0.68rem] uppercase tracking-[0.13em] ${
                    isUs ? 'text-ink/60' : 'text-gold/80'
                  }`}
                >
                  {p.field}
                </p>

                <div className={`mt-6 space-y-4 text-[0.92rem] leading-relaxed ${isUs ? 'text-ink/80' : 'text-white/65'}`}>
                  <p>{p.before}</p>
                  <div className={`rule-cert ${isUs ? 'text-ink/25' : 'text-white/20'}`} />
                  <p className={isUs ? 'font-semibold text-ink' : 'text-white/85'}>
                    {p.after}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
