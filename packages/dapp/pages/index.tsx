/* eslint-disable import/no-unresolved */
import { Button, Flex, Heading, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';

import { ConnectWallet } from '@/components/ConnectWallet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useWallet } from '@/web3';

const Home: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false);

  const { isConnected } = useWallet();

  return (
    <Flex
      h="full"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading color="main" fontSize={87} pb={10}>
        DAOQuest
      </Heading>

      <Flex>
        {!isConnected && <ConnectWallet />}

        {!isEntered && isConnected && (
          <PrimaryButton onClick={() => setIsEntered(true)}>
            enter
          </PrimaryButton>
        )}
      </Flex>

      {isEntered && (
        <VStack spacing={6}>
          <NextLink href="/search" passHref>
            <PrimaryButton>search for Quest Chain</PrimaryButton>
          </NextLink>
          <NextLink href="/create" passHref>
            <PrimaryButton>create Quest Chain</PrimaryButton>
          </NextLink>
          <NextLink href="/overview" passHref>
            <PrimaryButton>quests overview</PrimaryButton>
          </NextLink>
        </VStack>
      )}
    </Flex>
  );
};

export default Home;
