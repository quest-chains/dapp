import { WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Link as ChakraLink,
  Progress,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import removeMd from 'remove-markdown';

import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { AVAILABLE_NETWORK_INFO } from '@/web3';

import { NetworkDisplay } from './NetworkDisplay';

type QuestChainTileProps = {
  address: string;
  chainId: string;
  name?: string | undefined | null;
  description?: string | undefined | null;
  imageUrl?: string | undefined | null;
  completed?: number;
  quests: number;
  onClick?: () => void;
  paused?: boolean;
};

export const QuestChainTile: React.FC<QuestChainTileProps> = ({
  address,
  name,
  description,
  chainId,
  completed,
  quests,
  imageUrl,
  onClick = () => undefined,
  paused = false,
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
      borderRadius="0.25rem"
      onClick={onClick}
    >
      <Tooltip label={`${name} on ${AVAILABLE_NETWORK_INFO[chainId].name}`}>
        <Flex
          direction="column"
          align="center"
          h={completed === 0 || !!completed ? '14.5rem' : '12rem'}
        >
          <VStack
            cursor="pointer"
            align="stretch"
            w="full"
            py={4}
            px={8}
            transition="all 0.25s"
            _hover={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'main',
            }}
            fontWeight="400"
            backdropFilter="blur(40px)"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            border="1px solid white"
            spacing={4}
            flex={1}
            borderRadius="0.25rem"
            pos="relative"
          >
            <Flex justifyContent="space-between">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="main"
                letterSpacing={4}
                display="-webkit-box"
                textOverflow="ellipsis"
                overflow="hidden"
                maxW="calc(100%)"
                sx={{
                  lineClamp: 1,
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {name}
              </Text>
              {paused && (
                <Tag variant="subtle" colorScheme="orange" borderRadius="full">
                  <TagLeftIcon as={WarningIcon} boxSize="1.25rem" />
                  <TagLabel color="white">Disabled</TagLabel>
                </Tag>
              )}
            </Flex>
            {completed && (
              <Flex justify="space-between" align="center">
                <Progress
                  value={(completed / quests) * 100 || 1}
                  size="xs"
                  w="80%"
                />
                <Text whiteSpace="nowrap">{(completed / quests) * 100} %</Text>
              </Flex>
            )}
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
              flex={1}
            >
              {removeMd(description ?? '')}
            </Text>
            <Flex justifyContent="space-between">
              <Text>{quests} quests</Text>
              <NetworkDisplay asTag chainId={chainId} />
            </Flex>
            {imageUrl && (
              <Box
                pos="absolute"
                w="100%"
                h="100%"
                top="0"
                left="0"
                zIndex="-1"
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundImage={ipfsUriToHttp(imageUrl)}
                opacity="0.1"
                m="0 !important"
              />
            )}
          </VStack>
          {quests > 0 && (
            <Box
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              border="1px solid white"
              borderTop="0"
              borderRadius="0.25rem"
              opacity="0.9"
              w="95%"
              h="0.5rem"
              bg="#202327"
            />
          )}
          {quests > 1 && (
            <Box
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              border="1px solid white"
              borderTop="0"
              borderRadius="0.25rem"
              opacity="0.9"
              w="90%"
              h="0.5rem"
              bg="#202327"
            />
          )}
        </Flex>
      </Tooltip>
    </ChakraLink>
  </NextLink>
);
