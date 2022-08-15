import {
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Signer } from 'ethers';
import { randomBytes } from 'ethers/lib/utils';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import NFT3DMetadataForm from '@/components/CreateChain/3DNFTMetadataForm';
import { ChainMetadataForm } from '@/components/CreateChain/ChainMetadataForm';
import {
  ChainRolesForm,
  RolesFormValues,
} from '@/components/CreateChain/ChainRolesForm';
import CustomNFTMetadataForm from '@/components/CreateChain/CustomNFTMetadataForm';
import NFTMetadataForm from '@/components/CreateChain/NFTMetadataForm';
import { QuestChainTile } from '@/components/QuestChainTile';
import { getGlobalInfo } from '@/graphql/globalInfo';
import { useLatestCreatedQuestChainsDataForAllChains } from '@/hooks/useLatestCreatedQuestChainsDataForAllChains';
import { QuestChainFactory, QuestChainFactory__factory } from '@/types/v1';
import { QuestChainCommons } from '@/types/v1/contracts/QuestChainFactory';
import { awaitQuestChainAddress, waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { isSupportedNetwork, useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Create: React.FC<Props> = ({ globalInfo }) => {
  const router = useRouter();

  const { address, provider, chainId } = useWallet();

  const factoryContract: QuestChainFactory | undefined = useMemo(() => {
    if (!isSupportedNetwork(chainId)) return;

    return QuestChainFactory__factory.connect(
      globalInfo[chainId as string],
      provider?.getSigner() as Signer,
    );
  }, [provider, chainId, globalInfo]);

  const { questChains, fetching } =
    useLatestCreatedQuestChainsDataForAllChains();

  const [chainName, setChainName] = useState('');
  const [chainUri, setChainUri] = useState('');
  const [nftUri, setNFTUri] = useState('');
  const [step, setStep] = useState(0);
  const [showForm, setShowForm] = useState(true);

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
      if (
        !address ||
        !chainId ||
        !isSupportedNetwork(chainId) ||
        !factoryContract
      )
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
        } else {
          setShowForm(false);
          setTimeout(() => setShowForm(true), 50);
        }
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }
    },
    [address, chainId, factoryContract, router, chainUri, nftUri],
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
        <Text color="main" fontSize={20}>
          CREATE NEW QUEST CHAIN
        </Text>
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
      {showForm && (
        <>
          <Flex w="100%" display={step === 0 ? 'flex' : 'none'}>
            <ChainMetadataForm onSubmit={onSubmitChainMeta} />
          </Flex>
          <Flex w="100%" display={step === 1 ? 'flex' : 'none'}>
            {show3DBeta && (
              <NFT3DMetadataForm
                chainName={chainName}
                onSubmit={onSubmitNFTMeta}
                onBack={() => setStep(0)}
              />
            )}
            {showCustom && (
              <CustomNFTMetadataForm
                chainName={chainName}
                onSubmit={onSubmitNFTMeta}
                onBack={() => setStep(0)}
              />
            )}
            {!showCustom && !show3DBeta && (
              <NFTMetadataForm
                chainName={chainName}
                onSubmit={onSubmitNFTMeta}
                onBack={() => setStep(0)}
              />
            )}
          </Flex>
          <Flex w="100%" display={step === 2 ? 'flex' : 'none'}>
            <ChainRolesForm
              onSubmit={onSubmitRoles}
              onBack={() => setStep(1)}
            />
          </Flex>
        </>
      )}

      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {questChains.length > 0 && (
            <Text fontSize={20} textTransform="uppercase" color="white">
              {`Created ${questChains.length} Quest Chain${
                questChains.length > 1 ? 's' : ''
              }`}
            </Text>
          )}
          <VStack w="full" gap={4} flex={1}>
            {questChains.map(
              ({
                address,
                chainId,
                name,
                description,
                quests,
                imageUrl,
                paused,
              }) => (
                <QuestChainTile
                  {...{
                    address,
                    name,
                    description,
                    chainId,
                    quests: quests.length,
                    imageUrl,
                    paused,
                  }}
                  key={address}
                />
              ),
            )}
          </VStack>
        </>
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

export default Create;
