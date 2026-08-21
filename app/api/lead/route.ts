import { NextResponse } from 'next/server';
import { notify } from '@/lib/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Receives the campus details captured in the lightbox and emails them
 * straight away, so a school that watches the video but never books is still
 * a lead you can follow up. A second, richer email follows from /api/booking
 * if they do book.
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
    return NextResponse.json({ error: `Missing: ${missing.join(', ')}` }, { status: 422 });
  }

  const lead: Record<string, string> = {
    ...body,
    phone: body.phone.replace(/\D/g, '').slice(-10),
    submittedAt: new Date().toISOString(),
    referer: request.headers.get('referer') ?? '',
  };

  await notify({
    subject: `New enquiry — ${lead.schoolName}`,
    rows: [
      ['School', lead.schoolName],
      ['Contact', lead.contactName],
      ['Role', lead.role ?? ''],
      ['Phone', lead.phone],
      ['Email', lead.email],
      ['City', lead.city],
      ['Students', lead.strength ?? ''],
      ['Board', lead.board ?? ''],
      ['Came from', lead.source ?? ''],
    ],
    payload: { ...lead, type: 'lead' },
  });

  return NextResponse.json({ ok: true });
}
