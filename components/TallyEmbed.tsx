'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tally } from '@/lib/config';

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

/**
 * Tally embed: application questions and appointment slot in one form.
 *
 * Tally's own script handles the dynamic height, so the iframe carries
 * `data-tally-src` rather than `src` and the script fills it in. If the script
 * fails to load we set `src` ourselves after a moment, so the form still
 * appears — it just stops auto-resizing.
 *
 * We also listen for Tally's submit message to fire the conversion pixels and
 * move the visitor to the thank-you page.
 */
export default function TallyEmbed() {
  const router = useRouter();

  useEffect(() => {
    const src = 'https://tally.so/widgets/embed.js';

    const ensureLoaded = () => {
      if (window.Tally) {
        window.Tally.loadEmbeds();
        return;
      }
      // Script blocked or still loading: fall back to a plain iframe src.
      document
        .querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]:not([src])')
        .forEach((el) => {
          el.src = el.dataset.tallySrc as string;
        });
    };

    if (document.querySelector(`script[src="${src}"]`)) {
      ensureLoaded();
    } else {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = ensureLoaded;
      script.onerror = ensureLoaded;
      document.body.appendChild(script);
    }

    const timer = window.setTimeout(ensureLoaded, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.origin !== 'string' || !e.origin.includes('tally.so')) return;

      // Tally sends its payload as a JSON string.
      let event: string | undefined;
      try {
        const data =
          typeof e.data === 'string' ? JSON.parse(e.data) : (e.data as { event?: string });
        event = data?.event;
      } catch {
        return;
      }
      if (event !== 'Tally.FormSubmitted') return;

      const w = window as unknown as {
        dataLayer?: unknown[];
        fbq?: (...args: unknown[]) => void;
      };
      w.dataLayer?.push({ event: 'application_submitted' });
      w.fbq?.('track', 'Schedule');

      router.push('/thank-you');
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [router]);

  return (
    <iframe
      data-tally-src={tally.src}
      loading="lazy"
      width="100%"
      height="500"
      title="Apply for a campus readiness audit"
      className="w-full border-0 bg-transparent"
    />
  );
}
