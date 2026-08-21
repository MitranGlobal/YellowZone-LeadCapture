import { steps } from '@/lib/content';
import CtaButton from './CtaButton';

export default function StepsSection() {
  return (
    <section className="section bg-white" id="how">
      <div className="wrap">
        <h2 className="h2 max-w-xl text-balance" data-reveal>
          How it works
        </h2>

        <ol className="mt-9 grid gap-px bg-ink/12 md:grid-cols-3" data-reveal-group>
          {steps.map((s) => (
            <li key={s.n} data-reveal className="bg-white p-6">
              <span className="font-mono text-[0.72rem] tracking-[0.16em] text-gold-deep">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-[1.05rem] font-extrabold">
                {s.title}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/65">
                {s.line}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-9" data-reveal>
          <CtaButton source="framework">Apply now</CtaButton>
        </div>
      </div>
    </section>
  );
}
