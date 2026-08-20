import { domains } from '@/lib/content';
import CtaButton from './CtaButton';

/**
 * The rubric. Codes D1–D5 are the identifiers a school sees in its own
 * report, so they carry meaning rather than decorating the layout.
 */
export default function FrameworkSection() {
  return (
    <section className="section ground-parchment" id="framework">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-deep">The rubric</p>
            <h2 className="h2 mt-4 text-balance">
              Five domains. Every certified school is scored on all of them.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[0.74rem] leading-relaxed text-ink/55">
            A school cannot pass on climate alone. Wellbeing that depends on
            two committed teachers is not a system.
          </p>
        </div>

        <div className="mt-12 border-t border-ink/15" data-reveal-group>
          {domains.map((d) => (
            <article
              key={d.code}
              data-reveal
              className="group grid gap-5 border-b border-ink/15 py-7 transition-colors hover:bg-white/70 md:grid-cols-[88px_1.15fr_1fr] md:gap-8 md:py-9"
            >
              <div className="font-mono text-[0.95rem] font-medium tracking-[0.1em] text-gold-deep">
                {d.code}
              </div>

              <div>
                <h3 className="h3">{d.title}</h3>
                <p className="mt-3 max-w-prose2 text-[0.95rem] leading-relaxed text-ink/70">
                  {d.summary}
                </p>
              </div>

              <ul className="space-y-2 self-center">
                {d.evidence.map((e) => (
                  <li
                    key={e}
                    className="flex gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink/55"
                  >
                    <span aria-hidden className="text-gold">
                      ▸
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center" data-reveal>
          <CtaButton source="framework">See your school&rsquo;s starting position</CtaButton>
          <p className="text-[0.85rem] text-ink/55">
            The readiness audit tells you which domains you are already strong in.
          </p>
        </div>
      </div>
    </section>
  );
}
