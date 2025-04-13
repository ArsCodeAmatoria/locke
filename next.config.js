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
  // Configure webpack to handle WebSocket dependencies
  webpack: (config, { isServer }) => {
    // Provide fallbacks for optional ws dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      bufferutil: require.resolve('./src/lib/ws-fallback.js'),
      'utf-8-validate': require.resolve('./src/lib/ws-fallback.js')
    };
    
    // Set fallbacks for browser bundles
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,
      'utf-8-validate': false,
    };
    
    return config;
  },
};

module.exports = nextConfig; 