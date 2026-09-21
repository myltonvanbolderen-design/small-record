import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // keep in sync with tools/image-variants.mjs WIDTHS and lib/image-loader.ts IMAGE_WIDTHS
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [640, 1080, 1920],
    imageSizes: [640],
  },
}

export default nextConfig
