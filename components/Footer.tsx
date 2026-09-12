import Link from 'next/link';
import { site } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="border-t border-ink/15 bg-parchment-dim px-5 py-10 sm:px-8">
      <div className="wrap flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={site.org}
            width={302}
            height={80}
            className="block h-8 w-auto object-contain"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink/55">
          <a href={site.phoneHref} className="hover:text-ink">{site.phone}</a>
          <a href={`mailto:${site.email}`} className="normal-case tracking-normal hover:text-ink">
            {site.email}
          </a>
          <Link href="/privacy-policy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
        </div>
      </div>

      <p className="wrap mt-7 text-[0.75rem] leading-relaxed text-ink/45">
        Assessment runs on school and parent consent and is reported at cohort
        level. It is not a clinical or diagnostic service for individual
        students. © {new Date().getFullYear()} {site.org}.
      </p>
    </footer>
  );
}
