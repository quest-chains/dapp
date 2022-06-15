import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';

export const How: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      minH="100vh"
      bg="dark"
      bgPosition="center"
      bgAttachment="fixed"
      bgSize="cover"
      position="relative"
      id="how"
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
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={{ base: 0, md: 0 }}
        marginInlineStart="0 !important"
        zIndex={100}
        fontWeight="normal"
        color="white"
      >
        <Flex align="center" mb={10}>
          <Image src="Landing/Circles3.svg" alt="circles3" mr={10} />
          <Heading
            color="main"
            fontSize={79}
            pb={10}
            fontWeight="normal"
            display="flex"
          >
            How
            <Text color="white" ml={6}>
              does it work?
            </Text>
          </Heading>
        </Flex>
        <Flex align="center" mb={10}>
          <Flex flexDir="column" fontSize={{ base: 'lg', md: '3xl' }} ml={20}>
            <Text>
              Learning & engaging becomes rewarding, as questers receive rewards
              for completed quests. It becomes accumulative. Build your digital
              identity and become proud of the things you accomplish or create
              quest chains and spread the knowledge.
            </Text>
            <Text>
              Show the world the
              <Link
                w="100%"
                href="https://vitalik.ca/general/2022/01/26/soulbound.html"
                _hover={{
                  textDecor: 'none',
                  bg: 'whiteAlpha.200',
                }}
                isExternal
                borderRadius="full"
                px={2}
              >
                <span style={{ color: '#2DF8C7', marginLeft: 4 }}>
                  soulbound NFTs
                </span>
              </Link>
              you have collected!
            </Text>
          </Flex>
          <Image src="Landing/Circles4.svg" alt="circles3" mr={10} />
        </Flex>
      </Flex>
    </HStack>
  );
};

// https://vitalik.ca/general/2022/01/26/soulbound.html
