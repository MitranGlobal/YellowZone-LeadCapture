'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useLightbox } from '@/lib/store';
import { offer } from '@/lib/config';

const ROLES = [
  'Principal',
  'Correspondent / Trustee',
  'Director / Chairperson',
  'Vice Principal / Head of School',
  'Counsellor / Wellbeing Lead',
  'Other',
];

const BOARDS = ['CBSE', 'ICSE / ISC', 'State Board', 'IB / Cambridge', 'Other'];

const STRENGTH = [
  'Under 300',
  '300 – 800',
  '800 – 1,500',
  '1,500 – 3,000',
  'Over 3,000',
];

type Errors = Partial<Record<string, string>>;

export default function LeadModal() {
  const { isOpen, close, source, markSubmitted } = useLightbox();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});

  // Escape to close, and lock the page behind the lightbox.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;

    const next: Errors = {};
    if (!data.schoolName?.trim()) next.schoolName = 'Enter your school’s name.';
    if (!data.contactName?.trim()) next.contactName = 'Enter your name.';
    if (!/^[6-9]\d{9}$/.test((data.phone ?? '').replace(/\D/g, '').slice(-10)))
      next.phone = 'Enter a 10-digit Indian mobile number.';
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? ''))
      next.email = 'Enter a working email address.';
    if (!data.city?.trim()) next.city = 'Enter your city.';

    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source }),
      });
      if (!res.ok) throw new Error('lead-failed');

      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        w.dataLayer?.push({ event: 'lead_submitted', lead_source: source });
        w.fbq?.('track', 'Lead');
      }

      markSubmitted();
      router.push('/briefing');
    } catch {
      setStatus('error');
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-title"
        >
          <div
            className="fixed inset-0 bg-ink-deep/80 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <div className="relative flex min-h-full items-start justify-center p-4 py-10 sm:py-16">
            <motion.div
              ref={panelRef}
              className="relative w-full max-w-xl border border-gold/40 bg-parchment shadow-raised"
              initial={{ y: 26, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/60 transition hover:border-ink/50 hover:text-ink"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                  <path
                    d="M4 4l16 16M20 4L4 20"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="border-b border-ink/10 bg-ink px-6 py-6 text-white sm:px-8">
                <p className="eyebrow text-gold">
                  Step 1 of 2 · Campus details
                </p>
                <h2
                  id="lead-title"
                  className="mt-3 font-display text-[1.5rem] leading-tight sm:text-[1.75rem]"
                >
                  Tell us about your campus
                </h2>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-white/70">
                  This takes under a minute. You will go straight to the{' '}
                  {offer.briefingMinutes}-minute assessment briefing, then
                  decide whether to book the {offer.name.toLowerCase()}.
                </p>
              </div>

              <form onSubmit={onSubmit} className="px-6 py-6 sm:px-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="School name"
                    name="schoolName"
                    placeholder="Vidya Mandir Senior Secondary"
                    error={errors.schoolName}
                    span
                  />
                  <Field
                    label="Your name"
                    name="contactName"
                    placeholder="Full name"
                    error={errors.contactName}
                  />
                  <Select label="Your role" name="role" options={ROLES} />
                  <Field
                    label="WhatsApp number"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile"
                    error={errors.phone}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="name@school.edu.in"
                    error={errors.email}
                  />
                  <Field
                    label="City"
                    name="city"
                    placeholder="Chennai"
                    error={errors.city}
                  />
                  <Select
                    label="Students on roll"
                    name="strength"
                    options={STRENGTH}
                  />
                  <Select label="Board" name="board" options={BOARDS} span />
                </div>

                {status === 'error' ? (
                  <p className="mt-4 border-l-2 border-gold-deep bg-gold/10 px-3 py-2 text-[0.88rem] text-ink">
                    That did not go through. Check your connection and send it
                    again — or WhatsApp us and we will take the details
                    directly.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'sending'
                    ? 'Sending…'
                    : 'Watch the assessment briefing'}
                </button>

                <p className="mt-3 text-center font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">
                  No payment at this step
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  label,
  name,
  error,
  span,
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
  span?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={span ? 'sm:col-span-2' : undefined}>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="field"
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[0.78rem] text-gold-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  span,
}: {
  label: string;
  name: string;
  options: string[];
  span?: boolean;
}) {
  return (
    <div className={span ? 'sm:col-span-2' : undefined}>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} className="field" defaultValue={options[0]}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
