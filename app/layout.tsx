import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
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
      <body className={`${inter.variable} ${dmSerif.variable} font-sans`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
