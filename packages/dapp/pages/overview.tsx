import { Box, Heading, VStack } from '@chakra-ui/react';

const Home: React.FC = () => {
  return (
    <VStack>
      <Heading>Quests overview</Heading>
      <Box>Submissions</Box>
      <Box>My Progress</Box>
    </VStack>
  );
};

export default Home;
