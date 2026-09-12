import { criteria } from '@/lib/content';

/**
 * The five certification criteria. Each row is code / title / detail, so the
 * eye can run down the titles alone and still get the whole list.
 */
export default function MeasureSection() {
  return (
    <section className="section ground-parchment" id="what">
      <div className="wrap">
        <h2 className="h2 max-w-2xl text-balance" data-reveal>
          Five things we check. A certified school has all of them.
        </h2>

        <div className="mt-10 border-t border-ink/15" data-reveal-group>
          {criteria.map((c) => (
            <div
              key={c.code}
              data-reveal
              className="flex flex-col gap-1.5 border-b border-ink/15 py-5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-6"
            >
              <span className="font-mono text-[0.8rem] tracking-[0.1em] text-gold-deep sm:w-10 sm:shrink-0">
                {c.code}
              </span>
              <h3 className="font-display text-[1.05rem] font-extrabold leading-snug sm:w-[19rem] sm:shrink-0">
                {c.title}
              </h3>
              <p className="text-[0.93rem] leading-relaxed text-ink/65">
                {c.line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
