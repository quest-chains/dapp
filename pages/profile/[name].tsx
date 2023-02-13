import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { utils } from 'ethers';
import { GetStaticPropsContext } from 'next';

import { Page } from '@/components/Layout/Page';
import { PoHBadge } from '@/components/PoHBadge';
import { EditProfileModal } from '@/components/ProfileView/EditProfileModal';
import { UserActionsNeeded } from '@/components/ProfileView/UserActionsNeeded';
import { UserBadges } from '@/components/ProfileView/UserBadges';
import { UserProgress } from '@/components/ProfileView/UserProgress';
import { UserRoles } from '@/components/ProfileView/UserRoles';
import { HeadComponent } from '@/components/Seo';
import { UserAvatar } from '@/components/UserAvatar';
import { useAddressFromENS, useENS } from '@/hooks/useENS';
import { usePoH } from '@/hooks/usePoH';
import { useUserProfile } from '@/hooks/useUserProfile';
import { QUESTCHAINS_URL } from '@/utils/constants';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

const Profile: React.FC<{ name: string }> = ({ name }) => {
  const { address: addressFromENS, fetching: fetchingAddressFromENS } =
    useAddressFromENS(name.endsWith('.eth') ? name : '');

  const { ens: ensFromAddress, fetching: fetchingENSFromAddress } = useENS(
    utils.isAddress(name) ? name : '',
  );

  const { profile, fetching: fetchingProfile } = useUserProfile(
    name.endsWith('.eth') ? addressFromENS ?? '' : name,
  );

  const profileAddress = profile?.address ?? addressFromENS ?? '';

  const { registered, fetching: fetchingPoH } = usePoH(profileAddress);

  const { address, chainId } = useWallet();

  const isLoggedInUser = profileAddress === address?.toLowerCase();
  const displayName =
    profile?.username ?? name.endsWith('.eth')
      ? name
      : formatAddress(profileAddress, ensFromAddress);

  const isLoading =
    fetchingAddressFromENS ||
    fetchingENSFromAddress ||
    fetchingProfile ||
    fetchingPoH;

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading)
    return (
      <Page>
        <HeadComponent
          title="Profile"
          url={QUESTCHAINS_URL + '/profile/' + name}
        />
        <VStack spacing={6} pb={8}>
          <Heading color="white" fontSize={50}>
            Profile
          </Heading>
          <Spinner width="5rem" height="5rem" color="main" />
        </VStack>
      </Page>
    );

  if (!profileAddress)
    return (
      <Page>
        <HeadComponent
          title="Profile"
          url={QUESTCHAINS_URL + '/profile/' + name}
        />
        <VStack spacing={6} pb={8}>
          <Heading color="white" fontSize={50}>
            Profile
          </Heading>
          <Text>User not found</Text>
        </VStack>
      </Page>
    );

  return (
    <Page>
      <HeadComponent
        title="Profile"
        description={`Quest Chains profile of ${displayName}`}
        url={QUESTCHAINS_URL + '/profile/' + name}
      />
      <VStack spacing={6} pb={8}>
        <Heading color="white" fontSize={50}>
          Profile
        </Heading>
        {isLoggedInUser && (
          <>
            <Button onClick={onOpen}>Edit Profile</Button>
            <EditProfileModal isOpen={isOpen} onClose={onClose} />
          </>
        )}

        <UserAvatar address={profileAddress} profile={profile} size={150} />
        <Flex alignItems="center">
          <Link
            isExternal
            href={getAddressUrl(profileAddress, chainId)}
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
              <Text as="span">{displayName}</Text>
            </Button>
          </Link>
          {registered && <PoHBadge address={profileAddress} size={6} />}
        </Flex>
      </VStack>

      <Grid templateColumns="repeat(1, 1fr)" gap={20}>
        <UserBadges address={profileAddress} />
        {isLoggedInUser && <UserActionsNeeded />}
        <UserProgress address={profileAddress} />
        <UserRoles address={profileAddress} />
      </Grid>
    </Page>
  );
};

type QueryParams = { name: string };

export const getServerSideProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const name = context.params?.name ?? '';

  if (!name) {
    return { notFound: true };
  }
  return {
    props: {
      name,
    },
  };
};

export default Profile;
