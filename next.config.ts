import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'proconixpmc.com',
          },
        ],
        destination: 'https://www.proconixpmc.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
