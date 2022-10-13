/* eslint-disable @typescript-eslint/no-var-requires */
const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }];
  },
  trailingSlash: true,
  exportPathMap: () => ({ "/": { page: "/" } }),
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
