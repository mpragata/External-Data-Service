import Weather from "@/components/weather";
import CurrencyRates from "@/components/currencyRates";
import CurrencyConverter from "@/components/currencyConverter";
import Payments from "@/components/payments";
import StripeProvider from "@/app/providers/stripeProvider";
import PaymentsSection from "@/components/paymentsSection";

export default function Home() {
  return (
    <StripeProvider>
      <main className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">
          External Data Dashboard (Stripe, OpenWeatherAPI, ExchangeAPI)
        </h1>
        <Weather />
        <CurrencyRates />
        <CurrencyConverter />
        <PaymentsSection />
      </main>
    </StripeProvider>
  );
}
