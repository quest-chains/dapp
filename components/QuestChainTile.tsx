import { WarningIcon } from '@chakra-ui/icons';
import {
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
  featured?: boolean;
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
  featured = false,
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
        h={completed === 0 || !!completed || featured ? '16.5rem' : '14rem'}
      >
        <VStack
          cursor="pointer"
          align="stretch"
          w="full"
          p={6}
          pt={4}
          transition="border-color 0.15s, box-shadow 0.15s"
          _hover={{
            // On hover the background image is not show. Show imo does not look great.
            background: imageUrl
              ? `linear-gradient(180deg, rgba(0, 0, 0, 0.8) 24.63%, rgba(0, 0, 0, 1) 70.9%), url(${ipfsUriToHttp(
                  imageUrl,
                )})`
              : 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 24.63%, rgba(0, 0, 0, 0.95) 70.9%),#4A0662',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderColor: 'main',
            boxShadow: '0px 0px 20px rgba(45, 248, 199, 0.32);',
          }}
          fontWeight="400"
          border="2px solid"
          // TODO not the exact color as in figma
          borderColor={'gray'}
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
          backgroundPosition="center"
          backgroundSize="cover"
        >
          <Flex
            justifyContent={'space-between'}
            flexDirection={'column'}
            flex={'1'}
          >
            <Flex ml={-2}>
              <UserDisplay address={createdBy} size="xs" />
            </Flex>

            <Flex direction="column" gap={2}>
              <Flex justifyContent="space-between">
                <Text
                  fontSize={featured ? '2xl' : 'xl'}
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
              {typeof completed === 'number' && (
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
              <Flex w="100%" align="end" h="3rem">
                <Text
                  display="-webkit-box"
                  lineHeight={'20px'}
                  color="whiteAlpha.700"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  maxW="calc(100%)"
                  fontSize={featured ? '14px' : '13px'}
                  sx={{
                    lineClamp: 2,
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {removeMd(description ?? '')}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                {/* TODO in Figma the color is #BFA4C7 which is not exactly purple 100 */}
                <Text color="purple.100" fontSize="13px">
                  {quests} quests
                </Text>
                <NetworkDisplay
                  chainId={chainId}
                  imageProps={{ boxSize: '1rem' }}
                  textProps={{ color: 'purple.100', fontSize: '13px' }}
                  spacing={1}
                />
              </Flex>
            </Flex>
          </Flex>
        </VStack>
      </Flex>
    </ChakraLink>
  </NextLink>
);
