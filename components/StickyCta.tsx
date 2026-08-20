'use client';

import { useEffect, useState } from 'react';
import CtaButton from './CtaButton';
import { offer } from '@/lib/config';

/** Mobile-only action bar. Appears once the hero CTA has scrolled away. */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-ink/97 px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-gold">
            {offer.seatsLeft} of {offer.cohortSeats} places left
          </p>
          <p className="truncate text-[0.82rem] text-white/70">
            {offer.cohortName}
          </p>
        </div>
        <CtaButton source="sticky" className="!px-5 !py-3 !text-[0.85rem]">
          Apply now
        </CtaButton>
      </div>
    </div>
  );
}
