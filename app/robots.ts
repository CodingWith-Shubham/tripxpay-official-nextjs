import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/verified", "/admin", "/api", "/private"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/verified", "/admin", "/api", "/private"],
      },
    ],
    sitemap: "https://tripxpay.in/sitemap.xml",
    host: "https://tripxpay.in",
  };
}