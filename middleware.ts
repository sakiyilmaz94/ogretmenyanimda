import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = [
  "/", "/login", "/register",
  "/hizmetler", "/fiyatlandirma", "/hakkimizda", "/sss", "/iletisim",
  "/egitmenlerimiz", "/egitmen-basvurusu", "/dersler",
  "/gizlilik-politikasi", "/mesafeli-satis-sozlesmesi", "/iptal-ve-iade-kosullar",
  "/admin-giris",
  "/api/payments/callback",
  "/api/curriculum/topics",
  "/api/curriculum/subjects",
];
const AUTH_ROUTES = ["/login", "/register"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isPublicRoute = PUBLIC_ROUTES.some((r) => nextUrl.pathname === r || nextUrl.pathname.startsWith(r + "/"));
  const isAuthRoute = AUTH_ROUTES.some((r) => nextUrl.pathname.startsWith(r));

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(getDashboardUrl(role), nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardUrl(role), nextUrl));
  }

  if (isLoggedIn && nextUrl.pathname.startsWith("/educator") && role !== "EDUCATOR") {
    return NextResponse.redirect(new URL(getDashboardUrl(role), nextUrl));
  }

  if (isLoggedIn && nextUrl.pathname.startsWith("/parent") && role !== "PARENT") {
    return NextResponse.redirect(new URL(getDashboardUrl(role), nextUrl));
  }

  return NextResponse.next();
});

function getDashboardUrl(role: string | undefined): string {
  switch (role) {
    case "ADMIN": return "/admin";
    case "EDUCATOR": return "/educator";
    case "PARENT": return "/parent";
    default: return "/login";
  }
}

export const config = {
  // Statik dosyalar (görseller, fontlar vb.) ve api/_next hariç tüm rotalarda çalış.
  // Görsel uzantıları dışlanmazsa /public altındaki görseller (örn. /illustrations/*, /hero.png)
  // giriş yapmamış ziyaretçilerde login'e yönlendirilir.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|bmp|woff2?|ttf|otf)).*)",
  ],
};
