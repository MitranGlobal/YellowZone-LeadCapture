import { NextResponse } from 'next/server';
import { offer } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Creates a Razorpay order. Talks to the REST API directly so the project
 * carries no extra SDK. Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.
 */
export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Payment gateway is not configured.' },
      { status: 503 },
    );
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: offer.price * 100, // paise
        currency: 'INR',
        receipt: `yz_${Date.now()}`,
        notes: { product: offer.name, cohort: offer.cohortName },
      }),
    });

    if (!res.ok) {
      console.error('Razorpay order failed', res.status, await res.text());
      return NextResponse.json({ error: 'Could not create order.' }, { status: 502 });
    }

    const order = await res.json();
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Razorpay unreachable', err);
    return NextResponse.json({ error: 'Could not create order.' }, { status: 502 });
  }
}
