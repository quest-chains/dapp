import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export const Who: React.FC = () => {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <HStack
      w="full"
      h="full"
      align="center"
      justify="center"
      minH="70vh"
      id="who"
    >
      {!isSmallScreen && <Image src="/Landing/Circles2.svg" alt="circles" />}
      <Flex
        gap={8}
        justifyContent="center"
        maxWidth={{ base: '90%', md: '5xl' }}
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'center', md: 'initial' }}
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={{ base: 0, md: 0 }}
        zIndex={100}
        fontWeight="normal"
        color="white"
        height={{ base: '100%', md: '340px' }}
        my={{ base: 24, md: 0 }}
      >
        {isSmallScreen && (
          <Image
            src="/Landing/Circles2.svg"
            alt="circles"
            width={20}
            mb={{ base: 0, md: 8 }}
          />
        )}
        <Heading
          color="main"
          fontSize={{ base: 36, md: 58 }}
          fontWeight="normal"
          display="flex"
          flexDir="column"
          alignSelf="center"
          alignItems={{ base: 'center', md: 'start' }}
        >
          Who
          <Text color="white">is it for?</Text>
        </Heading>

        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/RectangleBG1.svg)"
          bgPosition={{ base: 'bottom', md: 'center' }}
          bgSize={{ base: 'cover', md: 'contain' }}
          backgroundRepeat="no-repeat"
          maxW="267px"
          p={6}
          textAlign="center"
        >
          <Heading color="white" fontSize={{ base: 28, md: 40 }} mb={6}>
            Questers
          </Heading>
          <Text mb={4}>♢ DAO newcomers</Text>
          <Text mb={4}>♢ Curious, knowledge hungry people</Text>
        </Box>

        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/RectangleBG2.svg)"
          bgPosition={{ base: 'bottom', md: 'center' }}
          bgSize={{ base: 'cover', md: 'contain' }}
          backgroundRepeat="no-repeat"
          maxW="267px"
          p={6}
          textAlign="center"
        >
          <Heading color="white" fontSize={{ base: 28, md: 40 }} mb={6}>
            Creators
          </Heading>
          <Text mb={4}>♢ DAOs</Text>
          <Text mb={4}>♢ Organisations that want to create courses</Text>
        </Box>
      </Flex>
    </HStack>
  );
};
