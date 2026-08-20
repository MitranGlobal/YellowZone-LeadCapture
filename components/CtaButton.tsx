'use client';

import { useRouter } from 'next/navigation';
import { useLightbox } from '@/lib/store';

type Props = {
  source: 'nav' | 'hero' | 'framework' | 'path' | 'final' | 'sticky';
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'ghost-invert';
  className?: string;
};

export default function CtaButton({
  source,
  children,
  variant = 'primary',
  className = '',
}: Props) {
  const open = useLightbox((s) => s.open);
  const hasSubmitted = useLightbox((s) => s.hasSubmitted);
  const router = useRouter();

  const cls =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'ghost'
        ? 'btn-ghost'
        : 'btn-ghost-invert';

  return (
    <button
      type="button"
      className={`${cls} ${className}`}
      onClick={() => {
        // A lead who has already given their details should never be asked twice.
        if (hasSubmitted) router.push('/briefing');
        else open(source);
      }}
    >
      {children}
    </button>
  );
}
