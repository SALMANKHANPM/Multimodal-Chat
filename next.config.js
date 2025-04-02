/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ferf1mheo22r9ira.public.blob.vercel-storage.com',
      'shadcnblocks.com', // Keep any existing domains
    ],
  },
}

module.exports = nextConfig