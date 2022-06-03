import { Box, Container, Stack, Text } from '@chakra-ui/react';
import { useRef } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

export const Who: React.FC = () => {
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
          <Text>Who is it for?</Text>
          <Text>
            PLAYERS ♢ DAO newcomers ♢ Curious, knowledge hungry peopled
          </Text>
          <Text>
            content creators ♢ DAOs ♢ Organisations that want to create courses,
            like buildspace
          </Text>
        </Box>
      </Container>
    </Stack>
  );
};
