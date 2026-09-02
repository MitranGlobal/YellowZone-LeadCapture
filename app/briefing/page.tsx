import type { Metadata } from 'next';
import VimeoPlayer from '@/components/VimeoPlayer';
import TallyEmbed from '@/components/TallyEmbed';
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
          Step 2 of 2 · Watch, then pick a time
        </p>
      </div>

      <main className="ground-ink text-white">
        <section className="px-5 pb-12 pt-10 sm:px-8 md:pt-14">
          <div className="wrap">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow text-gold">
                Briefing · {offer.briefingMinutes} minutes
              </p>
              <h1 className="h2 mt-4 text-balance text-white">
                Watch this, then book your slot below.
              </h1>
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
              <VimeoPlayer />
            </div>
          </div>
        </section>

        <section id="apply" className="border-t border-white/10 px-5 py-12 sm:px-8">
          <div className="wrap">
            <div className="mx-auto max-w-3xl text-center" data-reveal>
              <p className="eyebrow text-gold">Free · No payment</p>
              <h2 className="h2 mt-4 text-balance text-white">
                Apply and pick your time
              </h2>
              <p className="mt-3 text-[0.95rem] text-white/65">
                A 60-minute session with our assessment team, at your school.
              </p>
            </div>

            {/* Sits above the form, not below it: someone who fills this in
                and then discovers they cannot host or attend has wasted their
                time and ours. */}
            <div
              className="mx-auto mt-8 max-w-3xl border-l-2 border-gold bg-white/[0.06] px-5 py-4"
              data-reveal
            >
              <p className="text-[0.92rem] leading-relaxed text-white/75">
                <strong className="font-semibold text-gold">Please note:</strong>{' '}
                This meeting will be conducted in person, on the school
                premises, and we strongly recommend that an authoritative
                decision-maker from the school complete this form and attend
                the meeting.
              </p>
            </div>

            {/* Tally form is light-on-white; it gets its own panel rather than
                sitting transparent on the navy ground, where it is unreadable. */}
            <div className="mx-auto mt-8 max-w-3xl rounded-sm bg-parchment p-4 shadow-raised sm:p-6">
              <TallyEmbed />
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-12 sm:px-8">
          <div
            className="wrap grid gap-px border border-white/12 bg-white/12 md:grid-cols-3"
            data-reveal-group
          >
            {gates.map((g) => (
              <article key={g.title} data-reveal className="bg-ink p-6">
                <div className="rule-cert w-10 text-gold" aria-hidden />
                <h3 className="mt-4 font-display text-[1.02rem] font-extrabold leading-snug text-white">
                  {g.title}
                </h3>
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
