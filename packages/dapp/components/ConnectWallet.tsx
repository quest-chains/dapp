import { HStack, Text } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';

import { useENS } from '@/hooks/useENS';
import { ZERO_ADDRESS } from '@/utils/constants';
import { formatAddress, useWallet } from '@/web3';

import { PrimaryButton } from './PrimaryButton';

export const ConnectWallet: React.FC = () => {
  const {
    connectWallet,
    isConnecting,
    isConnected,
    disconnect,
    address,
  } = useWallet();
  const { ens } = useENS(address);
  return (
    <PrimaryButton
      role="group"
      isLoading={isConnecting}
      onClick={isConnected ? disconnect : connectWallet}
    >
      {!isConnected || !address ? (
        'connect'
      ) : (
        <HStack spacing={2} position="relative">
          <Davatar
            address={address ?? ZERO_ADDRESS}
            size={20}
            generatedAvatarType="jazzicon"
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
