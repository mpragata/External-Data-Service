// routes/paymentWebhook-routes.ts
import { Router } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripeClient";
import { Db } from "mongodb";
import express from "express";

const router = Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res
        .status(400)
        .send("Webhook signature missing or secret not set");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      //console.log("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const db: Db = (global as any).db;
    const payments = db.collection("payments");
    //console.log("Webhook hit!", req.headers["stripe-signature"]);
    // Check if event already processed
    const existing = await payments.findOne({ rawEventId: event.id });
    if (existing) {
      return res.status(200).send("Event already processed");
    }

    // Handle events
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // console.log(
    //   "Received Stripe event:",
    //   event.type,
    //   "for paymentIntentId:",
    //   paymentIntent.id
    // );

    if (
      [
        "payment_intent.created",
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
      ].includes(event.type)
    ) {
      await payments.updateOne(
        { paymentIntentId: paymentIntent.id },
        {
          $set: {
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            updatedAt: new Date(),
            rawEventId: event.id,
            livemode: paymentIntent.livemode,
          },
          $setOnInsert: {
            createdAt: new Date(),
            provider: "stripe",
          },
        },
        { upsert: true }
      );
    }

    res.json({ received: true });
  }
);

export default router;
