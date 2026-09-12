/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/features',
        destination: '/construction-project-risk-calculator',
        permanent: true,
      },
      {
        source: '/governance-diagnostic-tools',
        destination: '/construction-project-risk-calculator',
        permanent: true,
      }
    ]
  }
};

module.exports = nextConfig;
