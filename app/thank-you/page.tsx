import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { offer, site } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Appointment confirmed — Yellow Zone for Schools',
  robots: { index: false, follow: false },
};

const next = [
  'A calendar invite is on its way to the email you booked with.',
  `The ${offer.name.toLowerCase()} runs about 60 minutes, at your school.`,
  'You get your findings summary within 48 hours of the session.',
];

export default function ThankYouPage() {
  return (
    <>
      <main className="ground-ink flex min-h-[80vh] items-center px-5 py-20 text-white sm:px-8">
        <div className="wrap mx-auto max-w-2xl text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/seal.png" alt="" width={96} height={96} className="mx-auto h-20 w-20" />
          <p className="eyebrow mt-7 text-gold">Appointment confirmed</p>
          <h1 className="h2 mt-4 text-balance text-white">
            Your slot in the {offer.cohortName} is booked.
          </h1>

          <ol className="mt-9 space-y-px border border-white/12 bg-white/12 text-left">
            {next.map((n, i) => (
              <li key={n} className="flex gap-4 bg-ink px-6 py-5">
                <span className="font-mono text-[0.8rem] text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.94rem] leading-relaxed text-white/75">{n}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-[0.9rem] text-white/55">
            Need to reach us sooner? Call{' '}
            <a href={site.phoneHref} className="text-gold underline-offset-4 hover:underline">
              {site.phone}
            </a>{' '}
            or email{' '}
            <a href={`mailto:${site.email}`} className="text-gold underline-offset-4 hover:underline">
              {site.email}
            </a>
            .
          </p>

          <Link href="/" className="btn-ghost-invert mt-9">
            Back to the standard
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
