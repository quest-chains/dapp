import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export const How: React.FC = () => {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      minH={{ base: '70vh', md: '100vh' }}
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
        display="flex"
        flexDirection="column"
        justifyContent="center"
        lineHeight={{ base: 'lg', '2xl': '2xl' }}
        pl={0}
        marginInlineStart="0 !important"
        zIndex={100}
        fontWeight="normal"
        color="white"
        fontSize={{ base: 'md', md: '2xl' }}
      >
        <Flex
          align="center"
          mb={{ base: 0, md: 8 }}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          {!isSmallScreen && (
            <Image src="/Landing/Circles3.svg" alt="circles3" mr={10} />
          )}
          <Heading
            color="main"
            fontSize={{ base: 36, md: 79 }}
            fontWeight="normal"
            display="flex"
            flexDir="column"
            textAlign={{ base: 'center', md: 'initial' }}
          >
            How <Text color="white">does it work?</Text>
          </Heading>
        </Flex>
        <Flex align="center">
          <Flex
            flexDir="column"
            fontSize={{ base: 'md', md: '2xl' }}
            p={{ base: 12, md: 32 }}
          >
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
                <span style={{ color: '#2DF8C7' }}>soulbound NFTs</span>
              </Link>
              you have collected!
            </Text>
            <Flex alignSelf={{ base: 'center', md: 'auto' }}>
              {!isSmallScreen && (
                <Image
                  src="/Landing/NFTs/NFT1.png"
                  alt="NFT1"
                  title="NFT1"
                  height="20rem"
                />
              )}
              {!isSmallScreen && (
                <Image
                  src="/Landing/NFTs/NFT2.png"
                  alt="NFT2"
                  title="NFT2"
                  height="20rem"
                />
              )}
              <Image
                src="/Landing/NFTs/NFT3.png"
                alt="NFT3"
                title="NFT3"
                height="20rem"
              />
            </Flex>
          </Flex>
          {!isSmallScreen && (
            <Image src="/Landing/Circles4.svg" alt="circles3" mr={10} />
          )}
        </Flex>
      </Flex>
    </HStack>
  );
};
