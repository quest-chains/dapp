import { HStack, Link, Text } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';
import NextLink from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { useENS } from '@/hooks/useENS';
import { formatAddress } from '@/web3';

export const UserDisplay: React.FC<{ address: string; color?: string }> = ({
  address,
  color = 'main',
}) => {
  const { ens } = useENS(address);
  return (
    <NextLink as={`/profile/${address}`} href="/profile/[address]" passHref>
      <Link _hover={{}} borderRadius="full">
        <SubmitButton
          size="md"
          px={4}
          letterSpacing={4}
          fontSize={12}
          height={8}
        >
          <HStack spacing={2} position="relative" color={color}>
            <Davatar
              address={address}
              size={20}
              generatedAvatarType="jazzicon"
            />
            <Text transition="opacity 0.25s" minW="8rem" textAlign="left">
              {formatAddress(utils.getAddress(address), ens)}
            </Text>
          </HStack>
        </SubmitButton>
      </Link>
    </NextLink>
  );
};
