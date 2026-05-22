"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingStatusActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handle(action: "approve" | "reject") {
    setLoading(true);
    await fetch(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("approve")}
        disabled={loading}
        className="rounded-full bg-secondary-container text-on-secondary-container px-4 py-1.5 text-label-md hover:opacity-90 disabled:opacity-50 transition"
      >
        Onayla
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={loading}
        className="rounded-full bg-error-container text-on-error-container px-4 py-1.5 text-label-md hover:opacity-90 transition"
      >
        Reddet
      </button>
    </div>
  );
}
