import { Flex, Grid, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const Step0: React.FC = () => (
  <VStack w="full" align="stretch" spacing={8} pt={12}>
    <Flex w="full" justifyContent="center">
      <Text fontFamily="heading" color="white" fontSize={40} textAlign="center">
        Here&apos;s what&apos;s coming up
      </Text>
    </Flex>
    <Grid
      w="full"
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        xl: 'repeat(4, 1fr)',
      }}
      gap={10}
    >
      <Step
        image="/CreateChain/details.png"
        title="1. Enter details"
        description="Every quest chain needs to have a name and description. You can also add a background image for your new quest chain here."
      />
      <Step
        image="/CreateChain/nft.png"
        title="2. Define NFT"
        description="Create a custom 2D or 3D NFT or upload your own image. Players who complete the quest chain will become eligible to mint it!"
      />
      <Step
        image="/CreateChain/members.png"
        title="3. Assign members"
        description="Set up the role structure of the quest chain."
      />
      <Step
        image="/CreateChain/quest.png"
        title="4. Create quests"
        description="After setting up the quest chain it's time to add some quests to it."
      />
    </Grid>
  </VStack>
);

const Step = ({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) => (
  <Flex flexDir="column" alignItems="center" p={8}>
    <Image
      src={image}
      alt={title}
      filter="invert(100%)"
      mb={6}
      w="80%"
      maxW="10rem"
    />
    <Text fontWeight="bold" mt={3} fontSize="lg" mb={2}>
      {title}
    </Text>
    <Text marginBottom="auto" fontSize="sm" textAlign="center">
      {description}
    </Text>
  </Flex>
);

export default Step0;
