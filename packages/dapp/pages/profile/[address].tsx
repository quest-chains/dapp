import { Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { UserProgress } from '@/components/UserProgress';
import { UserRoles } from '@/components/UserRoles';

type Props = { address: string };

const Explore: React.FC<Props> = () => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    const address = window.location.href.split('/').pop();

    if (address) setAddress(address);
  }, []);

  return (
    <VStack px={{ base: 0, lg: 40 }} alignItems="flex-start" gap={4}>
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Text>Address: {address}</Text>

      <UserRoles />
      <UserProgress />
    </VStack>
  );
};

export default Explore;
