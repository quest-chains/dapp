import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Grid,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
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
    <VStack px={{ base: 0, lg: 40 }} gap={4} alignItems="center">
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Stack spacing={6} alignItems="center">
        <Heading w="100%" color="white" fontSize={50}>
          Profile
        </Heading>

        <Davatar
          address={addressURL}
          size={150}
          generatedAvatarType="jazzicon"
        />
        <Link
          isExternal
          href={getAddressUrl(addressURL, chainId)}
          _hover={{
            textDecor: 'none',
          }}
        >
          <HStack
            spacing={2}
            position="relative"
            color="main"
            fontSize={20}
            fontWeight="bold"
          >
            <Text as="span" borderBottom="1px">
              {formatAddress(addressURL)}
            </Text>
            <ExternalLinkIcon mb={'0.375rem'} />
          </HStack>
        </Link>
      </Stack>

      <Grid templateColumns="repeat(1, 1fr)" gap={6}>
        <UserBadges address={addressURL} />
        <UserProgress address={addressURL} />
        <UserRoles address={addressURL} />

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
