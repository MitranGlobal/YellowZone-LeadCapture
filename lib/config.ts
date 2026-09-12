/**
 * Single source of truth for anything the marketing team changes often:
 * the scheduling form, contact details, tracking ids.
 *
 * The video is deliberately NOT here — it lives inside
 * components/VideoPlayer.tsx, which imports nothing from the project so it
 * cannot break when something in this file is renamed.
 */

const FALLBACK_URL = 'https://schools.mitranglobal.com';

/**
 * Resolves the canonical site URL defensively.
 *
 * `metadataBase: new URL(...)` throws at build time on a malformed value, and
 * the most common way to fill NEXT_PUBLIC_SITE_URL in a hosting dashboard is
 * to paste a bare domain with no scheme. So: add a missing scheme, drop a
 * trailing slash, fall back to the Vercel-provided host, and never let a bad
 * value take the build down.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;

    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(withScheme);
      if (!url.hostname.includes('.')) continue;
      return url.origin;
    } catch {
      // Malformed entry — try the next candidate.
    }
  }

  return FALLBACK_URL;
}

export const site = {
  name: 'Yellow Zone for Schools',
  org: 'MiTran Global',
  tagline: 'Every child has the right to feel #positive',
  url: resolveSiteUrl(),
  email: 'counselmitranglobal@gmail.com',
  phone: '+91 74832 59966',
  phoneHref: 'tel:+917483259966',
  whatsapp: 'https://wa.me/917483259966',
} as const;

export const offer = {
  /** What the school books on the briefing page. Free — no payment step. */
  name: 'Campus Readiness Audit',
  cohortName: 'Founding Cohort 2026',
  briefingMinutes: 14,
} as const;

export const tally = {
  /**
   * Tally embed URL. The form carries both the application questions and the
   * appointment slot, so it is the only conversion point in the funnel.
   * dynamicHeight lets Tally's script resize the iframe as the form grows.
   */
  src:
    process.env.NEXT_PUBLIC_TALLY_SRC ??
    'https://tally.so/embed/WOadLk?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
} as const;

export const tracking = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
} as const;
