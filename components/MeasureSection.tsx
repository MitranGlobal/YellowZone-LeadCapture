import { domains } from '@/lib/content';

export default function MeasureSection() {
  return (
    <section className="section ground-parchment" id="what">
      <div className="wrap">
        <h2 className="h2 max-w-2xl text-balance" data-reveal>
          Five things we score. Every certified school is measured on all of them.
        </h2>

        <div className="mt-10 border-t border-ink/15" data-reveal-group>
          {domains.map((d) => (
            <div
              key={d.code}
              data-reveal
              className="flex flex-col gap-1 border-b border-ink/15 py-5 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="font-mono text-[0.8rem] tracking-[0.1em] text-gold-deep sm:w-12">
                {d.code}
              </span>
              <h3 className="font-display text-[1.05rem] font-extrabold sm:w-72">
                {d.title}
              </h3>
              <p className="text-[0.93rem] text-ink/65">{d.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
