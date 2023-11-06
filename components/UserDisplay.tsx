import { Button, HStack, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';

import { useARBNS } from '@/hooks/useARBNS';
import { useENS } from '@/hooks/useENS';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatAddress, useWallet } from '@/web3';

import { PoHBadge } from './PoHBadge';
import { UserAvatar } from './UserAvatar';

export const UserDisplay: React.FC<{
  address?: string | undefined | null;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xs';
  hasPoH?: boolean;
  noLink?: boolean;
}> = ({ address, color = 'white', size = 'md', hasPoH, noLink }) => {
  const {
    address: walletAddress,
    arbns: walletARBNS,
    ens: walletENS,
    user: walletProfile,
  } = useWallet();

  const isWalletUser = walletAddress?.toLowerCase() === address?.toLowerCase();

  const { arbns } = useARBNS(isWalletUser ? '' : address);
  const displayARBNS = isWalletUser ? walletARBNS : arbns;

  const { ens } = useENS(isWalletUser ? '' : address);
  const displayENS = isWalletUser ? walletENS : ens;

  const { profile } = useUserProfile(isWalletUser ? '' : address ?? '');
  const displayProfile = isWalletUser ? walletProfile : profile;

  const displayName =
    displayProfile?.username ??
    formatAddress(address, displayARBNS || displayENS);

  const avatarSize = useMemo(() => {
    switch (size) {
      case 'lg':
        return 24;
      case 'md':
        return 20;
      case 'sm':
      case 'xs':
        return 16;
      default:
        return 20;
    }
  }, [size]);

  if (!address) return null;

  const name = profile?.username ?? ens ?? address;

  const inner = (
    <Button
      variant="ghost"
      size={size}
      height={8}
      px={2}
      _hover={noLink ? {} : undefined}
    >
      <HStack position="relative" color={color}>
        <UserAvatar address={address} profile={profile} size={avatarSize} />
        <Text transition="opacity 0.25s" textAlign="left" fontWeight={700}>
          {isWalletUser ? 'YOURSELF' : displayName}
        </Text>
        {hasPoH && !noLink && <PoHBadge address={address} />}
      </HStack>
    </Button>
  );
  return noLink ? (
    inner
  ) : (
    <NextLink as={`/profile/${name}`} href="/profile/[name]" passHref>
      <Link _hover={{}} borderRadius="full">
        {inner}
      </Link>
    </NextLink>
  );
};
