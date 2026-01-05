import { Db } from "mongodb";
import { stripe } from "../../lib/stripeClient";
import { CreatePaymentIntentInput, ZERO_DECIMAL_CURRENCIES } from "./types";
import { Request, Response } from "express";
import Stripe from "stripe";

export const createPaymentIntent = async ({
  amount,
  currency,
}: CreatePaymentIntentInput) => {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const finalAmount = ZERO_DECIMAL_CURRENCIES.includes(currency)
    ? amount
    : amount * 100;

  return stripe.paymentIntents.create({
    amount: finalAmount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const stripeSig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSig || !webhookSecret) {
    return res.status(400).send("Missing signature or webhook secret");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, stripeSig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  const db: Db = (global as any).db;
  const payments = db.collection("payments");

  try {
    // Prevent double-processing
    const existing = await payments.findOne({ rawEventId: event.id });
    if (existing) {
      console.log("Event already processed:", event.id);
      return res.status(200).send("Event already processed");
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        await payments.updateOne(
          { paymentIntentId: paymentIntent.id },
          {
            $set: {
              status: paymentIntent.status,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              livemode: paymentIntent.livemode,
              updatedAt: new Date(),
              rawEventId: event.id,
            },
            $setOnInsert: {
              provider: "stripe",
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
        break;

      case "payment_intent.payment_failed":
        console.log(`Payment failed: ${paymentIntent.id}`);
        await payments.updateOne(
          { paymentIntentId: paymentIntent.id },
          {
            $set: {
              status: paymentIntent.status,
              updatedAt: new Date(),
              rawEventId: event.id,
            },
            $setOnInsert: {
              provider: "stripe",
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error saving payment:", err);
    res.status(500).send("Internal Server Error");
  }
};
