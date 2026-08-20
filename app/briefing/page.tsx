import type { Metadata } from 'next';
import WistiaPlayer from '@/components/WistiaPlayer';
import PayButton from '@/components/PayButton';
import ScrollReveals from '@/components/ScrollReveals';
import Footer from '@/components/Footer';
import { gates } from '@/lib/content';
import { offer, site } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Assessment briefing — Yellow Zone for Schools',
  robots: { index: false, follow: false },
};

export default function BriefingPage() {
  return (
    <>
      <ScrollReveals />

      <div className="border-b border-gold-deep/30 bg-beacon px-5 py-2.5 text-center">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink">
          Step 2 of 2 · Your details are with our team
        </p>
      </div>

      <main className="ground-ink text-white">
        <section className="px-5 pb-14 pt-10 sm:px-8 md:pb-16 md:pt-14">
          <div className="wrap">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow text-gold">
                Briefing · {offer.briefingMinutes} minutes
              </p>
              <h1 className="h2 mt-4 text-balance text-white">
                Watch this before you book.
              </h1>
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
              <WistiaPlayer />
            </div>

            <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-3">
              <PayButton>
                Book your {offer.name.toLowerCase()} — {offer.priceLabel}
              </PayButton>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/45">
                {offer.seatsLeft} of {offer.cohortSeats} places left
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-14 sm:px-8">
          <div className="wrap grid gap-px border border-white/12 bg-white/12 md:grid-cols-3" data-reveal-group>
            {gates.map((g) => (
              <article key={g.title} data-reveal className="bg-ink p-6">
                <div className="rule-cert w-10 text-gold" aria-hidden />
                <h2 className="mt-4 font-display text-[1.02rem] font-extrabold leading-snug text-white">
                  {g.title}
                </h2>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-white/65">
                  {g.body}
                </p>
              </article>
            ))}
          </div>

          <p className="wrap mt-6 text-center text-[0.85rem] text-white/50">
            Questions? Call{' '}
            <a href={site.phoneHref} className="text-gold underline-offset-4 hover:underline">
              {site.phone}
            </a>{' '}
            or email{' '}
            <a href={`mailto:${site.email}`} className="text-gold underline-offset-4 hover:underline">
              {site.email}
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
