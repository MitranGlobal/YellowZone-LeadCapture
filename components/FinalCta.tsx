import CtaButton from './CtaButton';
import { offer, site } from '@/lib/config';

export default function FinalCta() {
  return (
    <section className="ground-ink relative overflow-hidden px-5 py-20 text-white sm:px-8 md:py-28">
      <div className="wrap text-center">
        <div className="mx-auto max-w-2xl" data-reveal>
          <p className="eyebrow text-gold">{offer.cohortName}</p>
          <h2 className="h2 mt-5 text-balance text-white">
            The first schools certified will set the benchmark everyone else is
            measured against.
          </h2>
          <p className="lede mt-6 text-white/72">
            {offer.seatsLeft} of {offer.cohortSeats} campus places remain. Apply
            with your school&rsquo;s details, watch the{' '}
            {offer.briefingMinutes}-minute briefing, and decide from there.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4">
            <CtaButton source="final" className="w-full sm:w-auto">
              Apply for a {offer.name.toLowerCase()}
            </CtaButton>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/45">
              {offer.refundWindowLabel}
            </p>
          </div>

          <p className="mt-10 text-[0.88rem] text-white/50">
            Prefer to talk first? Call{' '}
            <a href={site.phoneHref} className="text-gold underline-offset-4 hover:underline">
              {site.phone}
            </a>{' '}
            or write to{' '}
            <a href={`mailto:${site.email}`} className="text-gold underline-offset-4 hover:underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
