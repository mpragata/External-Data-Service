"use client";

import { useState } from "react";
import Payments from "./payments";
import Transactions from "./transactions";

export default function PaymentsSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Payments onSuccess={() => setRefreshKey((k) => k + 1)} />
      <Transactions refreshKey={refreshKey} />
    </div>
  );
}
