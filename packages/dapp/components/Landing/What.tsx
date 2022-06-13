import { Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { useRef } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

export const What: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <HStack w="full" align="center" justify="center" minH="70vh" id="what">
      <Image src="Landing/Circles.svg" alt="circles" />
      <Flex
        ref={ref}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        maxWidth={{ base: '90%', md: '5xl' }}
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={{ base: 0, md: 0 }}
        zIndex={100}
        transform={`translate3d(0, ${onScreen ? '0' : '50px'}, 0)`}
        opacity={onScreen ? 1 : 0}
        transition="transform 0.1s 0.1s ease-in-out, opacity 0.1s 0.1s ease-in"
        fontWeight="normal"
        color="white"
      >
        <Heading
          color="main"
          fontSize={70}
          pb={10}
          fontWeight="normal"
          display="flex"
        >
          What
          <Text color="white" ml={6}>
            are we building?
          </Text>
        </Heading>
        <Text fontSize={{ base: 'lg', md: '3xl' }}>
          We are building a gamified learning / web3 onboarding platform which
          rewards users through questing. Quest makers create quest chains,
          while questers would then complete the quests and get rewarded with
          NFTs, which would showcase their newly acquired skills in profiles.
        </Text>
      </Flex>
    </HStack>
  );
};
