import { HStack, Text } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useENS } from '@/hooks/useENS';
import { formatAddress, useWallet } from '@/web3';
import { getEthersProvider } from '@/web3/providers';

export const ConnectWallet: React.FC = () => {
  const { connectWallet, isConnecting, isConnected, disconnect, address } =
    useWallet();
  const { ens } = useENS(address);
  return (
    <PrimaryButton
      role="group"
      isLoading={isConnecting}
      onClick={isConnected ? disconnect : connectWallet}
      px={4}
      background="rgba(255, 255, 255, 0.05)"
      fontWeight="bold"
      backdropFilter="blur(40px)"
      borderRadius="full"
      boxShadow="inset 0px 0px 0px 1px #AD90FF"
      letterSpacing={1}
      color="main"
      fontSize={14}
      height={10}
    >
      {!address || !isConnected ? (
        'Connect Wallet'
      ) : (
        <HStack spacing={2} position="relative">
          <Davatar
            address={address}
            size={20}
            generatedAvatarType="jazzicon"
            provider={getEthersProvider('0x1')}
          />
          <Text
            transition="opacity 0.25s"
            _groupHover={{ opacity: 0 }}
            minW="6rem"
            textAlign="left"
          >
            {formatAddress(utils.getAddress(address), ens)}
          </Text>
          <Text
            position="absolute"
            left={5}
            my="auto"
            opacity={0}
            transition="opacity 0.25s"
            _groupHover={{ opacity: 1 }}
            textAlign="left"
          >
            Disconnect?
          </Text>
        </HStack>
      )}
    </PrimaryButton>
  );
};
