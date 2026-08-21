/**
 * Single source of truth for anything the marketing team changes often:
 * scheduling link, seat count, contact details, video id, tracking ids.
 * Nothing else in the codebase should hard-code these values.
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
  /** Cohort scarcity — keep this honest and update it when it changes. */
  cohortSeats: 12,
  seatsLeft: 5,
  cohortName: 'Founding Cohort 2026',
  briefingMinutes: 14,
} as const;

export const video = {
  /** Wistia media id for the briefing video. */
  mediaId: process.env.NEXT_PUBLIC_WISTIA_MEDIA_ID ?? 'kudy2kfy6c',
} as const;

export const calendly = {
  /**
   * Your Calendly event URL, e.g.
   * https://calendly.com/mitranglobal/campus-readiness-audit
   */
  url:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    'https://calendly.com/mitranglobal/campus-readiness-audit',
} as const;

export const tracking = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
} as const;

export type LeadPayload = {
  schoolName: string;
  contactName: string;
  role: string;
  phone: string;
  email: string;
  city: string;
  strength: string;
  board: string;
  source?: string;
};

/** Key used to hand the submitted form to the briefing page for prefill. */
export const LEAD_STORAGE_KEY = 'yz_lead';
