/**
 * paymentService.test.ts
 *
 * Unit tests for Stripe payment service
 */

jest.mock("../../lib/stripeClient", () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn(),
    },
  },
}));

import { createPaymentIntent } from "./paymentService";
import { stripe } from "../../lib/stripeClient";

describe("createPaymentIntent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws error if amount is zero or negative", async () => {
    await expect(
      createPaymentIntent({ amount: 0, currency: "usd" })
    ).rejects.toThrow("Amount must be greater than zero");

    await expect(
      createPaymentIntent({ amount: -10, currency: "usd" })
    ).rejects.toThrow("Amount must be greater than zero");
  });

  it("creates payment intent with cents for non-zero-decimal currencies", async () => {
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      client_secret: "secret_123",
    });

    const result = await createPaymentIntent({
      amount: 100,
      currency: "usd",
    });

    expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
      amount: 100 * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    expect(result.client_secret).toBe("secret_123");
  });

  it("does NOT multiply amount for zero-decimal currencies (JPY)", async () => {
    (stripe.paymentIntents.create as jest.Mock).mockResolvedValue({
      client_secret: "secret_jpy",
    });

    await createPaymentIntent({
      amount: 5000,
      currency: "jpy",
    });

    expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
      amount: 5000,
      currency: "jpy",
      automatic_payment_methods: { enabled: true },
    });
  });
});
