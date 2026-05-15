import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "@/app/globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAA 2025 - Sun Annual Awards",
  description: "Sun Annual Awards 2025",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${montserrat.variable} h-full`}>
      <body className="min-h-full">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
