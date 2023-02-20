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
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import removeMd from 'remove-markdown';

import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { AVAILABLE_NETWORK_INFO } from '@/web3';

import { NetworkDisplay } from './NetworkDisplay';
import { UserDisplay } from './UserDisplay';

type QuestChainTileProps = {
  address: string;
  chainId: string;
  createdBy: string;
  name?: string | undefined | null;
  description?: string | undefined | null;
  slug?: string | undefined | null;
  imageUrl?: string | undefined | null;
  completed?: number;
  quests: number;
  onClick?: () => void;
  paused?: boolean;
};

export const QuestChainTile: React.FC<QuestChainTileProps> = ({
  address,
  name,
  createdBy,
  description,
  slug,
  chainId,
  completed,
  quests,
  imageUrl,
  onClick = () => undefined,
  paused = false,
}) => (
  <NextLink
    as={`/${AVAILABLE_NETWORK_INFO[chainId].urlName}/${slug || address}`}
    href="/[chainId]/[address]"
    passHref
  >
    <ChakraLink
      display="block"
      _hover={{}}
      w="full"
      borderRadius={8}
      onClick={onClick}
    >
      <Flex
        direction="column"
        align="center"
        // TODO is this required for in the new flow
        h={completed === 0 || !!completed ? '16.5rem' : '14rem'}
      >
        <VStack
          cursor="pointer"
          align="stretch"
          w="full"
          p={6}
          transition="all 0.25s"
          _hover={{
            // On hover the background image is not show. Show imo does not look great.
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 24.63%, rgba(0, 0, 0, 0.95) 70.9%), #4A0662;',
            borderColor: 'main',
            boxShadow: '0px 0px 20px rgba(45, 248, 199, 0.32);',
          }}
          fontWeight="400"
          border="2px solid"
          // TODO not the exact color as in figma
          borderColor={'whiteAlpha.500'}
          spacing={4}
          flex={1}
          borderRadius={8}
          pos="relative"
          justifyContent={'end'}
          // TODO Not looking exactly like figma
          background={
            imageUrl
              ? `linear-gradient(180deg, rgba(0, 0, 0, 0.6) 24.63%, rgba(0, 0, 0, 0.95) 70.9%), url(${ipfsUriToHttp(
                  imageUrl,
                )})`
              : 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 24.63%, rgba(0, 0, 0, 0.95) 70.9%),#111111'
          }
        >
          <Flex
            justifyContent={'space-between'}
            flexDirection={'column'}
            flex={'1'}
          >
            <UserDisplay address={createdBy} size="sm" />

            <Flex direction="column" gap={2}>
              <Flex justifyContent="space-between">
                <Text
                  fontSize="xl"
                  fontFamily={'Museo Moderno'}
                  fontWeight="700"
                  lineHeight="24px"
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
                  {name}
                </Text>
                {paused && (
                  <Tag
                    variant="subtle"
                    colorScheme="orange"
                    borderRadius="full"
                  >
                    <TagLeftIcon as={WarningIcon} boxSize="1.25rem" />
                    <TagLabel color="white">Disabled</TagLabel>
                  </Tag>
                )}
              </Flex>
              {completed && (
                <Flex justify="space-between" align="center">
                  <Progress
                    value={
                      completed >= quests
                        ? 100
                        : Number(((completed / quests) * 100).toFixed(2))
                    }
                    size="xs"
                    w="80%"
                  />
                  <Text whiteSpace="nowrap">
                    {((completed / quests) * 100).toFixed(0)} %
                  </Text>
                </Flex>
              )}
              <Text
                display="-webkit-box"
                lineHeight={'20px'}
                color="whiteAlpha.700"
                textOverflow="ellipsis"
                overflow="hidden"
                maxW="calc(100%)"
                fontSize={14}
                sx={{
                  lineClamp: 2,
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {removeMd(description ?? '')}
              </Text>
              <Flex justifyContent="space-between">
                {/* TODO in Figma the color is #BFA4C7 which is not exactly purple 100 */}
                <Text color="purple.100">{quests} quests</Text>
                <NetworkDisplay
                  chainId={chainId}
                  textProps={{ color: 'purple.100' }}
                />
              </Flex>
            </Flex>
          </Flex>
        </VStack>
      </Flex>
    </ChakraLink>
  </NextLink>
);
