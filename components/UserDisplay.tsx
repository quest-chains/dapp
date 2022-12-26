import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  HStack,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import Davatar from '@davatar/react';
import PoH from 'assets/PoH.png';
import NextLink from 'next/link';

import { useENS } from '@/hooks/useENS';
import { formatAddress, useWallet } from '@/web3';
import { getEthersProvider } from '@/web3/providers';

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
            {hasPoH && (
              <Popover trigger="hover">
                <PopoverTrigger>
                  <CheckCircleIcon h={4} w={4} />
                </PopoverTrigger>
                <PopoverContent
                  cursor="initial"
                  p={2}
                  w="15rem"
                  justifyContent="space-around"
                  alignItems="center"
                  fontWeight={400}
                >
                  <PopoverArrow />
                  <Flex alignItems="center" mb={2}>
                    <Text mr={2}>Proof of Humanity verified</Text>
                    <Image src={PoH.src} w={4} h={4} alt="PoH" />
                  </Flex>
                  <Text
                    cursor="pointer"
                    pointerEvents="all"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(
                        `https://app.proofofhumanity.id/profile/${address}`,
                        '_blank',
                      );
                    }}
                    color="main"
                    fontSize="sm"
                    borderBottom="1px solid"
                    borderBottomColor="main"
                    _hover={{ borderBottomColor: 'white' }}
                  >
                    Learn more
                  </Text>
                </PopoverContent>
              </Popover>
            )}
          </HStack>
        </Button>
      </Link>
    </NextLink>
  );
};
