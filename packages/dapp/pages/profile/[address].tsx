import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Grid, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { QuestsRejected } from '@/components/QuestsRejected';
import { QuestsToReview } from '@/components/QuestsToReview';
import { UserProgress } from '@/components/UserProgress';
import { UserRoles } from '@/components/UserRoles';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

const Profile: React.FC = () => {
  const {
    push,
    query: { address: addressQuery },
  } = useRouter();
  const { address, chainId } = useWallet();
  const addressURL: string =
    typeof addressQuery === 'object' ? addressQuery[0] : addressQuery ?? '';
  const isLoggedInUser = addressURL === address;

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
      <Stack spacing={6}>
        <Text
          w="100%"
          textAlign="left"
          color="main"
          fontSize={20}
          textTransform="uppercase"
        >
          User
        </Text>
        <Link isExternal href={getAddressUrl(addressURL, chainId)}>
          <HStack spacing={2} position="relative">
            <Davatar
              address={addressURL}
              size={20}
              generatedAvatarType="jazzicon"
              style={{ display: 'inline-block' }}
            />
            <Text as="span">{formatAddress(addressURL)}</Text>
            <ExternalLinkIcon mb={'0.375rem'} />
          </HStack>
        </Link>
      </Stack>

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <UserRoles address={addressURL} />
        <UserProgress address={addressURL} />

        {isLoggedInUser && <QuestsToReview address={addressURL} />}
        {isLoggedInUser && <QuestsRejected address={addressURL} />}
      </Grid>
    </VStack>
  );
};

export default Profile;
