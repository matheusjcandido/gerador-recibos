import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gerador de Recibos Grátis - Crie Recibos Profissionais",
  description: "Gere recibos de pagamento profissionais em segundos. Valor por extenso automático. 100% grátis.",
  keywords: "gerador de recibos, recibo de pagamento, modelo de recibo, recibo freelancer, recibo mei",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} ${dmMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
