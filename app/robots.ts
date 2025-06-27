import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/verified",
    },
    sitemap: "tripxpay-official.vercel.app/sitemap.xml",
  };
}
