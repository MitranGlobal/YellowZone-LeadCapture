'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CtaButton from './CtaButton';
import { offer, site } from '@/lib/config';

export default function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-parchment/95 backdrop-blur transition-shadow ${
        lifted
          ? 'border-ink/10 shadow-[0_10px_30px_-24px_rgba(12,58,102,0.9)]'
          : 'border-transparent'
      }`}
    >
      <div className="wrap flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={site.org}>
          <Image
            src="/logo.png"
            alt={site.org}
            width={168}
            height={36}
            priority
            className="h-8 w-auto sm:h-9"
          />
          <span className="hidden h-7 w-px bg-ink/15 lg:block" />
          <span className="eyebrow hidden text-ink/55 lg:block">
            Yellow Zone Certification
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden font-mono text-[0.75rem] tracking-wide text-ink/65 transition hover:text-ink md:block"
          >
            {site.phone}
          </a>
          <CtaButton
            source="nav"
            className="!px-5 !py-2.5 !text-[0.85rem] sm:!px-6 sm:!py-3"
          >
            Apply for an audit
          </CtaButton>
        </div>
      </div>

      <div className="h-[3px] bg-rule-gold opacity-70" aria-hidden />
      <p className="sr-only">
        {offer.seatsLeft} of {offer.cohortSeats} campus places remain in the{' '}
        {offer.cohortName}.
      </p>
    </header>
  );
}
