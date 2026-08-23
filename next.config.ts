import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Smazane stranky: nejde o znacky natěrovych hmot, ale o prodejce
  // (stavebniny, hobby markety) nebo firmy z jineho oboru. 301 na vypis znacek.
  async redirects() {
    return [
    {
      source: '/barvy-a-laky/izomat-stavebniny',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/stavebniny-dek',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/uni-hobby',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/cesky-stavitel',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/hf-market',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/mat-group',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/bkp-group',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/praktik',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/havlicek-truhlarstvi',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/k-n-filters',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/knauf-insulation',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/deerfos',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    {
      source: '/barvy-a-laky/sedlecky-kaolin',
      destination: '/barvy-a-laky/podle-znacek',
      permanent: true,
    },
    ]
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.artisan.cz',
        pathname: '/webtemp/**',
      },
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
