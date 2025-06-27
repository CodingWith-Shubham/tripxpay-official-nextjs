import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TripX Pay | Travel Now, Pay Later",
    short_name: "TripX Pay",
    description:
      "India's first B2B 'Travel Now, Pay Later' solution for seamless travel bookings and flexible payments.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066ff",
    icons: [
      {
        src: "/logo.svg",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/logo.svg",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.svg",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    orientation: "portrait-primary",
    categories: ["travel", "finance", "business"],
    lang: "en-IN", // English (India)
  };
}
