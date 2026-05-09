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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000"),
  title: {
    default: "PageBoost — Leads do WhatsApp organizados",
    template: "%s · PageBoost",
  },
  description:
    "Landing com formulário, lead salvo no painel antes do WhatsApp, Kanban e central de follow-up — sem API oficial do WhatsApp e sem captura invisível.",
  keywords: [
    "WhatsApp",
    "leads",
    "CRM simples",
    "Kanban",
    "landing page",
    "captura de leads",
    "PageBoost",
  ],
  openGraph: {
    title: "PageBoost — Transforme visitantes em clientes",
    description:
      "Página profissional + painel para organizar interessados do WhatsApp em um fluxo claro e vendável.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col overflow-x-hidden bg-[var(--pb-bg)]">{children}</body>
    </html>
  );
}
