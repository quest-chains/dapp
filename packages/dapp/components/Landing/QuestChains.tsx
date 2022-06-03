import {
  Container,
  Flex,
  Heading,
  Link as ChakraLink,
  Stack,
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
      bg="dark"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      p={{ base: 4, md: 8, lg: 12 }}
      sx={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'normal',
      }}
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
        px={{ base: 'inherit', lg: 14 }}
        height="100%"
        alignItems="center"
        justifyContent={{ base: 'center', md: 'flex-start' }}
      >
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading color="main" fontSize={87} pb={10} fontWeight="normal">
            Quest Chains
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
