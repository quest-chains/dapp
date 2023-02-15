import { ExternalLinkIcon, TriangleDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Link,
  PlacementWithLogical,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { SubmitButton } from '@/components/SubmitButton';
import {
  AVAILABLE_NETWORK_INFO,
  formatAddress,
  isSupportedNetwork,
  SUPPORTED_NETWORK_INFO,
  switchChainOnMetaMask,
  useWallet,
} from '@/web3';

import { UserAvatar } from '../UserAvatar';

export const WalletDisplay: React.FC = () => {
  const { address, chainId, isMetaMask, disconnect, user, ens } = useWallet();

  const placement = useBreakpointValue({
    base: 'bottom',
    md: 'bottom-end',
  }) as PlacementWithLogical;

  if (!address || !chainId) return null;

  const isSupportedChain = isSupportedNetwork(chainId);
  return (
    <Popover placement={placement} gutter={20} trigger="hover">
      <PopoverTrigger>
        <Box>
          {isSupportedChain ? (
            <Flex
              fontWeight="400"
              fontSize={14}
              height={10}
              zIndex={1500}
              width="max-content"
              borderRadius="full"
              cursor="pointer"
              alignItems="center"
              gap={3}
            >
              <UserAvatar address={address} profile={user} size={32} />
              <Flex flexDir="column">
                <Text fontWeight="bold" fontSize="normal">
                  {user?.username ?? formatAddress(address, ens)}
                </Text>
                <Text fontSize="small">
                  {AVAILABLE_NETWORK_INFO[chainId].label}
                </Text>
              </Flex>
              <TriangleDownIcon w={3} />
            </Flex>
          ) : (
            <Button px={6} fontSize="md" borderRadius="full" colorScheme="red">
              Wrong Network
            </Button>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent
        backdropFilter="blur(40px)"
        boxShadow="inset 0px 0px 0px 1px #AD90FF"
        background="rgba(45, 56, 72, 1)"
        borderRadius="xl"
      >
        <PopoverBody>
          <VStack w="100%" p={4} spacing={4}>
            <VStack w="100%" spacing={0} align="stretch">
              <Flex p={2} justify="space-between" align="center">
                <NetworkDisplay chainId={chainId} fontSize="xl" />
                <Box bg="main" borderRadius="50%" h={2} w={2} />
              </Flex>
              <Tooltip label="View in Block Explorer">
                <Link
                  w="100%"
                  href={`${SUPPORTED_NETWORK_INFO[chainId].explorer}/address/${address}`}
                  _hover={{
                    textDecor: 'none',
                    bg: 'whiteAlpha.200',
                  }}
                  isExternal
                  borderRadius="full"
                  py={2}
                  px={3}
                >
                  <Flex
                    w="100%"
                    justify="space-between"
                    align="center"
                    borderRadius="full"
                  >
                    {SUPPORTED_NETWORK_INFO[chainId].explorerLabel}
                    <ExternalLinkIcon />
                  </Flex>
                </Link>
              </Tooltip>
            </VStack>
            <Divider borderColor="ceruleanBlue" borderBottomWidth="1px" />
            {Object.keys(SUPPORTED_NETWORK_INFO).length > 1 && (
              <>
                <VStack w="100%" spacing={2} align="stretch">
                  <Text fontSize="lg">Supported Networks</Text>
                  {Object.keys(SUPPORTED_NETWORK_INFO)
                    .filter(c => c !== chainId)
                    .map(c => {
                      const inner = (
                        <Button
                          w="100%"
                          p={2}
                          as={isMetaMask ? 'button' : 'div'}
                          background="transparent"
                          onClick={
                            isMetaMask
                              ? () => switchChainOnMetaMask(c)
                              : undefined
                          }
                          _hover={{ bg: 'whiteAlpha.200' }}
                          borderRadius="full"
                          key={c}
                          justifyContent="flex-start"
                        >
                          <NetworkDisplay chainId={c} fontWeight="normal" />
                        </Button>
                      );
                      return isMetaMask ? (
                        <Tooltip
                          label={`Switch to ${SUPPORTED_NETWORK_INFO[c].name}`}
                          key={c}
                        >
                          {inner}
                        </Tooltip>
                      ) : (
                        inner
                      );
                    })}
                </VStack>
                <Divider borderColor="ceruleanBlue" borderBottomWidth="1px" />{' '}
              </>
            )}
            <HStack justify="space-between" w="100%">
              <NextLink href="/settings" passHref>
                <Link display="block" _hover={{}}>
                  <SubmitButton px={4} fontSize="md" height={10} width="full">
                    Settings
                  </SubmitButton>
                </Link>
              </NextLink>
              <SubmitButton
                onClick={disconnect}
                px={4}
                fontSize="md"
                height={10}
              >
                Disconnect
              </SubmitButton>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
