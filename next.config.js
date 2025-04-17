const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['miro.medium.com'],
  },
}

module.exports = withNextIntl(nextConfig); 