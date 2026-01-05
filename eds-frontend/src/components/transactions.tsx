"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

type Transaction = {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};

export default function Transactions(refreshKey: { refreshKey: number }) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get("/payments/transactions");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  return (
    <div className="bg-white border rounded-lg shadow p-6 h-80 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 ">Recent Transactions</h2>

      {loading && <p className="text-sm">Loading…</p>}

      {!loading && data.length === 0 && (
        <p className="text-sm text-gray-500">No transactions yet</p>
      )}

      <ul className="space-y-3">
        {data.map((tx) => (
          <li
            key={tx._id}
            className="flex justify-between items-center border-b pb-2 text-sm"
          >
            <div>
              <p className="font-medium">PHP {tx.amount / 100}</p>
              <p className="text-gray-500">
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>

            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                tx.status === "succeeded"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {tx.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
