import type { Metadata } from "next";
import { Quicksand, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Öğretmen Yanımda",
  description: "Bireysel ve grup dersleriyle kişiye özel eğitim platformu",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="tr">
      <body className={`${quicksand.variable} ${plusJakarta.variable}`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
