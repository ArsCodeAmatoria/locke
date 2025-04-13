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
  // Configure webpack to ignore optional WebSocket dependencies
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies of ws package
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,
      'utf-8-validate': false,
    };
    
    return config;
  },
};

module.exports = nextConfig; 