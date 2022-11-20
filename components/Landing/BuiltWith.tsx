import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Link } from 'react-scroll';

import { SUPPORTED_NETWORK_INFO } from '@/web3/networks';

export const BuiltWith: React.FC = () => {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      minH={{ base: '120vh', md: '80vh' }}
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
        display="flex"
        flexDirection="column"
        justifyContent="center"
        lineHeight={{ base: 'lg', md: '2xl' }}
        pl={{ base: 0, md: 0 }}
        marginInlineStart="0 !important"
        zIndex={100}
        w="full"
        fontWeight="normal"
        color="white"
      >
        <Grid
          mb={20}
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          {!isSmallScreen && (
            <Image src="/Landing/Circles5.svg" alt="circles3" mr={10} />
          )}
          <Flex flexDir="column" mr={{ base: 0, md: 20 }}>
            <Heading
              color="main"
              fontSize={{ base: 36, md: 79 }}
              pb={10}
              pt={{ base: 10, md: 0 }}
              fontWeight="normal"
              display="flex"
              alignSelf="center"
            >
              Built
              <Text color="white" ml={6}>
                with
              </Text>
            </Heading>
            <Grid gap={8} alignSelf="center" templateColumns="repeat(3, 1fr)">
              <Image
                src="/Landing/Logos/thegraph.svg"
                alt="thegraph"
                title="TheGraph"
                height={20}
              />
              <Image
                src="/Landing/Logos/ipfs.png"
                alt="ipfs"
                title="IPFS"
                height={20}
              />
              <Image
                src="/Landing/Logos/next.png"
                alt="next"
                title="NextJS"
                height={20}
              />
              <Image
                src="/Landing/Logos/chakra.png"
                alt="chakra"
                title="ChakraUI"
                height={20}
              />
              <Image
                src="/Landing/Logos/ethereum.png"
                alt="ethereum"
                title="Ethereum"
                height={20}
              />
              {/* <Image
                src="/Landing/Logos/web3storage.svg"
                alt="web3storage"
                title="Web3 Storage"
                height={20}
              /> */}
              <Image
                src="/Landing/Logos/filecoin.png"
                alt="filecoin"
                title="Filecoin"
                height={20}
              />
            </Grid>
          </Flex>
          <Flex flexDir="column">
            <Heading
              color="main"
              fontSize={{ base: 36, md: 79 }}
              pb={10}
              pt={{ base: 10, md: 0 }}
              fontWeight="normal"
              display="flex"
              flexDir="column"
              alignSelf="center"
            >
              <Text color="white">Supported</Text>
              Networks
            </Heading>
            <Grid gap={8} alignSelf="center" templateColumns="repeat(4, 1fr)">
              {Object.keys(SUPPORTED_NETWORK_INFO).map(chainId => (
                <Box textAlign="center" key={chainId}>
                  <Text mb={3}>{SUPPORTED_NETWORK_INFO[chainId].label}</Text>
                  <Image
                    src={SUPPORTED_NETWORK_INFO[chainId].image}
                    alt={SUPPORTED_NETWORK_INFO[chainId].name}
                    title={SUPPORTED_NETWORK_INFO[chainId].name}
                    height={{ base: 16, md: 20 }}
                  />
                </Box>
              ))}
            </Grid>
          </Flex>
        </Grid>
      </Flex>
      {/* @ts-expect-error */}
      <Link to="quest-chains" spy={true} smooth={true} duration={800}>
        <Image
          src="/Landing/Up.svg"
          alt="up"
          mr={10}
          pos="absolute"
          right={{ base: 4, md: 50 }}
          bottom={{ base: 5, md: 20 }}
          cursor="pointer"
        />
      </Link>
    </HStack>
  );
};
