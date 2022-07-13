import { Button, HStack, Link, Text } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';
import NextLink from 'next/link';

import { useENS } from '@/hooks/useENS';
import { formatAddress } from '@/web3';

export const UserDisplay: React.FC<{
  address: string;
  color?: string;
}> = ({ address, color = 'white' }) => {
  const { ens } = useENS(address);
  return (
    <NextLink as={`/profile/${address}`} href="/profile/[address]" passHref>
      <Link _hover={{}} borderRadius="full">
        <Button variant="ghost" size="md" height={8} px={4}>
          <HStack position="relative" color={color}>
            <Davatar
              address={address}
              size={20}
              generatedAvatarType="jazzicon"
            />
            <Text transition="opacity 0.25s" textAlign="left" fontWeight={700}>
              {formatAddress(utils.getAddress(address), ens)}
            </Text>
          </HStack>
        </Button>
      </Link>
    </NextLink>
  );
};
