import { site } from './config';

/**
 * Email delivery for lead and booking notifications.
 *
 * Resend is used when RESEND_API_KEY is set — REST only, no SDK dependency.
 * If it is not set we fall back to posting the same payload to
 * LEAD_WEBHOOK_URL (Zapier, Make, GoHighLevel), and if neither is configured
 * we log. A notification failure must never fail the visitor's request: they
 * have already booked, and showing them an error would be a lie.
 */

type NotifyArgs = {
  subject: string;
  /** Ordered label/value pairs rendered as a simple table. */
  rows: Array<[string, string]>;
  /** Raw payload forwarded to the webhook fallback. */
  payload: Record<string, unknown>;
};

function renderHtml(subject: string, rows: Array<[string, string]>): string {
  const cells = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:8px 14px;background:#FBF7EE;border:1px solid #e4dccb;font:600 12px/1.4 -apple-system,sans-serif;color:#0C3A66;white-space:nowrap">${label}</td>
           <td style="padding:8px 14px;border:1px solid #e4dccb;font:400 14px/1.5 -apple-system,sans-serif;color:#111">${value}</td>
         </tr>`,
    )
    .join('');

  return `<div style="background:#fff;padding:24px;max-width:640px">
      <h2 style="font:700 18px/1.3 Georgia,serif;color:#0C3A66;margin:0 0 16px">${subject}</h2>
      <table style="border-collapse:collapse;width:100%">${cells}</table>
      <p style="margin:18px 0 0;font:400 12px/1.5 -apple-system,sans-serif;color:#777">
        Sent from ${site.name}
      </p>
    </div>`;
}

export async function notify({ subject, rows, payload }: NotifyArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL ?? site.email;
  const from = process.env.NOTIFY_FROM ?? 'Yellow Zone <onboarding@resend.dev>';

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: to.split(',').map((address) => address.trim()),
          reply_to: typeof payload.email === 'string' ? payload.email : undefined,
          subject,
          html: renderHtml(subject, rows),
        }),
      });
      if (!res.ok) console.error('Resend rejected the email', res.status, await res.text());
      return;
    } catch (err) {
      console.error('Resend unreachable', err);
    }
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, ...payload }),
      });
      return;
    } catch (err) {
      console.error('Lead webhook unreachable', err);
    }
  }

  console.info(`[notify] ${subject}`, payload);
}
