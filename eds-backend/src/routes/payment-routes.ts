import { Router } from "express";
import { createPaymentIntent } from "../modules/payments/paymentService";
import { SupportedCurrency } from "../modules/payments/types";
import { Db } from "mongodb";

const router = Router();

router.post("/create-intent", async (req, res) => {
  const { amount, currency } = req.body as {
    amount: number;
    currency: SupportedCurrency;
  };

  try {
    const paymentIntent = await createPaymentIntent({ amount, currency });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const db: Db = (global as any).db;
    const payments = db.collection("payments");

    const transactions = await payments
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    res.json(transactions);
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default router;
