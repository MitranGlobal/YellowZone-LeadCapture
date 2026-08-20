import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Receives the campus details captured in the lightbox and forwards them to
 * whatever CRM the team is using. Set LEAD_WEBHOOK_URL to a GoHighLevel /
 * Zapier / Make inbound webhook. Without it the lead is still accepted and
 * logged so the funnel never blocks on integration work.
 */
export async function POST(request: Request) {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const required = ['schoolName', 'contactName', 'phone', 'email', 'city'];
  const missing = required.filter((k) => !body[k]?.trim());
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing: ${missing.join(', ')}` },
      { status: 422 },
    );
  }

  const lead = {
    ...body,
    phone: body.phone.replace(/\D/g, '').slice(-10),
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? '',
    referer: request.headers.get('referer') ?? '',
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        console.error('Lead webhook rejected the lead', res.status);
      }
    } catch (err) {
      // Never fail the visitor's submission because a downstream tool is down.
      console.error('Lead webhook unreachable', err);
    }
  } else {
    console.info('Lead captured (no LEAD_WEBHOOK_URL configured)', lead);
  }

  return NextResponse.json({ ok: true });
}
