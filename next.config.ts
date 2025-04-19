import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    domains: ["miro.medium.com", "cruip-tutorials.vercel.app"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
