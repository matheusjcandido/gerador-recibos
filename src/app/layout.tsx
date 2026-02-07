import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerador de Recibos Grátis - Crie Recibos Profissionais Online",
  description: "Gere recibos de pagamento profissionais em segundos. Ideal para freelancers, MEI e autônomos. Valor por extenso automático. 100% grátis.",
  keywords: "gerador de recibos, recibo de pagamento, modelo de recibo, recibo freelancer, recibo mei, recibo online grátis",
  openGraph: {
    title: "Gerador de Recibos Grátis",
    description: "Crie recibos profissionais em segundos - 100% grátis!",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
