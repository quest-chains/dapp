import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import NFTForm2D from '@/components/CreateChain/NFTForm2D';
import NFTForm3D from '@/components/CreateChain/NFTForm3D';
import NFTFormCustom from '@/components/CreateChain/NFTFormCustom';

const NFTForm: React.FC<{
  onSubmit: (
    metadataUri: string,
    nftUrl: string | undefined,
    isPremium: boolean,
  ) => void | Promise<void>;
  chainName: string;
}> = ({ onSubmit, chainName }) => {
  const [tab, setTab] = useState('2D'); // 3D, custom
  const [didOpenPremiumTab, setDidOpenPremiumTab] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const switchTab = (tab: string) => {
    setTab(tab);
    if (didOpenPremiumTab) return;

    onOpen();
    setDidOpenPremiumTab(true);
  };

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
        </Flex>
        <IconButton
          icon={<QuestionOutlineIcon height={7} width={7} fontWeight="bold" />}
          onClick={onOpen}
          borderRadius="full"
          bg="transparent"
          aria-label="info"
        />
      </Flex>

      <Flex
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="white"
      >
        <Button
          onClick={() => switchTab('2D')}
          py={2}
          flexGrow={1}
          borderBottomWidth={2}
          borderBottomColor={tab === '2D' ? 'white' : 'transparent'}
          borderRadius={0}
          variant="ghost"
        >
          2D NFT
        </Button>
        <Button
          onClick={() => switchTab('3D')}
          py={2}
          flexGrow={1}
          borderBottomWidth={2}
          borderBottomColor={tab === '3D' ? 'white' : 'transparent'}
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
          onClick={() => switchTab('custom')}
          py={2}
          flexGrow={1}
          borderBottomWidth={2}
          borderBottomColor={tab === 'custom' ? 'white' : 'transparent'}
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
      {tab === '2D' && <NFTForm2D chainName={chainName} onSubmit={onSubmit} />}
      {tab === '3D' && <NFTForm3D chainName={chainName} onSubmit={onSubmit} />}
      {tab === 'custom' && (
        <NFTFormCustom chainName={chainName} onSubmit={onSubmit} />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="40rem">
          <ModalHeader>About 3D NFTs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you ready to take your quest chain to the next level? Make it
            stand out with this amazing 3D NFT badge or a custom image that can
            be added to your chain’s overview page, and will look equally as
            amazing on the chain’s questers’ profiles. This premium feature
            costs 2 SEED tokens (~10$), which are MetaGame’s native tokens. Read
            how to acquire them
            <Link
              mx={1}
              isExternal
              href="https://metagame.wtf/seeds"
              textDecoration="underline"
            >
              here.
            </Link>
          </ModalBody>

          <ModalFooter alignItems="baseline">
            <Button variant="ghost" mr={3} onClick={onClose}>
              Gotcha, close this message
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default NFTForm;
