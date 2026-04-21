import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://incipit-git-main-guillaumecoulon1-6957s-projects.vercel.app/sitemap.xml",
  };
}
