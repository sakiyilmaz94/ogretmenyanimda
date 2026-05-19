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
        className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition"
      >
        Onayla
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={loading}
        className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition"
      >
        Reddet
      </button>
    </div>
  );
}
