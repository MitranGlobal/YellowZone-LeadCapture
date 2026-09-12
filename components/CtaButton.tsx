import Link from 'next/link';

type Props = {
  /** Which CTA was clicked — kept as a data attribute for analytics. */
  source: 'nav' | 'hero' | 'framework' | 'final' | 'sticky';
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'ghost-invert';
  className?: string;
};

/**
 * Every CTA on the landing page is a plain link to the briefing page. No
 * modal, no interstitial: the visitor goes straight to the video and the
 * application form beneath it. A link also means middle-click, long-press
 * and "open in new tab" all behave the way people expect, which a button
 * dressed up as navigation never does.
 */
export default function CtaButton({
  source,
  children,
  variant = 'primary',
  className = '',
}: Props) {
  const cls =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'ghost'
        ? 'btn-ghost'
        : 'btn-ghost-invert';

  return (
    <Link href="/briefing" data-cta={source} className={`${cls} ${className}`}>
      {children}
    </Link>
  );
}
