export interface CurrencyRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CurrencyConversionResult {
  from: string;
  to: string;
  amount: number;
  rate: number;
  converted: number;
}
