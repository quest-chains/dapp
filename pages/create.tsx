import { Box, Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { randomBytes } from 'ethers/lib/utils';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import NFT3DMetadataForm from '@/components/CreateChain/3DNFTMetadataForm';
import { ChainMetadataForm } from '@/components/CreateChain/ChainMetadataForm';
import {
  ChainRolesForm,
  RolesFormValues,
} from '@/components/CreateChain/ChainRolesForm';
import CustomNFTMetadataForm from '@/components/CreateChain/CustomNFTMetadataForm';
import NFTMetadataForm from '@/components/CreateChain/NFTMetadataForm';
import Step0 from '@/components/CreateChain/Step0';
import { getGlobalInfo } from '@/graphql/globalInfo';
import {
  QuestChainFactory as QuestChainFactoryV1,
  QuestChainFactory__factory as QuestChainFactoryV1__factory,
} from '@/types/v1';
import { QuestChainCommons } from '@/types/v1/contracts/QuestChainFactory';
import { awaitQuestChainAddress, waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { isSupportedNetwork, useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Create: React.FC<Props> = ({ globalInfo }) => {
  const router = useRouter();

  const { address, provider, chainId } = useWallet();

  const [chainName, setChainName] = useState('');
  const [chainUri, setChainUri] = useState('');
  const [nftUri, setNFTUri] = useState('');
  const [step, setStep] = useState(0);

  const onSubmitChainMeta = (name: string, metadataUri: string) => {
    setChainName(name);
    setChainUri(metadataUri);
    setStep(1);
  };
  const onSubmitNFTMeta = (metadataUri: string) => {
    setNFTUri(metadataUri);
    setStep(2);
  };

  const onSubmitRoles = useCallback(
    async ({
      adminAddresses,
      editorAddresses,
      reviewerAddresses,
    }: RolesFormValues) => {
      if (!address || !chainId || !provider || !isSupportedNetwork(chainId))
        return;

      let tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      try {
        const info: QuestChainCommons.QuestChainInfoStruct = {
          details: chainUri,
          tokenURI: nftUri,
          owners: [address],
          admins: adminAddresses,
          editors: editorAddresses,
          reviewers: reviewerAddresses,
          quests: [],
          paused: false,
        };
        const factoryContract: QuestChainFactoryV1 =
          QuestChainFactoryV1__factory.connect(
            globalInfo[chainId],
            provider.getSigner(),
          );
        const tx = await factoryContract.create(info, randomBytes(32));
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash, chainId);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully created a new Quest Chain');

        setChainName('');
        setChainUri('');
        setNFTUri('');
        setStep(0);

        const questChainAddress = await awaitQuestChainAddress(receipt);
        if (questChainAddress) {
          router.push(`/chain/${chainId}/${questChainAddress}`);
        }
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }
    },
    [address, chainId, router, chainUri, nftUri, provider, globalInfo],
  );

  const [show3DBeta, setShow3DBeta] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  return (
    <VStack w="100%" align="stretch" px={{ base: 0, lg: 12 }} spacing={8}>
      <Head>
        <title>Create</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HStack w="100%" spacing="4">
        {step === 1 && (
          <Box>
            <Button
              onClick={() => {
                setShow3DBeta(s => !s);
                setShowCustom(false);
              }}
              borderWidth={1}
              borderColor="white"
              px={5}
              py={2}
              borderRadius="full"
              size="sm"
              mr={4}
            >
              {show3DBeta ? 'BACK TO 2D NFT' : 'TRY 3D NFT BETA'}
            </Button>

            <Button
              onClick={() => {
                setShowCustom(s => !s);
                setShow3DBeta(false);
              }}
              borderWidth={1}
              borderColor="white"
              px={5}
              py={2}
              borderRadius="full"
              size="sm"
            >
              {showCustom ? 'BACK TO 2D NFT' : 'UPLOAD CUSTOM IMAGE'}
            </Button>
          </Box>
        )}
      </HStack>
      <>
        <Flex w="100%" display={step === 0 ? 'flex' : 'none'} flexDir="column">
          <Step0 />
          <Flex w="full" justifyContent="center">
            <Button
              onClick={() => setStep(1)}
              borderRadius="full"
              _hover={{
                bg: 'main.950',
              }}
              px={32}
              bg="main"
              color="black"
            >
              GET STARTED
            </Button>
          </Flex>
        </Flex>
        <Flex w="100%" display={step === 1 ? 'flex' : 'none'}>
          <ChainMetadataForm onSubmit={onSubmitChainMeta} />
        </Flex>
        <Flex w="100%" display={step === 2 ? 'flex' : 'none'}>
          {show3DBeta && (
            <NFT3DMetadataForm
              chainName={chainName}
              onSubmit={onSubmitNFTMeta}
              onBack={() => setStep(1)}
            />
          )}
          {showCustom && (
            <CustomNFTMetadataForm
              chainName={chainName}
              onSubmit={onSubmitNFTMeta}
              onBack={() => setStep(1)}
            />
          )}
          {!showCustom && !show3DBeta && (
            <NFTMetadataForm
              chainName={chainName}
              onSubmit={onSubmitNFTMeta}
              onBack={() => setStep(1)}
            />
          )}
        </Flex>
        <Flex w="100%" display={step === 2 ? 'flex' : 'none'}>
          <ChainRolesForm onSubmit={onSubmitRoles} onBack={() => setStep(1)} />
        </Flex>
      </>
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

export default Create;
