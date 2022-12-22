module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/chain/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
    ];
  },
};
