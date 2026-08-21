'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calendly, LEAD_STORAGE_KEY } from '@/lib/config';

type Lead = Record<string, string>;

/**
 * Calendly inline embed.
 *
 * Two jobs beyond showing the calendar:
 *
 * 1. Prefill. The lightbox already collected the school's details, so asking
 *    again here would lose bookings. Name and email prefill Calendly's own
 *    fields; the school details ride along as a custom answer (a1) so the
 *    booking is legible on its own in your Calendly inbox.
 *
 * 2. Confirmation. Calendly posts a `calendly.event_scheduled` message to the
 *    parent window once someone books. We catch it, send the form answers and
 *    the booking reference to /api/booking as one combined email, and move the
 *    visitor to the thank-you page. Without this the form data and the
 *    appointment would arrive as two unrelated emails.
 */
export default function CalendlyEmbed() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const booked = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LEAD_STORAGE_KEY);
      if (raw) setLead(JSON.parse(raw));
    } catch {
      // Private mode or cleared storage — the calendar still works unprefilled.
    }
  }, []);

  // Build the widget URL once we know whether we have a lead to prefill with.
  useEffect(() => {
    const url = new URL(calendly.url);
    url.searchParams.set('hide_gdpr_banner', '1');
    url.searchParams.set('primary_color', 'E8A317');

    if (lead) {
      if (lead.contactName) url.searchParams.set('name', lead.contactName);
      if (lead.email) url.searchParams.set('email', lead.email);
      const detail = [lead.schoolName, lead.city, lead.role, lead.strength]
        .filter(Boolean)
        .join(' · ');
      if (detail) url.searchParams.set('a1', detail);
    }

    const node = containerRef.current;
    if (node) node.dataset.url = url.toString();

    const src = 'https://assets.calendly.com/assets/external/widget.js';
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Script already present (client-side nav): ask it to render again.
      (window as unknown as { Calendly?: { initInlineWidgets: () => void } })
        .Calendly?.initInlineWidgets();
    }
  }, [lead]);

  // Listen for the booking confirmation.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.origin !== 'string' || !e.origin.includes('calendly.com')) return;
      const data = e.data as { event?: string; payload?: Record<string, unknown> };
      if (data?.event !== 'calendly.event_scheduled' || booked.current) return;

      booked.current = true;

      const payload = data.payload ?? {};
      fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: lead ?? {},
          eventUri: (payload.event as { uri?: string })?.uri ?? '',
          inviteeUri: (payload.invitee as { uri?: string })?.uri ?? '',
        }),
      }).catch(() => {
        // The appointment is already booked in Calendly; never block on this.
      });

      const w = window as unknown as {
        dataLayer?: unknown[];
        fbq?: (...args: unknown[]) => void;
      };
      w.dataLayer?.push({ event: 'appointment_booked' });
      w.fbq?.('track', 'Schedule');

      router.push('/thank-you');
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [lead, router]);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget w-full overflow-hidden rounded-sm bg-white"
      style={{ minWidth: '320px', height: '700px' }}
      data-url={calendly.url}
    />
  );
}
