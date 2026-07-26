"use client";

import { useState } from "react";
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
  referenceCode: string;
  bank: { iban: string; accountName: string; bankName: string };
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* kopyalama desteklenmiyor */
    }
  }
  return (
    <button
      onClick={copy}
      className="shrink-0 rounded-full squishy-btn bg-secondary-container text-on-secondary-container px-4 py-2 text-label-md font-semibold"
    >
      {copied ? "Kopyalandı ✓" : "Kopyala"}
    </button>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <p className="font-semibold text-on-surface break-all">{value}</p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

export default function PaymentPage({ booking }: { booking: BookingData }) {
  const { bank } = booking;
  const hasBank = bank.iban.trim().length > 0;

  const formattedDate = new Date(booking.slotDate + "T00:00:00").toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="font-display text-headline-lg text-on-background mb-2">Ödeme</h1>
      <p className="text-body-md text-on-surface-variant mb-6">
        Rezervasyonunuzu kesinleştirmek için aşağıdaki IBAN&apos;a havale/EFT yapın.
      </p>

      {/* Rezervasyon Özeti */}
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
            <span className="font-display font-semibold text-on-primary-fixed">Ödenecek Tutar</span>
            <span className="font-display text-headline-md text-on-primary-fixed">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Havale Bilgileri */}
      {hasBank ? (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 p-5">
          <h2 className="font-display text-headline-md text-on-surface mb-1">Havale / EFT Bilgileri</h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            Aşağıdaki bilgilerle ödemeyi yapın ve <strong>açıklama kısmına referans kodunuzu</strong> mutlaka yazın.
          </p>

          <div className="divide-y divide-outline-variant/20">
            <CopyRow label="Alıcı Adı" value={bank.accountName} />
            {bank.bankName && <CopyRow label="Banka" value={bank.bankName} />}
            <CopyRow label="IBAN" value={bank.iban} />
            <CopyRow label="Tutar" value={formatCurrency(booking.totalPrice)} />
          </div>

          {/* Referans kodu vurgulu */}
          <div className="mt-5 bg-tertiary-fixed rounded-md p-4 border border-primary/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-label-md text-on-tertiary-fixed/80">Açıklamaya yazılacak Referans Kodu</p>
                <p className="font-display text-headline-md text-on-tertiary-fixed tracking-wide">
                  {booking.referenceCode || "—"}
                </p>
              </div>
              {booking.referenceCode && <CopyButton value={booking.referenceCode} />}
            </div>
          </div>

          <div className="mt-5 bg-surface-container rounded-md p-4 text-body-md text-on-surface-variant">
            <p className="font-semibold text-on-surface mb-1">Ödemeniz nasıl onaylanır?</p>
            <p>
              Havaleyi yaptıktan sonra ekstra bir işlem yapmanıza gerek yok. Ödemeniz kontrol edilip
              onaylandığında randevunuz otomatik olarak kesinleşecek ve size bildirim gelecektir.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-error-container text-on-error-container rounded-md p-5">
          <p className="font-display font-semibold mb-1">IBAN bilgisi henüz tanımlanmadı.</p>
          <p className="text-body-md">Lütfen yöneticiyle iletişime geçin. Ödeme bilgileri en kısa sürede tanımlanacaktır.</p>
        </div>
      )}
    </div>
  );
}
