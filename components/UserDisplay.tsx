import { Button, HStack, Link, Text } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import NextLink from 'next/link';

import { useENS } from '@/hooks/useENS';
import { formatAddress, useWallet } from '@/web3';
import { getEthersProvider } from '@/web3/providers';

import { PoHBadge } from './PoHBadge';

export const UserDisplay: React.FC<{
  address?: string | undefined | null;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  hasPoH?: boolean;
}> = ({ address, color = 'white', size = 'md', hasPoH }) => {
  const { address: userAddress } = useWallet();
  const { ens } = useENS(address);

  const isUser = userAddress?.toLowerCase() === address?.toLowerCase();

  if (!address) return null;
  return (
    <NextLink as={`/profile/${address}`} href="/profile/[address]" passHref>
      <Link _hover={{}} borderRadius="full">
        <Button variant="ghost" size={size} height={8} px={2}>
          <HStack position="relative" color={color}>
            <Davatar
              address={address}
              size={20}
              generatedAvatarType="jazzicon"
              provider={getEthersProvider('0x1')}
            />
            <Text transition="opacity 0.25s" textAlign="left" fontWeight={700}>
              {isUser ? 'YOURSELF' : formatAddress(address, ens)}
            </Text>
            {hasPoH && <PoHBadge address={address} />}
          </HStack>
        </Button>
      </Link>
    </NextLink>
  );
};
