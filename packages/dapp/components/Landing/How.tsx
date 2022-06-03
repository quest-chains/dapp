import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { useRef } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

export const How: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

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
        <Box
          ref={ref}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          maxWidth={{ base: '90%', md: 'sm', '2xl': 'xl' }}
          fontSize={{ base: 'lg', '2xl': '2xl' }}
          lineHeight={{ base: 'lg', '2xl': '2xl' }}
          pl={{ base: 0, md: 0 }}
          zIndex={100}
          transform={`translate3d(0, ${onScreen ? '0' : '50px'}, 0)`}
          opacity={onScreen ? 1 : 0}
          transition="transform 0.3s 0.1s ease-in-out, opacity 0.5s 0.2s ease-in"
          fontWeight="normal"
          color="white"
        >
          <Heading color="main" fontSize={87} pb={10} fontWeight="normal">
            How does it work?
          </Heading>
          <Text>
            Learning & engaging will become rewarding, as people will receive
            rewards for their completed quests. It will become accumulative.
            They will build their digital identity and become proud of the
            things they accomplish, wanting to show the world the NFT’s they’ve
            collected.
          </Text>
        </Box>
      </Container>
    </Stack>
  );
};
