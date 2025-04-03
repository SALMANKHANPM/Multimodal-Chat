/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "ferf1mheo22r9ira.public.blob.vercel-storage.com",
      "shadcnblocks.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
