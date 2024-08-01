import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Audiobook Covers",
  description: "Browse custom audiobook cover artwork",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <div className="flex flex-row gap-8">
            <Button asChild variant="ghost">
              <Link href="/">Home</Link>
            </Button>

            <Button asChild variant="ghost">
              <Link href="/about/">About</Link>
            </Button>

            <Button asChild variant="ghost">
              <Link href="/apidocs/">API</Link>
            </Button>

            <Button asChild variant="ghost">
              <Link href="/contribute/">Contribute</Link>
            </Button>
          </div>
          {children}
        </TRPCReactProvider>
        <GoogleAnalytics gaId="G-TW1XRPJV89" />
      </body>
    </html>
  );
}
