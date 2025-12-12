/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "documents.demotcpdigital.com",
      },
      {
        protocol: "https",
        hostname: "seap-backend.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "devdocuments.aiimsexams.ac.in",
      },
      {
        protocol: "https",
        hostname: "documents.aiimsexams.ac.in",
      },
      {
        protocol: "https",
        hostname: "rrpdocuments.aiimsexams.ac.in",
      },
      {
        protocol: "https",
        hostname: "rrp.aiimsexams.ac.in",
      },
    ],
  },
};

export default nextConfig;
