export interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  conversion_rates: Record<string, number>;
}

export interface CurrencyData {
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
