import { env } from '$env/dynamic/private';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '');

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No Stripe signature', { status: 400 });
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set!');
    return new Response('Server misconfigured', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment berhasil!');
      console.log('Session ID:', session.id);
      console.log('Email:', session.customer_details?.email);
      console.log('Total:', session.amount_total ? session.amount_total / 100 : 0, 'SGD');
      break;
    }

    case 'checkout.session.expired': {
      console.log('Checkout session expired');
      break;
    }

    default: {
      console.log(`Event ${event.type} belum ditangani`);
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};