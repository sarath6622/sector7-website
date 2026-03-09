/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sector7gym.com",
  generateRobotsTxt: false, // robots.txt already exists in public/
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: [
    "/api/*",
    "/studio",
    "/studio/*",
  ],
  additionalPaths: async () => [
    { loc: "/",               priority: 1.0, changefreq: "daily"   },
    { loc: "/facilities",     priority: 0.8, changefreq: "monthly" },
    { loc: "/trainers",       priority: 0.8, changefreq: "weekly"  },
    { loc: "/transformations",priority: 0.8, changefreq: "weekly"  },
    { loc: "/pricing",        priority: 0.9, changefreq: "monthly" },
    { loc: "/about",          priority: 0.6, changefreq: "monthly" },
    { loc: "/contact",        priority: 0.7, changefreq: "monthly" },
    { loc: "/free-trial",     priority: 0.9, changefreq: "monthly" },
    { loc: "/blog",           priority: 0.8, changefreq: "daily"   },
  ],
};
