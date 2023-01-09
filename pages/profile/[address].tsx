import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';
import { createClient } from 'urql';

import { Page } from '@/components/Layout/Page';
import { PoHBadge } from '@/components/PoHBadge';
import { UserActionsNeeded } from '@/components/ProfileView/UserActionsNeeded';
import { UserBadges } from '@/components/ProfileView/UserBadges';
import { UserProgress } from '@/components/ProfileView/UserProgress';
import { UserRoles } from '@/components/ProfileView/UserRoles';
import { HeadComponent } from '@/components/Seo';
import { useENS } from '@/hooks/useENS';
import { QUESTCHAINS_URL } from '@/utils/constants';
import { getRegisteredStatus, PoHAPI } from '@/utils/PoH';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getServerSideProps>;

const Profile: React.FC<Props> = ({ address: addressURL }) => {
  const { address, chainId } = useWallet();
  const isLoggedInUser = addressURL === address?.toLowerCase();
  const { ens } = useENS(address);
  const [registered, setRegistered] = useState<boolean>(false);
  const profile = formatAddress(address, ens);

  const getPOH = async () => {
    const client = createClient({
      url: PoHAPI,
    });
    const data = await client
      .query(getRegisteredStatus, { id: addressURL })
      .toPromise();

    setRegistered(data?.data?.submission?.registered || false);
  };

  useEffect(() => {
    getPOH();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <Page>
      <HeadComponent
        title="Profile"
        description={`Quest Chains profile of ${profile}`}
        url={QUESTCHAINS_URL + '/profile/' + address}
      />
      <VStack spacing={6} pb={8}>
        <Heading color="white" fontSize={50}>
          Profile
        </Heading>

        <Davatar
          address={addressURL}
          size={150}
          generatedAvatarType="jazzicon"
        />
        <Flex alignItems="center">
          <Link
            isExternal
            href={getAddressUrl(addressURL, chainId)}
            _hover={{
              textDecor: 'none',
            }}
            mr={2}
          >
            <Button
              color="main"
              fontSize={20}
              fontWeight="bold"
              rightIcon={<ExternalLinkIcon />}
            >
              <Text as="span">{formatAddress(addressURL)}</Text>
            </Button>
          </Link>
          {registered && <PoHBadge address={addressURL} size={6} />}
        </Flex>
      </VStack>

      <Grid templateColumns="repeat(1, 1fr)" gap={20}>
        <UserBadges address={addressURL} />
        {isLoggedInUser && <UserActionsNeeded />}
        <UserProgress address={addressURL} />
        <UserRoles address={addressURL} />
      </Grid>
    </Page>
  );
};

type QueryParams = { address: string };

export const getServerSideProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const address = (context.params?.address ?? '').toLowerCase();
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
