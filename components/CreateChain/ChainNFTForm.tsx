import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import NFT3DMetadataForm from '@/components/CreateChain/3DNFTMetadataForm';
import CustomNFTMetadataForm from '@/components/CreateChain/CustomNFTMetadataForm';
import NFTMetadataForm from '@/components/CreateChain/NFTMetadataForm';
import { getGlobalInfo } from '@/graphql/globalInfo';

const ChainNFTForm: React.FC<{
  onSubmit: (metadataUri: string) => void | Promise<void>;
  chainName: string;
}> = ({ onSubmit, chainName }) => {
  const [selectedNFT, setSelectedNFT] = useState('2D'); // 3D, custom

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={10}
      boxShadow="inset 0px 0px 0px 1px white"
      borderRadius={10}
      px={{ base: 4, md: 12 }}
      py={8}
    >
      <HStack w="100%">
        <Box
          py={1}
          px={3}
          borderWidth={1}
          borderColor="gray.500"
          color="gray.500"
          borderRadius={4}
          mr={4}
        >
          STEP 2
        </Box>
        <Text fontWeight="bold" fontSize={16}>
          Chain completion NFT
        </Text>
      </HStack>

      <Flex
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="white"
      >
        <Button
          onClick={() => setSelectedNFT('2D')}
          py={2}
          flexGrow={1}
          borderBottomWidth={2}
          borderBottomColor={selectedNFT === '2D' ? 'white' : 'transparent'}
          borderRadius={0}
          variant="ghost"
        >
          2D NFT
        </Button>
        <Button
          onClick={() => setSelectedNFT('3D')}
          py={2}
          flexGrow={1}
          borderBottomWidth={2}
          borderBottomColor={selectedNFT === '3D' ? 'white' : 'transparent'}
          borderRadius={0}
          variant="ghost"
        >
          3D NFT
          <Box
            ml={2}
            fontSize={11}
            fontWeight={900}
            borderRadius={3}
            py={1}
            px={2}
            color="gray.800"
            background="linear-gradient(121.54deg, #D03CB8 27.46%, #FFA500 69.02%)"
          >
            PREMIUM
          </Box>
        </Button>
        <Button
          onClick={() => setSelectedNFT('custom')}
          py={2}
          flexGrow={1}
          borderBottomWidth={2}
          borderBottomColor={selectedNFT === 'custom' ? 'white' : 'transparent'}
          borderRadius={0}
          variant="ghost"
        >
          Custom Image
          <Box
            ml={2}
            fontSize={11}
            fontWeight={900}
            borderRadius={3}
            py={1}
            px={2}
            color="gray.800"
            background="linear-gradient(121.54deg, #D03CB8 27.46%, #FFA500 69.02%)"
          >
            PREMIUM
          </Box>
        </Button>
      </Flex>
      {selectedNFT === '2D' && (
        <NFTMetadataForm chainName={chainName} onSubmit={onSubmit} />
      )}
      {selectedNFT === '3D' && (
        <NFT3DMetadataForm chainName={chainName} onSubmit={onSubmit} />
      )}
      {selectedNFT === 'custom' && (
        <CustomNFTMetadataForm chainName={chainName} onSubmit={onSubmit} />
      )}
    </VStack>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      globalInfo: await getGlobalInfo(),
    },
  };
};

export default ChainNFTForm;
