import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["miro.medium.com", "cruip-tutorials.vercel.app"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
