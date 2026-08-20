import { faqs } from '@/lib/content';

/** Native disclosure elements: keyboard-operable and works without JS. */
export default function FaqSection() {
  return (
    <section className="section bg-white" id="faq">
      <div className="wrap grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow text-gold-deep">Before you apply</p>
          <h2 className="h2 mt-4 text-balance">Questions school leaders ask</h2>
        </div>

        <div className="border-t border-ink/15" data-reveal-group>
          {faqs.map((f) => (
            <details
              key={f.q}
              data-reveal
              className="group border-b border-ink/15 py-5"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-[1.02rem] font-extrabold leading-snug marker:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="mt-1 shrink-0 font-mono text-gold-deep transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-prose2 text-[0.94rem] leading-relaxed text-ink/70">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
