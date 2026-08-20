import { ledger } from '@/lib/content';

/**
 * Two columns of a school's own record book. The left column is what the
 * school can already prove; the right is what it cannot. The visual
 * device is a ledger because that is the artefact this section is about.
 */
export default function LedgerSection() {
  return (
    <section className="section ground-parchment" id="gap">
      <div className="wrap">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow text-gold-deep">The gap</p>
          <h2 className="h2 mt-4 text-balance">
            Your school measures almost everything about a child except how
            they are doing.
          </h2>
          <p className="lede mt-5 max-w-prose2 text-ink/70">
            Academic performance is tracked every term. Emotional health —
            which drives those results, and attendance, and behaviour, and
            whether a family stays — is left to instinct and hallway
            observation.
          </p>
        </div>

        <div
          className="mt-12 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-2"
          data-reveal-group
        >
          <div className="bg-white p-7 sm:p-9" data-reveal>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.7rem] tracking-[0.16em] text-ink/45">
                ON RECORD
              </span>
              <span className="h-px flex-1 bg-ink/12" />
            </div>
            <h3 className="h3 mt-4">What you can already prove</h3>
            <ul className="mt-6 space-y-3.5">
              {ledger.tracked.map((item) => (
                <li key={item} className="flex gap-3 text-[0.95rem] text-ink/75">
                  <span
                    aria-hidden
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-ink/35"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink p-7 text-white sm:p-9" data-reveal>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.7rem] tracking-[0.16em] text-gold">
                NO RECORD
              </span>
              <span className="h-px flex-1 bg-white/15" />
            </div>
            <h3 className="h3 mt-4 text-white">What you cannot show anyone</h3>
            <ul className="mt-6 space-y-3.5">
              {ledger.untracked.map((item) => (
                <li key={item} className="flex gap-3 text-[0.95rem] text-white/78">
                  <span
                    aria-hidden
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-gold"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
