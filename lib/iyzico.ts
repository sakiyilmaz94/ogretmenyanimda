// iyzico Checkout Form entegrasyonu
// API key geldiğinde .env.local'a IYZICO_API_KEY ve IYZICO_SECRET_KEY ekleyin.
// Key olmadığında mock mod otomatik devreye girer.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

export const IYZICO_ENABLED =
  !!process.env.IYZICO_API_KEY && !!process.env.IYZICO_SECRET_KEY;

export function getIyzipay() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY ?? "mock",
    secretKey: process.env.IYZICO_SECRET_KEY ?? "mock",
    uri: process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com",
  });
}

export interface CheckoutRequest {
  bookingId: string;
  amount: number;           // TRY, kuruş değil (örn: 350.00)
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerIp: string;
  studentName: string;
  educatorName: string;
  callbackUrl: string;      // ödeme sonrası yönlenecek URL
}

export interface CheckoutResult {
  success: boolean;
  checkoutFormContent?: string;  // iyzico'nun iframe HTML'i
  token?: string;                // işlem token'ı
  mockMode?: boolean;            // test modunda mı
  error?: string;
}

export async function initCheckoutForm(req: CheckoutRequest): Promise<CheckoutResult> {
  if (!IYZICO_ENABLED) {
    // Mock mod: API key olmadan geliştirme
    return {
      success: true,
      mockMode: true,
      token: `mock_${req.bookingId}_${Date.now()}`,
      checkoutFormContent: buildMockForm(req),
    };
  }

  const iyzipay = getIyzipay();

  const request = {
    locale: "tr",
    conversationId: req.bookingId,
    price: req.amount.toFixed(2),
    paidPrice: req.amount.toFixed(2),
    currency: "TRY",
    basketId: req.bookingId,
    paymentGroup: "SERVICE",
    callbackUrl: req.callbackUrl,
    enabledInstallments: [1, 2, 3, 6],
    buyer: {
      id: req.bookingId,
      name: req.buyerName,
      surname: req.buyerSurname,
      email: req.buyerEmail,
      identityNumber: "11111111111",
      registrationAddress: "Türkiye",
      ip: req.buyerIp,
      city: "Istanbul",
      country: "Turkey",
      gsmNumber: req.buyerPhone || "+905000000000",
    },
    shippingAddress: {
      contactName: `${req.buyerName} ${req.buyerSurname}`,
      city: "Istanbul",
      country: "Turkey",
      address: "Online Hizmet",
    },
    billingAddress: {
      contactName: `${req.buyerName} ${req.buyerSurname}`,
      city: "Istanbul",
      country: "Turkey",
      address: "Online Hizmet",
    },
    basketItems: [
      {
        id: req.bookingId,
        name: `${req.studentName} - ${req.educatorName} Özel Ders`,
        category1: "Eğitim",
        itemType: "VIRTUAL",
        price: req.amount.toFixed(2),
      },
    ],
  };

  return new Promise((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (err: Error, result: Record<string, string>) => {
      if (err || result.status !== "success") {
        resolve({
          success: false,
          error: result?.errorMessage ?? err?.message ?? "Ödeme başlatılamadı.",
        });
        return;
      }
      resolve({
        success: true,
        token: result.token,
        checkoutFormContent: result.checkoutFormContent,
      });
    });
  });
}

export interface CallbackResult {
  success: boolean;
  bookingId?: string;
  paymentId?: string;
  installment?: number;
  mockMode?: boolean;
  error?: string;
}

export async function retrieveCheckoutForm(token: string): Promise<CallbackResult> {
  if (!IYZICO_ENABLED || token.startsWith("mock_")) {
    const bookingId = token.replace("mock_", "").split("_")[0];
    return { success: true, mockMode: true, bookingId, paymentId: token };
  }

  const iyzipay = getIyzipay();

  return new Promise((resolve) => {
    iyzipay.checkoutForm.retrieve({ token }, (err: Error, result: Record<string, string>) => {
      if (err || result.status !== "success" || result.paymentStatus !== "SUCCESS") {
        resolve({
          success: false,
          error: result?.errorMessage ?? err?.message ?? "Ödeme doğrulanamadı.",
        });
        return;
      }
      resolve({
        success: true,
        bookingId: result.basketId,
        paymentId: result.paymentId,
        installment: parseInt(result.installment ?? "1"),
      });
    });
  });
}

function buildMockForm(req: CheckoutRequest): string {
  return `
    <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:24px;border:2px dashed #6366f1;border-radius:12px;background:#f8f7ff">
      <div style="text-align:center;margin-bottom:16px">
        <span style="background:#6366f1;color:white;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">
          🧪 MOCK ÖDEME MODU — Gerçek para çekilmez
        </span>
      </div>
      <h3 style="color:#1e1b4b;margin:0 0 16px">Ödeme Özeti</h3>
      <div style="background:white;border-radius:8px;padding:12px;margin-bottom:16px;font-size:14px">
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb">
          <span style="color:#6b7280">Öğrenci</span>
          <strong>${req.studentName}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb">
          <span style="color:#6b7280">Eğitmen</span>
          <strong>${req.educatorName}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0">
          <span style="color:#6b7280">Tutar</span>
          <strong style="color:#059669">₺${req.amount.toFixed(2)}</strong>
        </div>
      </div>
      <form method="POST" action="${req.callbackUrl}">
        <input type="hidden" name="token" value="mock_${req.bookingId}_${Date.now()}" />
        <input type="hidden" name="status" value="success" />
        <button type="submit" style="width:100%;background:#6366f1;color:white;border:none;padding:14px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer">
          ✅ Ödemeyi Onayla (Test)
        </button>
      </form>
      <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:12px">
        iyzico API key eklendiğinde gerçek ödeme formu görünür
      </p>
    </div>
  `;
}
