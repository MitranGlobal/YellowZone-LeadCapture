import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { offer, site } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms — Yellow Zone for Schools',
};

export default function TermsPage() {
  return (
    <>
      <main className="ground-parchment px-5 py-16 sm:px-8 md:py-24">
        <article className="wrap mx-auto max-w-prose2">
          <Link href="/" className="eyebrow text-gold-deep hover:underline">
            ← Yellow Zone for Schools
          </Link>
          <h1 className="h2 mt-6">Terms</h1>

          <div className="mt-9 space-y-7 text-[0.95rem] leading-relaxed text-ink/75">
            <section>
              <h2 className="h3 text-ink">What you are booking</h2>
              <p className="mt-3">
                The {offer.name.toLowerCase()} is a free structured review
                session with our assessment team. There is no charge at any
                stage of this process. Booking a session does not guarantee that
                your school will be accepted into the cohort or certified.
              </p>
            </section>

            <section>
              <h2 className="h3 text-ink">Rescheduling</h2>
              <p className="mt-3">
                Reschedule or cancel using the link in your calendar invite, or
                write to us. We ask for reasonable notice so the slot can go to
                another school.
              </p>
            </section>

            <section>
              <h2 className="h3 text-ink">No guarantee of outcomes</h2>
              <p className="mt-3">
                Assessment findings, certification decisions and any improvement
                in student wellbeing depend on your school&rsquo;s own
                participation and implementation. Nothing on this site is a
                guarantee of a result.
              </p>
            </section>

            <section>
              <h2 className="h3 text-ink">Contact</h2>
              <p className="mt-3">
                {site.org} ·{' '}
                <a href={`mailto:${site.email}`} className="underline">
                  {site.email}
                </a>{' '}
                ·{' '}
                <a href={site.phoneHref} className="underline">
                  {site.phone}
                </a>
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
