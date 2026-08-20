import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { offer, site } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Booking confirmed — Yellow Zone for Schools',
  robots: { index: false, follow: false },
};

const next = [
  'Our team calls you within one working day to fix a time that suits your leadership group.',
  `The ${offer.name.toLowerCase()} runs for about 60 minutes, on campus or over video.`,
  'You receive your findings summary within 48 hours of the session, whether or not you proceed.',
];

export default function ThankYouPage() {
  return (
    <>
      <main className="ground-ink flex min-h-[80vh] items-center px-5 py-20 text-white sm:px-8">
        <div className="wrap mx-auto max-w-2xl text-center">
          <Image
            src="/seal.png"
            alt=""
            width={96}
            height={96}
            className="mx-auto h-20 w-20"
          />
          <p className="eyebrow mt-7 text-gold">Payment received</p>
          <h1 className="h2 mt-4 text-balance text-white">
            Your campus place in the {offer.cohortName} is held.
          </h1>

          <ol className="mt-9 space-y-px border border-white/12 bg-white/12 text-left">
            {next.map((n, i) => (
              <li key={n} className="flex gap-4 bg-ink px-6 py-5">
                <span className="font-mono text-[0.8rem] text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.94rem] leading-relaxed text-white/75">
                  {n}
                </span>
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
