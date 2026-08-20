import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verifies the Razorpay checkout signature server-side before the booking
 * is treated as paid. Never trust the browser's word for a payment.
 */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields.' }, { status: 422 });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(razorpay_signature),
    );

  if (!valid) {
    return NextResponse.json({ error: 'Signature mismatch.' }, { status: 400 });
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          paidAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Booking webhook unreachable', err);
    }
  }

  return NextResponse.json({ ok: true });
}
