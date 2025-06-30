/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "ferf1mheo22r9ira.public.blob.vercel-storage.com",
      "shadcnblocks.com",
      "res.cloudinary.com",
      "raw.githubusercontent.com",
    ],
  },
  allowedDevOrigins: [
    "https://w7kcdj7s-8001.inc1.devtunnels.ms:8001",
    "192.168.1.*",
    "http://192.168.1.*",
    "http://192.168.1.8:3001",
    "*",
  ],
};

export default nextConfig;
