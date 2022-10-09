import {
  Flex,
  Heading,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export const What: React.FC = () => {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

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
      {!isSmallScreen && <Image src="/Landing/Circles.svg" alt="circles" />}

      <Flex
        display="flex"
        flexDirection="column"
        justify="baseline"
        maxWidth={{ base: '90%', md: '5xl' }}
        lineHeight={{ base: 'lg', md: '2xl' }}
        zIndex={100}
        fontWeight="normal"
        color="white"
        alignItems={{ base: 'center', md: 'initial' }}
        fontSize={{ base: 'md', md: '2xl' }}
        p={{ base: 0, md: '24px' }}
      >
        {isSmallScreen && (
          <Image src="/Landing/Circles.svg" alt="circles" width={20} mb={8} />
        )}
        <Heading
          fontSize={{ base: 36, md: 70 }}
          pb={10}
          fontWeight="normal"
          display="flex"
          color="white"
          alignItems={{ base: 'center', md: 'initial' }}
          textAlign={{ base: 'center', md: 'initial' }}
        >
          <Text>
            <span style={{ color: '#2DF8C7' }}>What</span> are we building?
          </Text>
        </Heading>
        <Text>
          We are building a gamified learning / web3 onboarding platform which
          rewards users through questing. Quest makers create quest chains,
          while questers would then complete the quests and get rewarded with
          NFTs, which would showcase their newly acquired skills in profiles.
        </Text>
      </Flex>
    </Flex>
  );
};
