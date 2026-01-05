export type SupportedCurrency =
  | "usd"
  | "eur"
  | "gbp"
  | "php"
  | "jpy"
  | "aud"
  | "cad"
  | "sgd"
  | "vnd";

export interface CreatePaymentIntentInput {
  amount: number;
  currency: SupportedCurrency;
}

export const ZERO_DECIMAL_CURRENCIES: SupportedCurrency[] = ["jpy", "vnd"];
