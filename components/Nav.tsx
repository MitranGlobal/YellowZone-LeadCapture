'use client';

import Link from 'next/link';
import CtaButton from './CtaButton';
import { site } from '@/lib/config';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-parchment/95 backdrop-blur">
      <div className="wrap flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" aria-label={site.org} className="flex items-center">
          {/* Plain img, not next/image: the logo is a fixed-height mark and
              intrinsic-size mismatches in next/image were distorting it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={site.org}
            width={302}
            height={80}
            className="block h-8 w-auto object-contain sm:h-9"
          />
        </Link>

        <CtaButton source="nav" className="!px-5 !py-2.5 !text-[0.85rem] sm:!px-6">
          Apply now
        </CtaButton>
      </div>
      <div className="h-[3px] bg-gradient-to-r from-gold-deep via-gold to-gold-deep opacity-80" aria-hidden />
    </header>
  );
}
