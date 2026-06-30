import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total in pence (Stripe uses smallest currency unit)
    const amount = Math.round(
      cartItems.reduce((sum, item) => sum + item.price * item.qty * 100, 0)
    );

    if (amount < 50) {
      return Response.json({ error: "Amount too small" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      metadata: {
        itemCount: cartItems.length,
      },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
