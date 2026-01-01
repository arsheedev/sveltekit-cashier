import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover'
});

export async function POST({ request }) {
  const { cart } = await request.json();

  if (!cart || cart.length === 0) {
    return json({ error: 'Cart is empty' }, { status: 400 });
  }

  try {
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: 'sgd',
        product_data: {
          name: item.name,                    // Nama produk
          images: item.imageUrl ? [item.imageUrl] : []  // Gambar produk (wajib array)
        },
        unit_amount: Math.round(item.price * 100)  // Harga dalam cents
      },
      quantity: item.quantity                // Quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PUBLIC_BASE_URL}/menu`
    });

    return json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return json({ error: error.message || 'Payment failed' }, { status: 500 });
  }
}