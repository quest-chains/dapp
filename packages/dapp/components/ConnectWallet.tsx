import { Button, HStack, Text } from '@chakra-ui/react';
import Davatar from '@davatar/react';
import { utils } from 'ethers';

import { ZERO_ADDRESS } from '@/utils/constants';
import { formatAddress, useENS, useWallet } from '@/web3';

type Props = {
  isHeader?: boolean;
};

export const ConnectWallet: React.FC<Props> = ({ isHeader }) => {
  const { connectWallet, isConnecting, isConnected, disconnect, address } =
    useWallet();
  const { ens } = useENS(address ?? ZERO_ADDRESS);
  return (
    <Button
      role="group"
      isLoading={isConnecting}
      onClick={isConnected ? disconnect : connectWallet}
      px={isHeader ? 4 : 20}
      background="rgba(255, 255, 255, 0.05)"
      fontWeight="400"
      backdropFilter="blur(40px)"
      borderRadius="full"
      boxShadow="inset 0px 0px 0px 1px #AD90FF"
      color="main"
      letterSpacing={4}
      fontSize={isHeader ? 12 : 30}
      height={isHeader ? 8 : 16}
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
    </Button>
  );
};
