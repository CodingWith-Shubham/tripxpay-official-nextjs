import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/Auth";
import Head from "next/head";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripx Pay",
  description:
    "TripX Pay is a cutting-edge B2B travel-fintech platform offering a Travel Now, Pay Later solution",
  keywords: [
    "tripx pay",
    "travel now pay later",
    "b2b travel payments",
    "india travel fintech",
    "post-trip payment",
    "flexible travel payments",
    "travel agency financing",
    "corporate travel solutions",
    "travel booking platform",
    "seamless travel payments",
    "travel payment solution",
    "b2b travel industry",
    "travel fintech solutions",
    "travel agency empowerment",
    "travel payment flexibility",
    "india travel innovation",
    "business travel payments",
    "travel payment revolution",
    "travel industry disruption",
    "travel payment technology",
    "travel payment integration",
    "real-time booking tracking",
    "travel dashboard platform",
    "travel agency competitive edge",
    "increase travel conversions",
    "reduce financial strain travel",
    "trusted travel payment",
    "client relationship travel",
    "future of travel payments",
    "startup travel solutions",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    images:
      "https://media.licdn.com/dms/image/v2/D4D22AQHyv7TZeMqHCw/feedshare-shrink_800/B4DZcCz5SmHEAg-/0/1748098848525?e=1753920000&v=beta&t=25-RRsFiBa9VKYRoAvpoge-n2c8YZwDPvNBCfcOCr8w",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://media.licdn.com/dms/image/v2/D4D22AQHyv7TZeMqHCw/feedshare-shrink_800/B4DZcCz5SmHEAg-/0/1748098848525?e=1753920000&v=beta&t=25-RRsFiBa9VKYRoAvpoge-n2c8YZwDPvNBCfcOCr8w",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="WMI1nilSZQof83ds5QfachzCEgEMi4_WH9Sjx_ZrPmI"
        />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          style={{
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          }}
        />
        <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      </body>
    </html>
  );
}
