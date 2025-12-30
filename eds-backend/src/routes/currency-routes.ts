import { Router } from "express";
import {
  convertCurrency,
  getCurrencyRates,
} from "../modules/currency/currencyService";

const router = Router();

router.get("/", async (req, res) => {
  const base = (req.query.base as string) || "USD";

  try {
    const rates = await getCurrencyRates(base);
    res.json(rates);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch currency rates",
    });
  }
});

router.get("/convert", async (req, res) => {
  const from = req.query.from as string;
  const to = req.query.to as string;
  const amount = Number(req.query.amount);

  if (!from || !to || isNaN(amount)) {
    return res.status(400).json({
      error: "from, to, and amount query are required",
    });
  }

  try {
    const result = await convertCurrency(from, to, amount);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
