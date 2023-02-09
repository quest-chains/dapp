import {
  Box,
  Button,
  Flex,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import NFTForm2D from '@/components/CreateChain/NFTForm2D';
import NFTForm3D from '@/components/CreateChain/NFTForm3D';
import NFTFormCustom from '@/components/CreateChain/NFTFormCustom';

const TABS = ['2D', '3D', 'Custom'];

const NFTForm: React.FC<{
  showStep?: boolean;
  onSubmit: (
    metadataUri: string,
    nftUrl: string | undefined,
  ) => void | Promise<void>;
  chainName: string;
  submitLabel: string;
}> = ({ onSubmit, chainName, showStep = true, submitLabel }) => {
  const [tab, setTab] = useState(TABS[0]);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

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
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          {showStep && (
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
          )}
          <Text fontWeight="bold" fontSize={16}>
            Chain completion NFT
          </Text>
        </Flex>
      </Flex>

      <Flex
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="white"
      >
        {TABS.map(t => (
          <Button
            key={t}
            onClick={() => setTab(t)}
            py={2}
            flexGrow={1}
            borderBottomWidth={2}
            borderBottomColor={tab === t ? 'white' : 'transparent'}
            borderRadius={0}
            variant="ghost"
          >
            {isSmallScreen ? t : `${t} NFT`}
          </Button>
        ))}
      </Flex>
      <NFTForm2D
        chainName={chainName}
        onSubmit={onSubmit}
        submitLabel={submitLabel}
        show={tab === TABS[0]}
      />
      <NFTForm3D
        chainName={chainName}
        onSubmit={onSubmit}
        submitLabel={submitLabel}
        show={tab === TABS[1]}
      />
      <NFTFormCustom
        chainName={chainName}
        onSubmit={onSubmit}
        submitLabel={submitLabel}
        show={tab === TABS[2]}
      />
    </VStack>
  );
};

export default NFTForm;
