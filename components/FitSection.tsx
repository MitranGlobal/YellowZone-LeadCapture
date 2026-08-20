import { fit } from '@/lib/content';

export default function FitSection() {
  return (
    <section className="section ground-parchment" id="fit">
      <div className="wrap">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow text-gold-deep">Admission to the cohort</p>
          <h2 className="h2 mt-4 text-balance">
            We turn schools down. It is the only way the seal means anything.
          </h2>
        </div>

        <div className="mt-11 grid gap-8 md:grid-cols-2 md:gap-12" data-reveal-group>
          <div data-reveal>
            <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/60">
              We should talk if
            </h3>
            <ul className="mt-5 space-y-4">
              {fit.yes.map((f) => (
                <li key={f} className="flex gap-3.5 border-l-2 border-gold bg-white py-3 pl-4 pr-4 text-[0.94rem] leading-relaxed text-ink/80 shadow-card">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/60">
              We are the wrong fit if
            </h3>
            <ul className="mt-5 space-y-4">
              {fit.no.map((f) => (
                <li key={f} className="flex gap-3.5 border-l-2 border-ink/20 py-3 pl-4 pr-4 text-[0.94rem] leading-relaxed text-ink/55">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
