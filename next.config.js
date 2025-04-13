/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable all minification to avoid syntax errors
  swcMinify: false,
  // Disable compilation of global CSS
  compiler: {
    // Disable React optimizations
    reactRemoveProperties: false,
    // Disable minification of CSS and other optimizations
    minify: false
  },
  // Disable Terser minification completely since it's causing syntax errors
  webpack: (config, { dev, isServer }) => {
    // Disable Terser and any other minimizers in production builds
    if (!dev && !isServer) {
      // Empty the minimizer array
      config.optimization.minimizer = [];
      
      // Disable minification completely
      config.optimization.minimize = false;
      
      // Ensure no terser plugin is added
      config.optimization.usedExports = false;
      
      // Disable concatenation which can cause issues
      config.optimization.concatenateModules = false;
    }
    
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
  // Disable image optimization for simplified deployment
  images: {
    unoptimized: true
  },
  // Transpile specific problematic dependencies
  transpilePackages: [
    "@polkadot/api",
    "@polkadot/extension-dapp"
  ],
  // Explicitly set output as an export
  output: 'export',
};

module.exports = nextConfig; 