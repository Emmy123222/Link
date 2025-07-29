import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Providers } from "@/providers";
import "@/styles/globals.css";
import CircularLoadingSpinner from "@/components/circularLoadingBar";
import { ConsoleWarningSuppressor } from "@/components/ConsoleWarningSuppressor";
import { NavbarTitleProvider } from "@/context/NavbarTitleContext";
import { AuthProvider } from "@/app/context/authcontext";
import { ThemeScript } from "@/components/ui/theme-script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paylist App",
  description: "Paylist App",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ConsoleWarningSuppressor />
        <Providers>
          <NavbarTitleProvider>
            <Suspense fallback={<CircularLoadingSpinner />}>
              <AuthProvider>{children}</AuthProvider>
            </Suspense>
          </NavbarTitleProvider>
        </Providers>
      </body>
    </html>
  );
}
