/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/:path*`,
      },
      {
        source: '/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
