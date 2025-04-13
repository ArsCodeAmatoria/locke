/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable SWC minification
  swcMinify: false,
  // Configure compiler without invalid options
  compiler: {
    // Disable React optimizations
    reactRemoveProperties: false,
  },
  // Disable image optimization for simplified deployment
  images: {
    unoptimized: true
  },
  // Transpile specific problematic dependencies
  transpilePackages: [
    "@polkadot/api",
    "@polkadot/extension-dapp"
  ],
  // Remove the experimental output: 'export' option as it causes issues with Vercel
};

module.exports = nextConfig; 