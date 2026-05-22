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
      <h1 className="font-display text-headline-lg text-on-background mb-2">Ödeme</h1>
      <p className="text-body-md text-on-surface-variant mb-6">Rezervasyonunuzu tamamlamak için ödeme yapın.</p>

      {/* Ödeme Özeti */}
      <div className="bg-primary-fixed rounded-md p-5 mb-6 border border-primary/20">
        <h2 className="font-display text-headline-md text-on-primary-fixed mb-3">Rezervasyon Özeti</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-label-md text-on-primary-fixed/70">Öğrenci</span>
            <span className="font-semibold text-on-primary-fixed">{booking.studentName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label-md text-on-primary-fixed/70">Öğretmen</span>
            <span className="font-semibold text-on-primary-fixed">{booking.educatorName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label-md text-on-primary-fixed/70">Ders</span>
            <span className="font-semibold text-on-primary-fixed">{SUBJECT_LABELS[booking.subject] ?? booking.subject}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label-md text-on-primary-fixed/70">Tarih</span>
            <span className="font-semibold text-on-primary-fixed">{formattedDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label-md text-on-primary-fixed/70">Saat</span>
            <span className="font-semibold text-on-primary-fixed">{booking.slotStartTime} – {booking.slotEndTime}</span>
          </div>
          <div className="border-t border-primary/20 pt-3 mt-3 flex justify-between items-center">
            <span className="font-display font-semibold text-on-primary-fixed">Toplam</span>
            <span className="font-display text-headline-md text-on-primary-fixed">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* iyzico / Mock form */}
      <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 p-5">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-body-md text-on-surface-variant">Ödeme formu yükleniyor...</span>
          </div>
        )}
        {error && (
          <div className="text-on-error-container bg-error-container rounded-md p-4 text-body-md">{error}</div>
        )}
        {checkoutHtml && (
          <div dangerouslySetInnerHTML={{ __html: checkoutHtml }} />
        )}
      </div>
    </div>
  );
}
