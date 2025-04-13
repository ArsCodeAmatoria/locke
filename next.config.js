/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disabled swcMinify to avoid issues during deployment
  swcMinify: false,
  // Disable image optimization for simplified deployment
  images: {
    unoptimized: true
  },
  // Transpile specific problematic dependencies
  transpilePackages: [
    "@polkadot/api",
    "@polkadot/extension-dapp"
  ],
};

module.exports = nextConfig; 