import { ExternalLinkIcon } from '@chakra-ui/icons';
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
import Davatar from '@davatar/react';
import NextLink from 'next/link';
import React from 'react';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { useENS } from '@/hooks/useENS';
import {
  formatAddress,
  NETWORK_INFO,
  switchChainOnMetaMask,
  useWallet,
} from '@/web3';

import { PrimaryButton } from './PrimaryButton';
import { SubmitButton } from './SubmitButton';

export const WalletDisplay: React.FC = () => {
  const { address, chainId, isMetaMask, disconnect } = useWallet();
  const { ens } = useENS(address);

  const placement = useBreakpointValue({
    base: 'bottom',
    md: 'bottom-end',
  }) as PlacementWithLogical;

  if (!address || !chainId) return null;
  return (
    <Popover placement={placement} gutter={20}>
      {/* @ts-expect-error @chakra-ui/react does not support @types/react@18 yet */}
      <PopoverTrigger>
        <Box>
          <PrimaryButton
            px={2}
            background="rgba(255, 255, 255, 0.05)"
            fontWeight="400"
            backdropFilter="blur(40px)"
            borderRadius="full"
            boxShadow="inset 0px 0px 0px 1px #AD90FF"
            letterSpacing={2}
            color="main"
            fontSize={14}
            height={10}
            zIndex={1500}
          >
            <HStack spacing={2}>
              <Davatar
                address={address}
                size={24}
                generatedAvatarType="jazzicon"
              />
              <Text fontWeight="normal" fontSize="normal">
                {formatAddress(address, ens)}
              </Text>
              <NetworkDisplay
                chainId={chainId}
                fontWeight="normal"
                spacing={1}
                asTag
              />
            </HStack>
          </PrimaryButton>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        backdropFilter="blur(40px)"
        boxShadow="inset 0px 0px 0px 1px #AD90FF"
        background="whiteAlpha.50"
        borderRadius="xl"
      >
        <PopoverBody>
          <VStack w="100%" p={4} spacing={4}>
            <VStack w="100%" spacing={0} align="stretch">
              <NextLink href={`/profile/${address}`} passHref>
                <Link display="block" _hover={{}}>
                  <SubmitButton
                    onClick={disconnect}
                    px={4}
                    fontSize="md"
                    height={10}
                    width="full"
                  >
                    Profile
                  </SubmitButton>
                </Link>
              </NextLink>
              <Flex p={2} justify="space-between" align="center">
                <NetworkDisplay chainId={chainId} fontSize="xl" />
                <Box bg="main" borderRadius="50%" h={2} w={2} />
              </Flex>
              <Tooltip label="View in Block Explorer">
                <Link
                  w="100%"
                  href={`${NETWORK_INFO[chainId].explorer}/address/${address}`}
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
                    {NETWORK_INFO[chainId].explorerLabel}
                    <ExternalLinkIcon />
                  </Flex>
                </Link>
              </Tooltip>
            </VStack>
            <Divider borderColor="ceruleanBlue" borderBottomWidth="1px" />
            <VStack w="100%" spacing={2} align="stretch">
              <Text fontSize="lg">Supported Networks</Text>
              {Object.keys(NETWORK_INFO)
                .filter(c => c !== chainId)
                .map(c => {
                  const inner = (
                    <Button
                      w="100%"
                      p={2}
                      as={isMetaMask ? 'button' : 'div'}
                      background="transparent"
                      onClick={
                        isMetaMask ? () => switchChainOnMetaMask(c) : undefined
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
                      label={`Switch to ${NETWORK_INFO[c].name}`}
                      key={c}
                    >
                      {inner}
                    </Tooltip>
                  ) : (
                    inner
                  );
                })}
            </VStack>
            <Divider borderColor="ceruleanBlue" borderBottomWidth="1px" />
            <SubmitButton onClick={disconnect} px={4} fontSize="md" height={10}>
              Disconnect
            </SubmitButton>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
