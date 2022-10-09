import {
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';

export const Creators: React.FC = () => {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <VStack
      w="full"
      align="center"
      justify="center"
      minH="100vh"
      pos="relative"
      pt={20}
      gap={{ base: 10, md: 60 }}
    >
      <Box
        position="absolute"
        borderRadius="full"
        left="-400px"
        top="-200px"
        height="600px"
        filter="blur(484px)"
        width="600px"
        background="#2DF8C7"
        zIndex={-3}
      />
      {isSmallScreen && (
        <Box h="338px" gridArea="creators" px={12}>
          <Heading
            color="white"
            fontSize={{ base: 36, md: 70 }}
            mb={8}
            textAlign={{ base: 'center', md: 'initial' }}
          >
            Creators
          </Heading>
          <Box flexDir="column" fontSize={{ base: 'md', md: '2xl' }} mb={10}>
            <Text>The permissions of creator roles are cascading.</Text>
            <Text>
              This means the owners have all permissions of admins, admins have
              all permissions of editors and editors have all permissions of
              reviewers.
            </Text>
            <Text>
              Owners can add and remove other owners, admins, editors and
              reviewers. Admins can add and remove editors and reviewers.
            </Text>
          </Box>
        </Box>
      )}
      <Grid
        display={{ base: 'initial', md: 'grid' }}
        gap={{ base: 3, md: 0 }}
        id="creators"
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: '265px 265px 265px 265px',
        }}
        templateRows="auto"
        templateAreas={{
          md: `
            "creators creators creators reviewers"
            "owner q editors empty"
            "empty1 admins empty2 empty2"
          `,
        }}
        fontSize={{ base: 'md', md: '2xl' }}
      >
        {!isSmallScreen && (
          <Box h="338px" gridArea="creators" mb={40} mr={10}>
            <Heading color="white" fontSize={70} mb={6}>
              Creators
            </Heading>
            <Flex flexDir="column">
              <Text>
                The permissions of creator roles are{' '}
                <span style={{ color: '#2DF8C7', marginLeft: 4 }}>
                  cascading
                </span>
                .
              </Text>
              <Text>
                This means the owners have all permissions of admins, admins
                have all permissions of editors and editors have all permissions
                of reviewers.
              </Text>
              <Text>
                Owners can add and remove other owners, admins, editors and
                reviewers. Admins can add and remove editors and reviewers.
              </Text>
            </Flex>
          </Box>
        )}
        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/Card4.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          p={6}
          h="338px"
          gridArea="reviewers"
        >
          <Heading
            color="white"
            fontSize={{ base: 28, md: 40 }}
            mb={14}
            textAlign="center"
          >
            Reviewers
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: '2xl' }}
            maxW={{ base: '220px', md: 'full' }}
          >
            Can{' '}
            <span style={{ color: '#2DF8C7' }}>
              accept or reject submitted proof
            </span>{' '}
            of quest completion
          </Text>
        </Box>

        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/Card1.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          p={8}
          h="338px"
          gridArea="owner"
        >
          <Heading
            color="white"
            fontSize={{ base: 28, md: 40 }}
            mb={3}
            textAlign="center"
          >
            Owner/s
          </Heading>
          <Text
            mt={10}
            fontSize={{ base: 'md', md: '2xl' }}
            maxW={{ base: '220px', md: 'full' }}
          >
            Creator of the quest chain,{' '}
            <span style={{ color: '#2DF8C7' }}>has all permissions</span>
          </Text>
        </Box>
        {!isSmallScreen && (
          <Flex
            dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            p={6}
            textAlign="center"
            h="338px"
            gridArea="q"
          >
            <Image src="/Landing/Q.svg" alt="circles3" mr={10} />
          </Flex>
        )}
        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/Card3.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          p={8}
          h="338px"
          gridArea="editors"
        >
          <Heading
            color="white"
            fontSize={{ base: 28, md: 40 }}
            mb={8}
            textAlign="center"
          >
            Editors
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: '2xl' }}
            maxW={{ base: '220px', md: 'full' }}
          >
            Can <span style={{ color: '#2DF8C7' }}>create and edit</span>{' '}
            quests. They can also disable and enable them as well.
          </Text>
        </Box>
        <Box gridArea="empty" />

        <Box gridArea="empty1" />
        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/Card2.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          p={8}
          h="338px"
          gridArea="admins"
        >
          <Heading
            color="white"
            fontSize={{ base: 28, md: 40 }}
            mb={12}
            textAlign="center"
          >
            Admins
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: '2xl' }}
            maxW={{ base: '220px', md: 'full' }}
          >
            Can <span style={{ color: '#2DF8C7' }}>create and edit</span> quest
            chains and quests
          </Text>
        </Box>
        <Box gridArea="empty2" />
      </Grid>
      <Flex w="full" pos="relative" justifyContent="center" mt={40}>
        {!isSmallScreen && (
          <Image
            src="/Landing/Turbine.svg"
            position="absolute"
            left="0"
            top="-400px"
            alt="turbine"
          />
        )}

        <Box
          id="questers"
          background={{
            base: 'none',
            md: 'radial-gradient(100% 100% at 100% 71%, rgba(255, 255, 255, 0.14) 17%, rgba(255, 255, 255, 0) 100%)',
          }}
          backdropFilter={{ base: 'none', md: 'blur(20px)' }}
          border={{ base: 'none', md: '1px solid #2DF8C7' }}
          borderRadius={{ base: 'none', md: '29.8157px' }}
          w="80%"
          h={{ base: 'initial', md: '528px' }}
          p={{ base: 0, md: 24 }}
          mb={{ base: 24, md: 0 }}
          fontSize={{ base: 'lg', md: '2xl' }}
        >
          <Heading fontSize={{ base: 36, md: 70 }} mb={12} textAlign="center">
            Questers
          </Heading>
          <Text mb={6}>
            Can complete quest chains by submitting proof of completion for
            quests
          </Text>
          <Text>
            They are able to mint an NFT after successfully completing all of
            the quests of a quest chain
          </Text>
        </Box>
      </Flex>
    </VStack>
  );
};
