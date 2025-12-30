"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import type { CurrencyRates } from "@/types/currency";

export default function CurrencyRates() {
  const [base, setBase] = useState("");
  const [data, setData] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);

    if (!base) {
      setError("Please Input a Base Currency");
      setLoading(false);
      return;
    }
    try {
      const res = await apiClient.get<CurrencyRates>("/currency", {
        params: { base },
      });
      setData(res.data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to fetch currency rates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-semibold mb-2">Currency Rates</h2>

      <div className="flex gap-2 mb-2">
        <input
          className="border px-2 py-1"
          value={base}
          onChange={(e) => setBase(e.target.value.toUpperCase())}
          placeholder="PHP"
        />
        <button className="bg-black text-white px-3 py-1" onClick={fetchRates}>
          Fetch
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="mt-2 text-sm">
          <p className="mb-1">
            Base: <strong>{data.base}</strong>
          </p>

          <ul className="max-h-80 overflow-auto border p-2 text-sm">
            <li key={data.base}>{data.base}: 1</li>
            {Object.entries(data.rates)
              .filter(([code]) => code !== data.base)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([code, rate]) => (
                <li key={code}>
                  {code}: {rate}
                </li>
              ))}
          </ul>
          {lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
