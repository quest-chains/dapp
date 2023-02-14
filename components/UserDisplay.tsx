import { Button, HStack, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { useENS } from '@/hooks/useENS';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatAddress, useWallet } from '@/web3';

import { PoHBadge } from './PoHBadge';
import { UserAvatar } from './UserAvatar';

export const UserDisplay: React.FC<{
  address?: string | undefined | null;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  hasPoH?: boolean;
}> = ({ address, color = 'white', size = 'md', hasPoH }) => {
  const { address: userAddress } = useWallet();
  const { ens } = useENS(address);

  const isUser = userAddress?.toLowerCase() === address?.toLowerCase();
  const { profile } = useUserProfile(address ?? '');

  const displayName = profile?.username ?? formatAddress(address, ens);

  if (!address) return null;
  return (
    <NextLink
      as={`/profile/${profile?.username ?? address}`}
      href="/profile/[name]"
      passHref
    >
      <Link _hover={{}} borderRadius="full">
        <Button variant="ghost" size={size} height={8} px={2}>
          <HStack position="relative" color={color}>
            <UserAvatar address={address} profile={profile} size={20} />
            <Text transition="opacity 0.25s" textAlign="left" fontWeight={700}>
              {isUser ? 'YOURSELF' : displayName}
            </Text>
            {hasPoH && <PoHBadge address={address} />}
          </HStack>
        </Button>
      </Link>
    </NextLink>
  );
};
