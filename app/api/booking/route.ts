import { NextResponse } from 'next/server';
import { notify } from '@/lib/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Called by the Calendly embed once an appointment is confirmed. Sends one
 * email containing both the form answers and the booking reference, so the
 * appointment does not arrive divorced from the school's details.
 */
export async function POST(request: Request) {
  let body: { lead?: Record<string, string>; eventUri?: string; inviteeUri?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const lead = body.lead ?? {};

  await notify({
    subject: `Audit booked — ${lead.schoolName || 'Unknown school'}`,
    rows: [
      ['School', lead.schoolName ?? ''],
      ['Contact', lead.contactName ?? ''],
      ['Role', lead.role ?? ''],
      ['Phone', lead.phone ?? ''],
      ['Email', lead.email ?? ''],
      ['City', lead.city ?? ''],
      ['Students', lead.strength ?? ''],
      ['Board', lead.board ?? ''],
      ['Booking', body.inviteeUri ?? body.eventUri ?? 'See Calendly'],
      ['Booked at', new Date().toISOString()],
    ],
    payload: { ...lead, type: 'booking', eventUri: body.eventUri, inviteeUri: body.inviteeUri },
  });

  return NextResponse.json({ ok: true });
}
