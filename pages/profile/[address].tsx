import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Grid, Heading, Link, Text, VStack } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { Page } from '@/components/Layout/Page';
import { UserActionsNeeded } from '@/components/ProfileView/UserActionsNeeded';
import { UserBadges } from '@/components/ProfileView/UserBadges';
import { UserProgress } from '@/components/ProfileView/UserProgress';
import { UserRoles } from '@/components/ProfileView/UserRoles';
import { HeadComponent } from '@/components/Seo';
import { useENS } from '@/hooks/useENS';
import { QUESTCHAINS_URL } from '@/utils/constants';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getServerSideProps>;

const Profile: React.FC<Props> = ({ address: addressURL }) => {
  const { address, chainId } = useWallet();
  const isLoggedInUser = addressURL === address?.toLowerCase();
  const { ens } = useENS(address);
  const profile = formatAddress(address, ens);

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
        <Link
          isExternal
          href={getAddressUrl(addressURL, chainId)}
          _hover={{
            textDecor: 'none',
          }}
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
