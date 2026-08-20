import type { Metadata } from 'next';
import Image from 'next/image';
import WistiaPlayer from '@/components/WistiaPlayer';
import PayButton from '@/components/PayButton';
import ScrollReveals from '@/components/ScrollReveals';
import Footer from '@/components/Footer';
import { gates, proofPoints, testimonials } from '@/lib/content';
import { offer, site } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Assessment briefing — Yellow Zone for Schools',
  description:
    'Watch the assessment briefing, then book your campus readiness audit.',
  robots: { index: false, follow: false },
};

const included = [
  'A structured review of your current wellbeing practice across all five domains',
  'The specific evidence gaps that would block certification today',
  'A sample Zone report so you can see exactly what your school would receive',
  'Assessment scope, timeline and cost built for your campus size',
];

export default function BriefingPage() {
  return (
    <>
      <ScrollReveals />

      {/* Confirmation bar */}
      <div className="border-b border-gold-deep/30 bg-beacon px-5 py-3 text-center sm:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink">
          Step 2 of 2 · Your campus details are with our assessment team
        </p>
      </div>

      <main className="ground-ink text-white">
        {/* Video */}
        <section className="px-5 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-16">
          <div className="wrap">
            <div className="mx-auto max-w-3xl text-center">
              <Image
                src="/seal.png"
                alt=""
                width={78}
                height={78}
                className="mx-auto mb-6 h-16 w-16 opacity-95 sm:h-[74px] sm:w-[74px]"
              />
              <p className="eyebrow text-gold">
                Assessment briefing · {offer.briefingMinutes} minutes
              </p>
              <h1 className="h1 mt-5 text-balance">
                Your school&rsquo;s emotional data already exists.
                <span className="block text-gold">
                  Nobody has ever collected it.
                </span>
              </h1>
              <p className="lede mx-auto mt-5 max-w-prose2 text-white/72">
                Watch this before you book. It shows exactly what we measure,
                how the assessment runs on your campus, and what certification
                requires from your team.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
              <WistiaPlayer />
            </div>

            <div className="mx-auto mt-9 flex max-w-4xl flex-col items-center gap-4">
              <PayButton className="w-full sm:w-auto">
                Book your {offer.name.toLowerCase()} — {offer.priceLabel}
              </PayButton>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/45">
                {offer.seatsLeft} of {offer.cohortSeats} places left ·{' '}
                {offer.refundWindowLabel}
              </p>
            </div>
          </div>
        </section>

        {/* What the audit includes */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:py-20">
          <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div data-reveal>
              <p className="eyebrow text-gold">What you book</p>
              <h2 className="h2 mt-4 text-balance text-white">
                The {offer.name}
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/65">
                A working session with our assessment team and your leadership —
                not a sales call. You leave with findings whether or not you go
                ahead.
              </p>
            </div>

            <ul className="grid gap-px border border-white/12 bg-white/12" data-reveal-group>
              {included.map((item) => (
                <li
                  key={item}
                  data-reveal
                  className="flex gap-4 bg-ink px-6 py-5 text-[0.95rem] leading-relaxed text-white/78"
                >
                  <span aria-hidden className="mt-1 shrink-0 text-gold">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Gates */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:py-20">
          <div className="wrap">
            <div className="max-w-2xl" data-reveal>
              <p className="eyebrow text-gold">Read this first</p>
              <h2 className="h2 mt-4 text-balance text-white">
                We do not certify every school that applies.
              </h2>
            </div>

            <div className="mt-10 grid gap-px border border-white/12 bg-white/12 md:grid-cols-2" data-reveal-group>
              {gates.map((g) => (
                <article key={g.title} data-reveal className="bg-ink p-7 sm:p-8">
                  <div className="rule-cert w-12 text-gold" aria-hidden />
                  <h3 className="mt-5 font-display text-[1.12rem] font-extrabold leading-snug text-white">
                    {g.title}
                  </h3>
                  <p className="mt-3 text-[0.93rem] leading-relaxed text-white/65">
                    {g.body}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-6 text-[0.88rem] text-white/50" data-reveal>
              Questions before you book? Write to{' '}
              <a href={`mailto:${site.email}`} className="text-gold underline-offset-4 hover:underline">
                {site.email}
              </a>{' '}
              or call{' '}
              <a href={site.phoneHref} className="text-gold underline-offset-4 hover:underline">
                {site.phone}
              </a>
              .
            </p>
          </div>
        </section>

        {/* Credibility */}
        <section className="border-t border-white/10 px-5 py-16 sm:px-8 md:py-20">
          <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div data-reveal>
              <p className="eyebrow text-gold">Who is behind it</p>
              <h2 className="h2 mt-4 text-balance text-white">
                Twenty years on what schools were never set up to teach.
              </h2>
              <p className="mt-5 text-[0.96rem] leading-relaxed text-white/68">
                A TEDx speaker and author who grew up in a small South Indian
                village with no elite school and no big-city advantage, and who
                froze under pressure as a teenager. That experience became two
                decades of work on mindset, discipline and emotional strength —
                and the framework this certification is built on.
              </p>

              <ul className="mt-7 space-y-2.5 font-mono text-[0.74rem] uppercase tracking-[0.1em] text-white/55">
                <li>Author · 101 Secrets of Imparting Positivity to Your Teen</li>
                <li>Author · Be a Champ, Creating Superkids &amp; Superteens</li>
                <li>Lifetime Achievement Award, GEC</li>
                <li>Entrepreneur of the Year Award</li>
              </ul>
            </div>

            <div className="space-y-5" data-reveal-group>
              <dl className="grid grid-cols-2 gap-px border border-white/12 bg-white/12" data-reveal>
                {proofPoints.map((p) => (
                  <div key={p.label} className="bg-ink px-5 py-4">
                    <dt className="font-display text-[1.45rem] font-extrabold leading-none text-gold">
                      {p.figure}
                    </dt>
                    <dd className="mt-2 text-[0.76rem] leading-snug text-white/55">
                      {p.label}
                    </dd>
                  </div>
                ))}
              </dl>

              {testimonials.map((t) => (
                <figure key={t.name} data-reveal className="panel-ink p-6">
                  <blockquote className="text-[0.95rem] leading-relaxed text-white/80">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-[0.95rem] font-extrabold text-white">
                      {t.name}
                    </span>
                    <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-white/45">
                      {t.role}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="border-t border-white/10 px-5 py-20 text-center sm:px-8 md:py-24">
          <div className="wrap mx-auto max-w-2xl" data-reveal>
            <p className="eyebrow text-gold">{offer.cohortName}</p>
            <h2 className="h2 mt-5 text-balance text-white">
              Book the audit. Find out where your campus actually stands.
            </h2>

            <div className="mt-8 inline-flex items-baseline gap-3">
              {offer.anchorLabel ? (
                <span className="font-mono text-[0.95rem] text-white/35 line-through">
                  {offer.anchorLabel}
                </span>
              ) : null}
              <span className="font-display text-[2.6rem] font-extrabold leading-none text-gold">
                {offer.priceLabel}
              </span>
            </div>
            <p className="mt-2 text-[0.85rem] text-white/50">
              Adjusted against your certification cost if you proceed.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <PayButton />
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/45">
                {offer.refundWindowLabel}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
