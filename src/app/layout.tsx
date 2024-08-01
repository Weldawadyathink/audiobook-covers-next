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
          <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="my-6 flex flex-row justify-center gap-8">
              <Link className="my-auto" href="/">
                <h1 className="text-2xl">Audiobook Covers</h1>
              </Link>

              <Button asChild variant="ghost">
                <Link href="/about/" className="text-l">
                  About
                </Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href="/apidocs/">API</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href="/contribute/">Contribute</Link>
              </Button>
            </div>
            <div className="min-h-screen">{children}</div>
          </div>
        </TRPCReactProvider>
        <GoogleAnalytics gaId="G-TW1XRPJV89" />
      </body>
    </html>
  );
}
