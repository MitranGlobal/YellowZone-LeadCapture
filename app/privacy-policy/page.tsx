import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { site } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy policy — Yellow Zone for Schools',
};

export default function PrivacyPage() {
  return (
    <>
      <main className="ground-parchment px-5 py-16 sm:px-8 md:py-24">
        <article className="wrap mx-auto max-w-prose2">
          <Link href="/" className="eyebrow text-gold-deep hover:underline">
            ← Yellow Zone for Schools
          </Link>
          <h1 className="h2 mt-6">Privacy policy</h1>
          <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">
            Last updated {new Date().getFullYear()}
          </p>

          <div className="mt-9 space-y-7 text-[0.95rem] leading-relaxed text-ink/75">
            <section>
              <h2 className="h3 text-ink">What we collect on this site</h2>
              <p className="mt-3">
                When you apply for a readiness audit we collect your school
                name, your name and role, phone number, email address, city,
                approximate student strength and board. We also record standard
                web analytics such as page views and the ad or link that brought
                you here.
              </p>
            </section>

            <section>
              <h2 className="h3 text-ink">Why we use it</h2>
              <p className="mt-3">
                To contact you about your audit, to prepare for that session, and
                to send you information about the Yellow Zone certification
                programme. We do not sell your details to anyone.
              </p>
            </section>

            <section>
              <h2 className="h3 text-ink">Student assessment data</h2>
              <p className="mt-3">
                No student data is collected through this website. Emotion AI
                assessment happens only after a school signs a separate
                assessment and data agreement, runs on school and parent
                consent, and is reported at cohort level rather than as
                individual profiles. It is not a clinical or diagnostic service.
              </p>
            </section>

            <section>
              <h2 className="h3 text-ink">Who else sees it</h2>
              <p className="mt-3">
                Our CRM, email, analytics and payment providers process this
                data on our behalf under their own terms. Payments are handled by
                our payment gateway; we never see or store your card details.
              </p>
            </section>

            <section>
              <h2 className="h3 text-ink">Your choices</h2>
              <p className="mt-3">
                Write to{' '}
                <a href={`mailto:${site.email}`} className="underline">
                  {site.email}
                </a>{' '}
                to ask for a copy of your data, to correct it, or to have it
                deleted. You can unsubscribe from our emails at any time using
                the link in any message.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
