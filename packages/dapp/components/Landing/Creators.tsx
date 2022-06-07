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
      id="creators"
      py={20}
      gap={40}
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
        transition="transform 0.2s 0.1s ease-in-out, opacity 0.2s 0.2s ease-in"
      >
        <Box h="338px" gridArea="creators">
          <Heading color="white" fontSize={70} mb={6}>
            CREATORS
          </Heading>
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
            ♢ can accept or reject submitted proof of quest completion
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
            owner
          </Heading>
          <Text mb={4} fontSize={21}>
            ♢ creator of the quest chain, sole owner, has all permissions
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
            editors
          </Heading>
          <Text mb={4} fontSize={21}>
            ♢ can edit the content of the quest chain along with its quests,
            apart from modifying the admins or owners
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
            admins
          </Heading>
          <Text mb={4} fontSize={21}>
            ♢ can modify any aspect of the quest chain, apart from modifying the
            owner, can add other editors and reviewers, can create and edit
            quests
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
            QUESTORS
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
