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
  metadataBase: new URL("https://irdprize.vercel.app/"),

  title: {
    default: "Nepal IRD Prize Coupon Checker",
    template: "%s | IRD Prize Coupon Checker",
  },

  description:
    "Check Nepal IRD prize-draw coupon numbers in bulk. Paste hundreds or thousands of coupon numbers and quickly find winning coupons, prize categories, ranks, fiscal years, and draw details.",

  verification: {
    google: "niWjAzYuc_75ui6cdi_kKGPMHwNgK4Oh1CVDczCagpI",
  },

  keywords: [
    "Nepal IRD prize checker",
    "IRD prize coupon checker",
    "Nepal prize coupon",
    "IRD lottery checker",
    "Nepal IRD winners",
    "prize draw Nepal",
    "coupon number checker Nepal",
  ],

  openGraph: {
    title: "Nepal IRD Prize Coupon Checker",
    description:
      "Check Nepal IRD prize-draw coupon numbers in bulk and quickly find winning coupons and prize details.",
    images: ["/og-image.png"],
    type: "website",
    locale: "en_NP",
    siteName: "IRD Prize Coupon Checker",
    url: "https://irdprize.vercel.app/",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
