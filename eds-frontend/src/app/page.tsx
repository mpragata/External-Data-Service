import CurrencyRates from "@/components/currencyRates";
import CurrencyConverter from "@/components/currencyConverter";
import Weather from "@/components/weather";

export default function Home() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">External Data Dashboard</h1>
      <Weather />
      <CurrencyRates />
      <CurrencyConverter />
    </main>
  );
}
