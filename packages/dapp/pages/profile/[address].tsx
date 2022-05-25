import { Box, Grid, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { QuestsRejected } from '@/components/QuestsRejected';
import { QuestsToReview } from '@/components/QuestsToReview';
import { UserProgress } from '@/components/UserProgress';
import { UserRoles } from '@/components/UserRoles';
import { useWallet } from '@/web3';

type Props = { address: string };

const Explore: React.FC<Props> = () => {
  const [showChild, setShowChild] = useState(false);
  const { address } = useWallet();

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window !== 'undefined') {
    const addressURL = window.location.href.split('/').pop() || '';
    const isLoggedInUser = addressURL === address;

    return (
      <VStack px={{ base: 0, lg: 40 }} alignItems="flex-start" gap={4}>
        <Head>
          <title>Quest Chains</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box>
            <Text w="100%" textAlign="left" mb={2} color="main" fontSize={20}>
              USER
            </Text>
            <Text>{addressURL}</Text>
          </Box>

          <UserRoles address={addressURL} />
          <UserProgress address={addressURL} />

          {isLoggedInUser && <QuestsToReview address={addressURL} />}
          {isLoggedInUser && <QuestsRejected address={addressURL} />}
        </Grid>
      </VStack>
    );
  } else return <></>;
};

export default Explore;
