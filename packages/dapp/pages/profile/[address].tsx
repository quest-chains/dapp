import { Box, Grid, Text, VStack } from '@chakra-ui/react';
import { utils } from 'ethers';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { QuestsRejected } from '@/components/QuestsRejected';
import { QuestsToReview } from '@/components/QuestsToReview';
import { UserProgress } from '@/components/UserProgress';
import { UserRoles } from '@/components/UserRoles';
import { formatAddress, useWallet } from '@/web3';

type Props = { address: string };

const Profile: React.FC<Props> = ({ address: addressURL }) => {
  const { address } = useWallet();
  const isLoggedInUser = addressURL === address;

  const { push } = useRouter();
  const isValidAddress = utils.isAddress(addressURL);
  useEffect(() => {
    if (!isValidAddress) {
      push('/');
    }
  }, [isValidAddress, push]);

  if (!isValidAddress) {
    return null;
  }

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
          <Text>{formatAddress(addressURL)}</Text>
        </Box>

        <UserRoles address={addressURL} />
        <UserProgress address={addressURL} />

        {isLoggedInUser && <QuestsToReview address={addressURL} />}
        {isLoggedInUser && <QuestsRejected address={addressURL} />}
      </Grid>
    </VStack>
  );
};

export default Profile;
