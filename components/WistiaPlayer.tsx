'use client';

import Script from 'next/script';
import { video } from '@/lib/config';

// The <wistia-player> custom element is not in React's JSX namespace.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'media-id'?: string;
        aspect?: string;
      };
    }
  }
}

export default function WistiaPlayer() {
  const id = video.mediaId;

  return (
    <>
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script
        src={`https://fast.wistia.com/embed/${id}.js`}
        strategy="afterInteractive"
        type="module"
      />
      <style>{`
        wistia-player[media-id='${id}']:not(:defined) {
          background: center / contain no-repeat
            url('https://fast.wistia.com/embed/medias/${id}/swatch');
          display: block;
          filter: blur(5px);
          padding-top: 56.25%;
        }
      `}</style>

      <div className="relative border border-gold/35 bg-ink-deep p-1.5 shadow-raised sm:p-2">
        <wistia-player media-id={id} aspect={String(video.aspect)} />
      </div>
    </>
  );
}
