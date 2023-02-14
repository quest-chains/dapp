import { CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Grid,
  Heading,
  HStack,
  IconButton,
  Link,
  Text,
  Tooltip,
  useClipboard,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { Page } from '@/components/Layout/Page';
import { LoadingState } from '@/components/LoadingState';
import { PoHBadge } from '@/components/PoHBadge';
import { EditProfileModal } from '@/components/ProfileView/EditProfileModal';
import { UserActionsNeeded } from '@/components/ProfileView/UserActionsNeeded';
import { UserBadges } from '@/components/ProfileView/UserBadges';
import { UserProgress } from '@/components/ProfileView/UserProgress';
import { UserRoles } from '@/components/ProfileView/UserRoles';
import { HeadComponent } from '@/components/Seo';
import { UserAvatar } from '@/components/UserAvatar';
import { fetchAddressFromENS, fetchENSFromAddress } from '@/hooks/useENS';
import { fetchPoH } from '@/hooks/usePoH';
import { fetchUserProfile } from '@/hooks/useUserProfile';
import { MongoUser } from '@/lib/mongodb/types';
import { QUESTCHAINS_URL } from '@/utils/constants';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

type ProfileData = {
  displayName: string;
  profileAddress: string;
  profile: MongoUser | null;
};

const useProfileData = (
  name: string,
): {
  fetching: boolean;
  pohRegistered: boolean;
  displayName: string;
  profileAddress: string;
  profileENS: string;
  profile: MongoUser | null;
} & ProfileData => {
  const [profileData, setProfileData] = useState<{
    pohRegistered: boolean;
    displayName: string;
    profileAddress: string;
    profileENS: string;
    profile: MongoUser | null;
  }>({
    pohRegistered: false,
    profileAddress: '',
    profileENS: '',
    displayName: '',
    profile: null,
  });
  const [fetching, setFetching] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setFetching(true);
      const isENS = name.endsWith('.eth');

      const [address, ens] = await Promise.all([
        fetchAddressFromENS(name),
        fetchENSFromAddress(name),
      ]);

      const profile = await fetchUserProfile(isENS && address ? address : name);

      const profileAddress = (
        utils.isAddress(name) ? name : profile?.address ?? address ?? ''
      ).toLowerCase();

      const profileENS = isENS ? name : ens ?? '';

      const displayName = profile?.username ?? (isENS ? name : '');

      const pohRegistered = await fetchPoH(profileAddress);

      setProfileData({
        profileAddress,
        profileENS,
        displayName,
        profile,
        pohRegistered,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProfileData({
        pohRegistered: false,
        profileAddress: '',
        profileENS: '',
        displayName: '',
        profile: null,
      });
    } finally {
      setFetching(false);
    }
  }, [name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { fetching: fetching, ...profileData };
};

const Profile: React.FC = () => {
  const {
    query: { name },
  } = useRouter();

  const { pohRegistered, displayName, profileAddress, profile, fetching } =
    useProfileData(name?.toString() ?? '');

  const { address, chainId } = useWallet();

  const isLoggedInUser = profileAddress === address?.toLowerCase();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { onCopy, hasCopied } = useClipboard(
    utils.isAddress(profileAddress) ? utils.getAddress(profileAddress) : '',
  );

  if (fetching)
    return (
      <Page align="center">
        <LoadingState my={20} />
      </Page>
    );

  if (!profileAddress)
    return (
      <Page align="center">
        <Heading fontSize={36}>Profile not found!</Heading>
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

        <VStack spacing={2}>
          {displayName && (
            <>
              <HStack spacing={0}>
                <Text fontSize={20} fontWeight="bold">
                  {displayName}
                </Text>
                {pohRegistered && (
                  <Box pl={2}>
                    <PoHBadge address={profileAddress} size={6} />
                  </Box>
                )}
              </HStack>
              <Divider w="2rem" />
            </>
          )}
          <HStack spacing={3}>
            <Link isExternal href={getAddressUrl(profileAddress, chainId)}>
              {formatAddress(profileAddress, '')}
            </Link>
            <Tooltip
              label={hasCopied ? 'Copied!' : 'Click to copy address'}
              closeOnClick={false}
            >
              <IconButton
                bg="none"
                onClick={onCopy}
                size="sm"
                icon={<CopyIcon fontSize="1rem" />}
                aria-label="Copy address"
              />
            </Tooltip>
          </HStack>
        </VStack>
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

export default Profile;
