module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/chain/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
      {
        source: '/chain/0x13881/:slug*',
        destination: '/mumbai/:slug*',
        permanent: true,
      },
      {
        source: '/chain/0x89/:slug*',
        destination: '/polygon/:slug*',
        permanent: true,
      },
      {
        source: '/chain/0x64/:slug*',
        destination: '/gnosis/:slug*',
        permanent: true,
      },
      {
        source: '/chain/0x5/:slug*',
        destination: '/goerli/:slug*',
        permanent: true,
      },
      {
        source: '/0x13881/:slug*',
        destination: '/mumbai/:slug*',
        permanent: true,
      },
      {
        source: '/0x89/:slug*',
        destination: '/polygon/:slug*',
        permanent: true,
      },
      {
        source: '/0x64/:slug*',
        destination: '/gnosis/:slug*',
        permanent: true,
      },
      {
        source: '/0x5/:slug*',
        destination: '/goerli/:slug*',
        permanent: true,
      },
    ];
  },
};
