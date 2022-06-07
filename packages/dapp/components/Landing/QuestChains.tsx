import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { PrimaryButton } from '../PrimaryButton';

export const QuestChains: React.FC = () => {
  return (
    <Stack
      w="full"
      align="center"
      justify="center"
      spacing={[6, 8]}
      minH="100vh"
      sx={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'normal',
      }}
      bgImage="url(/Hero-Background1.svg)"
      bgPosition="center"
      bgSize="contain"
      backgroundRepeat="no-repeat"
    >
      <Container
        d="flex"
        maxW={{
          base: '100%',
          md: 'xl',
          lg: '7xl',
          '2xl': 'full',
          '4xl': '90%',
        }}
        // background="radial-gradient(transparent 13%, #0d1117 80%)"
        bgPosition="center"
        bgSize="contain"
        minH="100vh"
        px={{ base: 'inherit', lg: 14 }}
        height="100%"
        alignItems="center"
        justifyContent={{ base: 'center', md: 'flex-start' }}
        position="relative"
      >
        <Box
          position="absolute"
          borderRadius="full"
          right="-100px"
          top="-300px"
          height="600px"
          filter="blur(484px)"
          width="600px"
          background="#2DF8C7"
          zIndex={-3}
        />
        <Box
          position="absolute"
          borderRadius="full"
          left="-400px"
          bottom="-300px"
          height="600px"
          filter="blur(484px)"
          width="600px"
          background="#2DF8C7"
          zIndex={-3}
        />
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading fontSize={148} pb={10} fontWeight="normal" color="white">
            <VStack>
              <Flex>
                <Image src="/Star1.svg" alt="star1" />
                Quest
              </Flex>
              <Flex>
                Chains
                <Image src="/Star2.svg" alt="star2" />
              </Flex>
            </VStack>
          </Heading>
          <Flex gap={3}>
            <NextLink href="/explore" passHref>
              <ChakraLink display="block" _hover={{}} zIndex={1500}>
                <PrimaryButton>explore</PrimaryButton>
              </ChakraLink>
            </NextLink>
          </Flex>
        </Flex>
      </Container>
    </Stack>
  );
};
