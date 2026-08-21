import CtaButton from './CtaButton';
import { offer, site } from '@/lib/config';

export default function FinalCta() {
  return (
    <section className="ground-ink px-5 py-16 text-center text-white sm:px-8 md:py-20">
      <div className="wrap mx-auto max-w-xl" data-reveal>
        <h2 className="h2 text-balance text-white">
          Find out where your campus actually stands.
        </h2>
        <p className="mt-4 text-white/70">
          {offer.seatsLeft} of {offer.cohortSeats} places left in the{' '}
          {offer.cohortName}.
        </p>
        <div className="mt-7">
          <CtaButton source="final">Apply now</CtaButton>
        </div>
        <p className="mt-6 text-[0.85rem] text-white/45">
          Or call{' '}
          <a href={site.phoneHref} className="text-gold underline-offset-4 hover:underline">
            {site.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
