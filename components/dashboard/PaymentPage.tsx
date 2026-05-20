"use client";

import { useEffect, useState } from "react";
import { SUBJECT_LABELS, formatCurrency } from "@/lib/utils";
import { Subject } from "@prisma/client";

interface BookingData {
  bookingId: string;
  studentName: string;
  educatorName: string;
  subject: Subject;
  slotDate: string;
  slotStartTime: string;
  slotEndTime: string;
  totalPrice: number;
}

export default function PaymentPage({ booking }: { booking: BookingData }) {
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCheckout() {
      try {
        const res = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking.bookingId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Ödeme formu yüklenemedi.");
          return;
        }
        setCheckoutHtml(data.checkoutFormContent);
      } catch {
        setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    }
    loadCheckout();
  }, [booking.bookingId]);

  const formattedDate = new Date(booking.slotDate + "T00:00:00").toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme</h1>
      <p className="text-gray-500 mb-6">Rezervasyonunuzu tamamlamak için ödeme yapın.</p>

      {/* Özet */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Rezervasyon Özeti</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Öğrenci</span>
            <span className="font-medium">{booking.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Öğretmen</span>
            <span className="font-medium">{booking.educatorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ders</span>
            <span className="font-medium">{SUBJECT_LABELS[booking.subject] ?? booking.subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tarih</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Saat</span>
            <span className="font-medium">{booking.slotStartTime} – {booking.slotEndTime}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Toplam</span>
            <span className="font-bold text-blue-600 text-base">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* iyzico / Mock form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-500">Ödeme formu yükleniyor...</span>
          </div>
        )}
        {error && (
          <div className="text-red-500 bg-red-50 rounded-lg p-4 text-sm">{error}</div>
        )}
        {checkoutHtml && (
          <div dangerouslySetInnerHTML={{ __html: checkoutHtml }} />
        )}
      </div>
    </div>
  );
}
