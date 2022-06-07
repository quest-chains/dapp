import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { useOnScreen } from '@/hooks/useOnScreen';

export const Creators: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      minH="100vh"
      pos="relative"
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
          bgImage="url(/Card4.svg)"
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
          bgImage="url(/Card1.svg)"
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
          <Image src="/Q.svg" alt="circles3" mr={10} />
        </Flex>
        <Box
          dropShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          bgImage="url(/Card3.svg)"
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
          bgImage="url(/Card2.svg)"
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
    </HStack>
  );
};
