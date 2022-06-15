import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useRef } from 'react';

export const What: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Flex
      w="full"
      align="start"
      justify="center"
      minH="40vh"
      id="what"
      gap={10}
      pt={20}
    >
      <Image src="Landing/Circles.svg" alt="circles" />
      <Flex
        ref={ref}
        display="flex"
        flexDirection="column"
        justify="baseline"
        maxWidth={{ base: '90%', md: '5xl' }}
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={{ base: 0, md: 0 }}
        zIndex={100}
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
    </Flex>
  );
};
