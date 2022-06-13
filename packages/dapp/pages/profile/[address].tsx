import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Grid, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { QuestsRejected } from '@/components/QuestsRejected';
import { QuestsToReview } from '@/components/QuestsToReview';
import { UserBadges } from '@/components/UserBadges';
import { UserProgress } from '@/components/UserProgress';
import { UserRoles } from '@/components/UserRoles';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getServerSideProps>;

const Profile: React.FC<Props> = ({ address: addressURL }) => {
  const { address, chainId } = useWallet();
  const isLoggedInUser = addressURL === address;

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

      <UserBadges address={addressURL} />
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <UserRoles address={addressURL} />
        <UserProgress address={addressURL} />

        {isLoggedInUser && <QuestsToReview address={addressURL} />}
        {isLoggedInUser && <QuestsRejected address={addressURL} />}
      </Grid>
    </VStack>
  );
};

type QueryParams = { address: string };

export const getServerSideProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const address = context.params?.address ?? '';
  const isValidAddress = !!address && utils.isAddress(address);

  if (!isValidAddress) {
    return { notFound: true };
  }
  return {
    props: {
      address,
    },
  };
};

export default Profile;
