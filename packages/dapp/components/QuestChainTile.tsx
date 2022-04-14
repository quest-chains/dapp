import { Box, HStack, Link as ChakraLink, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import removeMd from 'remove-markdown';

type QuestChainTileProps = {
  address: string;
  name?: string | undefined | null;
  description?: string | undefined | null;
};

export const QuestChainTile: React.FC<QuestChainTileProps> = ({
  address,
  name,
  description,
}) => (
  <NextLink as={`/chain/${address}`} href={`/chain/[address]`} passHref>
    <ChakraLink display="block" _hover={{}} w="full">
      <HStack
        cursor="pointer"
        justify="space-between"
        w="full"
        py={4}
        px={8}
        background="rgba(255, 255, 255, 0.02)"
        _hover={{
          background: 'whiteAlpha.100',
        }}
        fontWeight="400"
        backdropFilter="blur(40px)"
        borderRadius="3xl"
        boxShadow="inset 0px 0px 0px 1px #AD90FF"
        letterSpacing={4}
      >
        <Box h="6rem">
          <Text mb={4} fontSize="lg" fontWeight="bold" color="main">
            {name}
          </Text>
          <Text
            display="-webkit-box"
            textOverflow="ellipsis"
            overflow="hidden"
            maxW="calc(100%)"
            sx={{
              lineClamp: 2,
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {removeMd(description ?? '')}
          </Text>
        </Box>
      </HStack>
    </ChakraLink>
  </NextLink>
);
