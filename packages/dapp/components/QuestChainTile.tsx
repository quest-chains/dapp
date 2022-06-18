import {
  Box,
  HStack,
  Link as ChakraLink,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import removeMd from 'remove-markdown';

import { NetworkDisplay } from './NetworkDisplay';

type QuestChainTileProps = {
  address: string;
  chainId: string;
  name?: string | undefined | null;
  description?: string | undefined | null;
  quests: number;
  onClick?: () => void;
};

export const QuestChainTile: React.FC<QuestChainTileProps> = ({
  address,
  name,
  description,
  chainId,
  quests,
  onClick = () => undefined,
}) => (
  <NextLink
    as={`/chain/${chainId}/${address}`}
    href="/chain/[chainId]/[address]"
    passHref
  >
    <ChakraLink
      display="block"
      _hover={{}}
      w="full"
      borderRadius="3xl"
      onClick={onClick}
    >
      <VStack
        cursor="pointer"
        align="stretch"
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
        h="8rem"
        spacing={4}
      >
        <HStack justify="space-between" w="100%">
          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="main"
              letterSpacing={4}
            >
              {name}
            </Text>
            <Text fontSize={14} color="whiteAlpha.700">
              Quests: {quests}
            </Text>
          </Box>
          <NetworkDisplay asTag chainId={chainId} />
        </HStack>
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
      </VStack>
    </ChakraLink>
  </NextLink>
);
