"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { CurrencyConversionResult } from "@/types/currency";

export default function CurrencyConverter() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState<CurrencyConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = async () => {
    setLoading(true);
    setError(null);

    if (!amount || amount <= 0) {
      setError("Amount must be greater than zero");
      setLoading(false);
      return;
    }

    if (!from || !to) {
      setError("Input currencies");
      setLoading(false);
      return;
    }

    if (from === to) {
      setError("Currencies must be different");
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.get<CurrencyConversionResult>(
        "/currency/convert",
        { params: { from, to, amount } }
      );
      setResult(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">Currency Converter</h2>

      <div className="flex gap-2 mb-2">
        <input
          className="border px-2 py-1 w-24"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <input
          className="border px-2 py-1 w-20"
          value={from}
          placeholder="USD"
          onChange={(e) => setFrom(e.target.value.toUpperCase())}
        />
        <label className="px-2 py-1 w-10">To</label>
        <input
          className="border px-2 py-1 w-20"
          placeholder="PHP"
          value={to}
          onChange={(e) => setTo(e.target.value.toUpperCase())}
        />
        <button className="bg-black text-white px-3 py-1" onClick={convert}>
          Convert
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <p className="mt-2">
          {result.amount} {result.from} = <strong>{result.converted}</strong>{" "}
          {result.to}
        </p>
      )}
    </div>
  );
}
