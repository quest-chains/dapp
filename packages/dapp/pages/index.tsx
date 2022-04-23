/* eslint-disable import/no-unresolved */
import { Flex, Heading } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { ConnectWallet } from '@/components/ConnectWallet';
import { useWallet } from '@/web3';

const Home: React.FC = () => {
  const { isConnected, isConnecting } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && !isConnecting) router.push('search');
  }, [isConnected, isConnecting, router]);

  return (
    <Flex
      flex={1}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading color="main" fontSize={87} pb={10} fontWeight="normal">
        DAOQuest
      </Heading>
      <Head>
        <title>DAOQuest</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Flex>{!isConnected && <ConnectWallet />}</Flex>
    </Flex>
  );
};

export default Home;
