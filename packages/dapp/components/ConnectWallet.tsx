import { Button, HStack, Text } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';

import { ZERO_ADDRESS } from '@/utils/constants';
import { formatAddress, useENS, useWallet } from '@/web3';

export const ConnectWallet: React.FC = () => {
  const { connectWallet, isConnecting, isConnected, disconnect, address } =
    useWallet();
  const { ens } = useENS(address ?? ZERO_ADDRESS);
  return (
    <Button
      role="group"
      isLoading={isConnecting}
      onClick={isConnected ? disconnect : connectWallet}
    >
      {!isConnected || !address ? (
        'Connect Wallet'
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
    </Button>
  );
};
