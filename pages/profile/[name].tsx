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
import { getAddress, isAddress } from '@ethersproject/address';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';

import { ZERO_ADDRESS } from '@/utils/constants';
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
import { fetchAddressFromARBNS, fetchARBNSFromAddress } from '@/hooks/useARBNS';
import { fetchAddressFromENS, fetchENSFromAddress } from '@/hooks/useENS';
import { fetchPoH } from '@/hooks/usePoH';
import { useUserProfile } from '@/hooks/useUserProfile';
import { fetchProfileFromName, fetchProfileNames } from '@/lib/profile';
import { QUESTCHAINS_URL } from '@/utils/constants';
import { formatAddress, getAddressUrl, useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Profile: React.FC<Props> = ({
  name,
  pohRegistered,
  displayName,
  profileAddress,
  profile: inputProfile,
}) => {
  const { fetching, profile } = useUserProfile(profileAddress);

  const { isFallback } = useRouter();

  const { address, chainId } = useWallet();

  const isLoggedInUser = profileAddress === address?.toLowerCase();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { onCopy, hasCopied } = useClipboard(
    isAddress(profileAddress) ? getAddress(profileAddress) : '',
  );

  if (isFallback || fetching || (!profile && !!inputProfile))
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

type QueryParams = { name: string };

export async function getStaticPaths() {
  const names = await fetchProfileNames();
  const paths: { params: QueryParams }[] = names.map(name => ({
    params: {
      name,
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const name = context.params?.name ?? '';

  const addressFromARBNS = await fetchAddressFromARBNS(name);
  const addressFromENS = await fetchAddressFromENS(name);
  // get the right address to fetch both arb and ens domains
  const address =
    addressFromARBNS === ZERO_ADDRESS ? addressFromENS : addressFromARBNS;
  const arbns = await fetchARBNSFromAddress(address);
  const ens = await fetchENSFromAddress(address);

  // TODO: change name of variable isENS?
  const isENS = isAddress(name) ? false : address ? true : false;

  const { user: profile } = await fetchProfileFromName(
    isENS && address ? address : name,
  );

  const profileAddress = (
    isAddress(name) ? name : profile?.address ?? address ?? ''
  ).toLowerCase();
  // TODO: change name of variable profileENS?
  const profileENS = isENS ? name : (arbns || ens) ?? '';

  const displayName = profile?.username
    ? profile?.username
    : arbns
    ? arbns
    : ens;

  const pohRegistered = await fetchPoH(profileAddress);

  const props = {
    name,
    profileAddress,
    profileENS,
    displayName,
    profile: profile ? { ...profile, _id: profile._id.toString() } : null,
    pohRegistered,
  };

  return {
    props,
    revalidate: 60,
  };
};

export default Profile;
