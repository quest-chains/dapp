import {
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

export const Creators: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <VStack
      w="full"
      align="center"
      justify="center"
      minH="100vh"
      pos="relative"
      pt={20}
      gap={60}
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
      <Grid
        id="creators"
        templateColumns="265px 265px 265px 265px"
        templateRows="auto"
        templateAreas={`
          "creators creators creators reviewers"
          "owner q editors empty"
          "empty1 admins empty2 empty2"
        `}
        // templateAreas={`
        //   "creators creators creators header"
        //   "owner q editors empty"
        //   "empty admins empty empty"
        // `}
        // gap={6}
        ref={ref}
        transform={`translate3d(0, ${onScreen ? '0' : '50px'}, 0)`}
        opacity={onScreen ? 1 : 0}
        transition="transform 0.1s 0.1s ease-in-out, opacity 0.1s 0.1s ease-in"
      >
        <Box h="338px" gridArea="creators" pr={12}>
          <Heading color="white" fontSize={70} mb={6}>
            Creators
          </Heading>
          <Text display="flex">
            The permissions of creator roles are{' '}
            <span style={{ color: '#2DF8C7', marginLeft: 4 }}>cascading</span>.
          </Text>
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
        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/Card4.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          p={6}
          textAlign="center"
          h="338px"
          gridArea="reviewers"
        >
          <Heading color="white" fontSize={34} mb={6}>
            Reviewers
          </Heading>
          <Text mb={4} fontSize={21}>
            ♢ can{' '}
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
          p={6}
          textAlign="center"
          h="338px"
          gridArea="owner"
        >
          <Heading color="white" fontSize={40} mb={3}>
            Owner/s
          </Heading>
          <Text mb={4} fontSize={21}>
            ♢ creator of the quest chain,{' '}
            <span style={{ color: '#2DF8C7' }}>has all permissions</span>
          </Text>
        </Box>
        <Flex
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          p={6}
          textAlign="center"
          h="338px"
          gridArea="q"
        >
          <Image src="Landing/Q.svg" alt="circles3" mr={10} />
        </Flex>
        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Landing/Card3.svg)"
          bgPosition="center"
          bgSize="contain"
          backgroundRepeat="no-repeat"
          p={6}
          textAlign="center"
          h="338px"
          gridArea="editors"
        >
          <Heading color="white" fontSize={40} mb={3}>
            Editors
          </Heading>
          <Text mb={4} fontSize={21}>
            ♢ can <span style={{ color: '#2DF8C7' }}>edit the contents</span> of
            the quest chain along with its quests
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
          p={6}
          textAlign="center"
          h="338px"
          gridArea="admins"
        >
          <Heading color="white" fontSize={40} mb={3}>
            Admins
          </Heading>
          <Text mb={4} fontSize={21}>
            ♢ can <span style={{ color: '#2DF8C7' }}> create and edit</span>{' '}
            quest chains and quests
          </Text>
        </Box>
        <Box gridArea="empty2" />
      </Grid>
      <Flex w="full" pos="relative" justifyContent="center" mt={40}>
        <Image
          src="Landing/Turbine.svg"
          position="absolute"
          left="0"
          top="-400px"
          alt="turbine"
        />

        <Box
          id="questers"
          background="radial-gradient(100% 100% at 100% 71%, rgba(255, 255, 255, 0.14) 17%, rgba(255, 255, 255, 0) 100%)"
          backdropFilter="blur(20px)"
          border="1px solid #2DF8C7"
          borderRadius="29.8157px"
          w="80%"
          h="428px"
          textAlign="center"
          p={24}
        >
          <Heading fontSize={70} mb={12}>
            Questers
          </Heading>
          <Text mb={6} fontSize={21}>
            ♢ can complete quest chains by submitting proof of completion for
            quests
          </Text>
          <Text fontSize={21}>
            ♢ able to mint an NFT after successfully completing all of the
            quests of a quest chain
          </Text>
        </Box>
      </Flex>
    </VStack>
  );
};
