'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { offer, payment, site } from '@/lib/config';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function PayButton({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');
  const router = useRouter();

  async function pay() {
    // No gateway keys configured yet: send them to the hosted payment link
    // so the funnel keeps working while Razorpay is being set up.
    if (!payment.razorpayKeyId) {
      if (payment.fallbackLink) {
        window.location.href = payment.fallbackLink;
        return;
      }
      setStatus('error');
      return;
    }

    setStatus('working');
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error('sdk');

      const res = await fetch('/api/payment/order', { method: 'POST' });
      if (!res.ok) throw new Error('order');
      const order = await res.json();

      const rzp = new window.Razorpay({
        key: payment.razorpayKeyId,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: site.org,
        description: offer.name,
        image: '/seal.png',
        theme: { color: '#0C3A66' },
        handler: async (response: Record<string, string>) => {
          await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const w = window as any;
            w.dataLayer?.push({ event: 'purchase', value: offer.price });
            w.fbq?.('track', 'Purchase', {
              value: offer.price,
              currency: 'INR',
            });
          }
          router.push('/thank-you');
        },
        modal: { ondismiss: () => setStatus('idle') },
      });

      rzp.open();
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={pay}
        disabled={status === 'working'}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === 'working'
          ? 'Opening checkout…'
          : (children ?? `Book the audit — ${offer.priceLabel}`)}
      </button>

      {status === 'error' ? (
        <p className="mt-3 text-[0.85rem] text-white/70">
          Checkout could not open. WhatsApp us on{' '}
          <a href={site.whatsapp} className="text-gold underline">
            {site.phone}
          </a>{' '}
          and we will book your slot directly.
        </p>
      ) : null}
    </div>
  );
}
