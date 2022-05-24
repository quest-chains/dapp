import { Box, Grid, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { QuestsToReview } from '@/components/QuestsToReview';
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
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box>
          <Text w="100%" textAlign="left" mb={2} color="main" fontSize={20}>
            USER
          </Text>
          <Text>{address}</Text>
        </Box>

        <UserRoles address={address} />
        <UserProgress address={address} />
        <QuestsToReview address={address} />
      </Grid>
    </VStack>
  );
};

export default Explore;
