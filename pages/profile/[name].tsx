import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Grid,
  Heading,
  Link,
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
import { fetchAddressFromENS, fetchENSFromAddress } from '@/hooks/useENS';
import { usePoH } from '@/hooks/usePoH';
import { MongoUser } from '@/lib/mongodb/types';
import { fetchProfileFromName } from '@/lib/profile';
import { QUESTCHAINS_URL } from '@/utils/constants';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

const Profile: React.FC<{
  name: string;
  displayName: string;
  profileAddress: string;
  profile: MongoUser | null;
}> = ({ name, displayName, profileAddress, profile }) => {
  const { registered, fetching: fetchingPoH } = usePoH(profileAddress);

  const { address, chainId } = useWallet();

  const isLoggedInUser = profileAddress === address?.toLowerCase();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Text fontSize="lg" fontWeight="bold">
            User not found
          </Text>
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
          {registered && !fetchingPoH && (
            <PoHBadge address={profileAddress} size={6} />
          )}
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

  const isENS = name.endsWith('.eth');

  const address = await fetchAddressFromENS(name);

  const ens = await fetchENSFromAddress(name);

  const { user: profile } = await fetchProfileFromName(
    isENS && address ? address : name,
  );

  const profileAddress = (
    utils.isAddress(name) ? name : profile?.address ?? address ?? ''
  ).toLowerCase();

  const displayName =
    profile?.username ?? isENS ? name : formatAddress(profileAddress, ens);

  return {
    props: {
      name,
      displayName,
      profileAddress,
      profile: profile ? { ...profile, _id: profile._id.toString() } : null,
    },
  };
};

export default Profile;
