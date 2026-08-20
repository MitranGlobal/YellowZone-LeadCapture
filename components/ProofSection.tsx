import { proofPoints, testimonials } from '@/lib/content';

export default function ProofSection() {
  return (
    <section className="section bg-ink text-white" id="proof">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div data-reveal>
            <p className="eyebrow text-gold">Behind the standard</p>
            <h2 className="h2 mt-4 text-balance text-white">
              Built by people who have sat with the children, not just the data.
            </h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-white/70">
              The framework comes out of two decades of direct work with teens
              and the adults around them — a TEDx speaker and author who grew up
              in a South Indian village, froze under pressure as a teenager, and
              spent a career on what schools were never set up to teach.
            </p>

            <dl className="mt-9 grid grid-cols-2 gap-px border border-white/12 bg-white/12">
              {proofPoints.map((p) => (
                <div key={p.label} className="bg-ink px-5 py-4">
                  <dt className="font-display text-[1.5rem] font-extrabold leading-none text-gold">
                    {p.figure}
                  </dt>
                  <dd className="mt-2 text-[0.78rem] leading-snug text-white/55">
                    {p.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-5" data-reveal-group>
            {testimonials.map((t) => (
              <figure
                key={t.name}
                data-reveal
                className="panel-ink p-6 sm:p-7"
              >
                <div className="rule-cert w-14 text-gold" aria-hidden />
                <blockquote className="mt-5 text-[1rem] leading-relaxed text-white/82">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-[0.98rem] font-extrabold text-white">
                    {t.name}
                  </span>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/45">
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            ))}
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/40" data-reveal>
              Student outcomes from MiTran Global mentoring programmes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
