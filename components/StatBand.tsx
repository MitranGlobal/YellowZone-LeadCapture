import { marketStats } from '@/lib/content';

/**
 * The market, stated as a running band. The fourth figure is the point of
 * the whole page: three enormous numbers, and then a zero.
 */
export default function StatBand() {
  const row = (
    <div className="flex shrink-0 items-stretch">
      {marketStats.map((s) => (
        <div
          key={s.label}
          className="flex items-baseline gap-3 border-r border-ink/15 px-8 py-4"
        >
          <span className="font-display text-[1.35rem] font-extrabold leading-none text-ink">
            {s.figure}
          </span>
          <span className="whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.13em] text-ink/65">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Market context"
      className="overflow-hidden border-b border-ink/15 bg-beacon"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </section>
  );
}
