import { Box, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { useRef } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

export const How: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      spacing={[6, 8]}
      minH="100vh"
      bg="dark"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      sx={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'normal',
      }}
      position="relative"
    >
      <Box
        position="absolute"
        borderRadius="full"
        right="-300px"
        top="-300px"
        height="600px"
        filter="blur(484px)"
        width="600px"
        background="#2DF8C7"
        zIndex={-3}
      />
      <Flex
        ref={ref}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        // maxWidth="full"
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={{ base: 0, md: 0 }}
        marginInlineStart="0 !important"
        zIndex={100}
        transform={`translate3d(0, ${onScreen ? '0' : '50px'}, 0)`}
        opacity={onScreen ? 1 : 0}
        transition="transform 0.2s 0.1s ease-in-out, opacity 0.2s 0.2s ease-in"
        fontWeight="normal"
        color="white"
      >
        <Flex align="center" mb={10}>
          <Image src="/Circles3.svg" alt="circles3" mr={10} />
          <Heading
            color="main"
            fontSize={79}
            pb={10}
            fontWeight="normal"
            display="flex"
          >
            <Text color="white" mr={6}>
              How
            </Text>
            does it work?
          </Heading>
        </Flex>
        <Flex align="center" mb={10}>
          <Text fontSize={{ base: 'lg', md: '3xl' }} ml={20}>
            Learning & engaging will become rewarding, as people will receive
            rewards for their completed quests. It will become accumulative.
            They will build their digital identity and become proud of the
            things they accomplish, wanting to show the world the NFT’s they’ve
            collected.
          </Text>
          <Image src="/Circles4.svg" alt="circles3" mr={10} />
        </Flex>
      </Flex>
    </HStack>
  );
};
