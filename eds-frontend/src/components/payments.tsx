"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import apiClient from "@/lib/apiClient";

export default function Payments({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState<number>(50); // minimum
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "processing" | "succeeded" | "failed"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    if (amount <= 0) {
      setStatus("failed");
      setMessage("Amount must be greater than zero");
      return;
    }

    setLoading(true);
    setStatus("processing");
    setMessage("Processing payment…");

    try {
      const intentRes = await apiClient.post("/payments/create-intent", {
        amount,
        currency: "php",
      });

      const clientSecret = intentRes.data.clientSecret;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        setStatus("failed");
        setMessage(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        setStatus("processing");
        setMessage("Payment succeeded! Finalizing…");

        setTimeout(async () => {
          await onSuccess();
          setStatus("succeeded");
          setMessage("Payment successful 🎉");
          setAmount(50);
          const cardElement = elements.getElement(CardElement);
          if (cardElement) cardElement.clear();
        }, 1000);
      }
    } catch (err: any) {
      setStatus("failed");
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Pay with Card</h2>

      {/* Amount input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount (PHP)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Card element */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Card details</label>
        <div className="border rounded p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#aab7c4" },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={loading || !stripe || status === "processing"}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium disabled:opacity-50"
      >
        {loading || status === "processing"
          ? "Processing…"
          : `Pay PHP ${amount}`}
      </button>

      {/* Status messages */}
      {status !== "idle" && message && (
        <p
          className={`mt-3 text-sm text-center ${
            status === "succeeded"
              ? "text-green-600"
              : status === "processing"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
