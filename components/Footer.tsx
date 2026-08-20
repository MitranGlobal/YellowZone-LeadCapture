import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="border-t border-ink/15 bg-parchment-dim px-5 py-14 sm:px-8">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Image
              src="/logo.png"
              alt={site.org}
              width={190}
              height={40}
              className="h-9 w-auto"
            />
            <p className="mt-4 max-w-sm text-[0.88rem] leading-relaxed text-ink/60">
              Yellow Zone is the emotional wellbeing certification programme of{' '}
              {site.org}, built for schools across India, Asia and the Middle
              East.
            </p>
          </div>

          <div className="flex flex-col gap-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink/60">
            <a href={site.phoneHref} className="hover:text-ink">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="normal-case tracking-normal hover:text-ink">
              {site.email}
            </a>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="hover:text-ink">
              WhatsApp
            </a>
            <Link href="/privacy-policy" className="hover:text-ink">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </div>
        </div>

        <div className="rule-cert mt-10 text-ink/15" aria-hidden />

        <p className="mt-6 max-w-4xl text-[0.78rem] leading-relaxed text-ink/45">
          The content on this page is not a guarantee of outcomes. Assessment
          results, certification decisions and improvement depend on each
          school&rsquo;s own participation and implementation. Emotion AI
          assessment is conducted with school and parent consent and reported at
          cohort level; it is not a clinical or diagnostic service for
          individual students. All terms, privacy policies and disclaimers for
          this programme can be read on the linked pages.
        </p>

        <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/40">
          © {new Date().getFullYear()} {site.org} · {site.tagline}
        </p>
      </div>
    </footer>
  );
}
