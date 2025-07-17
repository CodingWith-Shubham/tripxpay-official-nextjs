import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/Auth";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TripX Pay - Travel Now, Pay Later | B2B Travel Fintech Solution",
    template: "%s | TripX Pay"
  },
  description:
    "TripX Pay is India's first B2B 'Travel Now, Pay Later' solution. Empower your travel agency with flexible payment options, seamless bookings, and financial freedom for your clients.",
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
  authors: [{ name: "TripX Pay Team" }],
  creator: "TripX Pay",
  publisher: "TripX Pay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tripxpay.in'),
  alternates: {
    canonical: 'https://tripxpay.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://tripxpay.in',
    title: 'TripX Pay - Travel Now, Pay Later | B2B Travel Fintech Solution',
    description: 'India\'s first B2B \'Travel Now, Pay Later\' solution for seamless travel bookings and flexible payments.',
    siteName: 'TripX Pay',
    images: [
      {
        url: 'https://media.licdn.com/dms/image/v2/D4D22AQHyv7TZeMqHCw/feedshare-shrink_800/B4DZcCz5SmHEAg-/0/1748098848525?e=1753920000&v=beta&t=25-RRsFiBa9VKYRoAvpoge-n2c8YZwDPvNBCfcOCr8w', // You need to create this
        width: 1200,
        height: 630,
        alt: 'TripX Pay - Travel Now, Pay Later',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TripX Pay - Travel Now, Pay Later | B2B Travel Fintech Solution',
    description: 'India\'s first B2B \'Travel Now, Pay Later\' solution for seamless travel bookings and flexible payments.',
    images: ['https://media.licdn.com/dms/image/v2/D4D22AQHyv7TZeMqHCw/feedshare-shrink_800/B4DZcCz5SmHEAg-/0/1748098848525?e=1753920000&v=beta&t=25-RRsFiBa9VKYRoAvpoge-n2c8YZwDPvNBCfcOCr8w'], // You need to create this
    creator: '@tripxpay', // Add your Twitter handle
  },
  verification: {
    google: 'WMI1nilSZQof83ds5QfachzCEgEMi4_WH9Sjx_ZrPmI',
  },
  category: 'travel',
  classification: 'Business',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        {/* Additional meta tags that can't be set via metadata */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0066ff" />
        <meta name="msapplication-TileColor" content="#0066ff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TripX Pay",
              "url": "https://tripxpay.in",
              "logo": "https://tripxpay.in/logo.svg",
              "description": "India's first B2B 'Travel Now, Pay Later' solution for seamless travel bookings and flexible payments.",
              "foundingDate": "2024", // Update with actual founding date
              "industry": "Travel Technology",
              "location": {
                "@type": "Place",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.linkedin.com/company/tripxpay",
                "https://twitter.com/tripxpay"
              ]
            })
          }}
        />
        
        {/* Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TripX Pay",
              "url": "https://tripxpay.in",
              "description": "India's first B2B 'Travel Now, Pay Later' solution for seamless travel bookings and flexible payments.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tripxpay.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          style={{
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          }}
        />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        
        {/* Google Analytics - Add your tracking ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}