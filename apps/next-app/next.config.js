/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  excludeFile: (str) => /functions\/**/.test(str),
};
