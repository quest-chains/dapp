import { Flex, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

import { AVAILABLE_NETWORK_INFO } from '@/web3';

export const Tile: React.FC<{ chainId: string; slug: string }> = ({
  chainId,
  slug,
}) => {
  return (
    <NextLink
      passHref
      as={`/${AVAILABLE_NETWORK_INFO[chainId].urlName}/${slug}`}
      href="/[chainId]/[address]"
    >
      <ChakraLink _hover={{}} w={16} display="flex" flex={1}>
        <Flex w="full" border="1px red dotted">
          QC
        </Flex>
      </ChakraLink>
    </NextLink>
  );
};
