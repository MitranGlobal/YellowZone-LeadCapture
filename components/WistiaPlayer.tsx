'use client';

import { useEffect, useRef, useState } from 'react';
import { video } from '@/lib/config';

/**
 * Wistia embed.
 *
 * The scripts are injected by hand rather than through next/script because
 * the player loader must keep `type="module"`, and next/script does not
 * reliably preserve it — which is what stops the custom element from ever
 * defining itself, leaving a blurred placeholder and no video.
 *
 * If the custom element still has not defined itself a few seconds later
 * (blocked script, strict extension, old browser), we swap in Wistia's
 * plain iframe embed. The visitor always gets the video.
 */
export default function WistiaPlayer() {
  const id = video.mediaId;
  const hostRef = useRef<HTMLDivElement>(null);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    const sources = [
      { src: 'https://fast.wistia.com/player.js', module: false },
      { src: `https://fast.wistia.com/embed/${id}.js`, module: true },
    ];

    for (const s of sources) {
      if (document.querySelector(`script[src="${s.src}"]`)) continue;
      const el = document.createElement('script');
      el.src = s.src;
      el.async = true;
      if (s.module) el.type = 'module';
      document.head.appendChild(el);
    }

    // Give the loader a fair chance, then fall back.
    const timer = window.setTimeout(() => {
      if (!window.customElements?.get('wistia-player')) setUseIframe(true);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [id]);

  return (
    <div className="relative border border-gold/35 bg-ink-deep p-1.5 shadow-raised sm:p-2">
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <div ref={hostRef} className="absolute inset-0">
          {useIframe ? (
            <iframe
              src={`https://fast.wistia.net/embed/iframe/${id}?videoFoam=false`}
              title="Yellow Zone assessment briefing"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <wistia-player
              media-id={id}
              aspect={String(video.aspect)}
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
