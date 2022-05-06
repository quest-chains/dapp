module.exports = {
  async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/explore',
      //   permanent: false,
      // },
    ];
  },
  reactStrictMode: true,
  experimental: {
    concurrentFeatures: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['arweave.net'],
  },
};
