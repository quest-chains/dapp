import { Box, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { Link } from 'react-scroll';

import { useOnScreen } from '@/hooks/useOnScreen';

export const BuiltWith: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      minH="80vh"
      bg="dark"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      position="relative"
    >
      <Box
        position="absolute"
        borderRadius="full"
        right="-300px"
        top="-300px"
        height="400px"
        filter="blur(484px)"
        width="400px"
        background="#2DF8C7"
        zIndex={-3}
      />
      <Flex
        ref={ref}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={{ base: 0, md: 0 }}
        marginInlineStart="0 !important"
        zIndex={100}
        w="full"
        transform={`translate3d(0, ${onScreen ? '0' : '50px'}, 0)`}
        opacity={onScreen ? 1 : 0}
        transition="transform 0.1s 0.1s ease-in-out, opacity 0.1s 0.1s ease-in"
        fontWeight="normal"
        color="white"
      >
        <Flex align="center" mb={10}>
          <Image src="Landing/Circles5.svg" alt="circles3" mr={10} />
          <Flex flexDir="column">
            <Heading
              color="main"
              fontSize={79}
              pb={10}
              fontWeight="normal"
              display="flex"
            >
              Built
              <Text color="white" ml={6}>
                with
              </Text>
            </Heading>
            <Flex align="center" gap={8} alignSelf="center">
              <Image
                src="Landing/Logos/thegraph.svg"
                alt="thegraph"
                height={20}
              />
              <Image src="Landing/Logos/ipfs.png" alt="ipfs" height={20} />
              <Image src="Landing/Logos/next.png" alt="next" height={20} />
              <Image src="Landing/Logos/chakra.png" alt="chakra" height={20} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Link to="quest-chains" spy={true} smooth={true} duration={800}>
        <Image
          src="Landing/Up.svg"
          alt="up"
          mr={10}
          pos="absolute"
          right={50}
          bottom={20}
          cursor="pointer"
        />
      </Link>
    </HStack>
  );
};
