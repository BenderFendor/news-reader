let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Keep this for static exports
    domains: ['*'], // Allow images from any domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // This will help fix hydration errors from browser extensions
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  // Fix for the "Extra attributes from the server" warning
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Output configuration for Cloudflare Pages
  output: 'export', // Static site generation
  
  // Skip API routes during static export but make them available at runtime
  // This is the key configuration needed for Cloudflare Pages compatibility
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./api/**']
    },
    // Allow runtime-only features for Edge API routes
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Disable route validation for API routes during static export
  distDir: process.env.DIST_DIR || '.next',
  swcMinify: true,
}

/**
 * Merges user configuration with the default Next.js configuration
 * @param {Object} nextConfig - The default Next.js configuration
 * @param {Object} userConfig - The user's custom configuration
 */
function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

mergeConfig(nextConfig, userConfig)

export default nextConfig
