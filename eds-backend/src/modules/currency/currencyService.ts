import httpClient from "../../lib/httpClient";
import {
  ExchangeRateApiResponse,
  CurrencyData,
  CurrencyConversionResult,
} from "./types";

export const getCurrencyRates = async (
  base: string = "USD"
): Promise<CurrencyData> => {
  const apiKey = process.env.EXCHANGE_API_KEY;
  const baseUrl = process.env.EXCHANGE_API_BASE_URL;

  if (!apiKey || !baseUrl) {
    throw new Error("Exchange Rate API configuration missing");
  }

  const data = await httpClient.get<ExchangeRateApiResponse>(
    `${baseUrl}/${apiKey}/latest/${base}`
  );

  if (data.result !== "success") {
    throw new Error("Failed to fetch currency rates");
  }

  return {
    base: data.base_code,
    date: data.time_last_update_utc,
    rates: data.conversion_rates,
  };
};

export const convertCurrency = async (
  from: string,
  to: string,
  amount: number
): Promise<CurrencyConversionResult> => {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const rates = await getCurrencyRates(from);

  const rate = rates.rates[to];
  if (!rate) {
    throw new Error(`Unsupported target currency: ${to}`);
  }

  return {
    from,
    to,
    amount,
    rate,
    converted: Number((amount * rate).toFixed(2)),
  };
};
