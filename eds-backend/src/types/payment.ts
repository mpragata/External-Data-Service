export interface Payment {
  _id?: string;
  paymentIntentId: string; // Stripe PaymentIntent ID
  chargeId?: string; // Stripe Charge ID
  amount: number;
  currency: string;
  status: "created" | "succeeded" | "failed" | "refunded";
  //userId?: string; // optional if you have users
  provider: "stripe";
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
  rawEventId: string; // Stripe event ID
}
