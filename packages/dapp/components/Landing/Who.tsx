import { Box, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { useRef } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

export const Who: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <HStack
      w="full"
      h="full"
      align="center"
      justify="center"
      minH="70vh"
      id="who"
    >
      <Image src="Landing/Circles2.svg" alt="circles2" />
      <Flex
        ref={ref}
        gap={8}
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
        height="340px"
      >
        <Heading
          color="main"
          fontSize={58}
          fontWeight="normal"
          display="flex"
          flexDir="column"
          alignSelf="center"
        >
          Who
          <Text color="white">is it for?</Text>
        </Heading>

        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/RectangleBG1.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          maxW="267px"
          p={6}
          textAlign="center"
        >
          <Heading color="white" fontSize={40} mb={6}>
            PLAYERS
          </Heading>
          <Text mb={4}>♢ DAO newcomers</Text>
          <Text mb={4}>♢ Curious, knowledge hungry people</Text>
        </Box>

        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/RectangleBG2.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          maxW="267px"
          p={6}
          textAlign="center"
        >
          <Heading color="white" fontSize={40} mb={6}>
            CONTENT CREATORS
          </Heading>
          <Text mb={4}>♢ DAOs</Text>
          <Text mb={4}>♢ Organisations that want to create courses</Text>
        </Box>
      </Flex>
    </HStack>
  );
};
