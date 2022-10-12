/* eslint-disable @typescript-eslint/no-var-requires */
const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }];
  },
  trailingSlash: true,
  exportPathMap: () => ({ "/": { page: "/" } }),
  excludeFile: (str) => /functions\/**/.test(str),
};
