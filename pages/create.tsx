import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { QuestChainCommons } from '@quest-chains/sdk/dist/contracts/v1/contracts/QuestChainFactory';
import { randomBytes } from 'ethers/lib/utils';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MetadataForm } from '@/components/CreateChain/MetadataForm';
import NFTForm from '@/components/CreateChain/NFTForm';
import { QuestsForm } from '@/components/CreateChain/QuestsForm';
import { Member, RolesForm } from '@/components/CreateChain/RolesForm';
import Step0 from '@/components/CreateChain/Step0';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { SubmitButton } from '@/components/SubmitButton';
import { awaitQuestChainAddress, waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadata } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { isSupportedNetwork, useWallet } from '@/web3';

import { Members } from './chain/[chainId]/[address]';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Create: React.FC<Props> = ({ globalInfo }) => {
  const router = useRouter();

  const { address, provider, chainId } = useWallet();

  const [chainName, setChainName] = useState('');
  const [chainDescription, setChainDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [chainUri, setChainUri] = useState('');
  const [nftUri, setNFTUri] = useState('');
  const [nftUrl, setNFTUrl] = useState('');
  const [isPremium, setIsPremium] = useState(true);
  const [step, setStep] = useState(0);
  const [ownerAddresses, setOwnerAddresses] = useState([address || '']);
  const [adminAddresses, setAdminAddresses] = useState(['']);
  const [editorAddresses, setEditorAddresses] = useState(['']);
  const [reviewerAddresses, setReviewerAddresses] = useState(['']);
  const [isApproved, setIsApproved] = useState(false);

  const onSubmitChainMeta = (
    name: string,
    description: string,
    metadataUri: string,
    imageUrl?: string,
  ) => {
    setChainName(name);
    setChainDescription(description);
    setChainUri(metadataUri);
    setImageUrl(imageUrl || '');
    setStep(2);
  };

  const onSubmitNFTMeta = (
    metadataUri: string,
    nftUrl: string | undefined,
    isPremium: boolean,
  ) => {
    setNFTUri(metadataUri);
    setIsPremium(isPremium);
    if (nftUrl) setNFTUrl(nftUrl);
    setStep(3);
  };

  const onSubmitRoles = (members: Member[]) => {
    setOwnerAddresses(
      members
        .filter(member => member.role === 'owner')
        .map(member => member.address),
    );
    setAdminAddresses(
      members
        .filter(member => member.role === 'admin')
        .map(member => member.address),
    );
    setEditorAddresses(
      members
        .filter(member => member.role === 'editor')
        .map(member => member.address),
    );
    setReviewerAddresses(
      members
        .filter(member => member.role === 'reviewer')
        .map(member => member.address),
    );
    setStep(4);
  };

  const approveTokens = async () => {
    if (!address || !chainId || !provider || !isSupportedNetwork(chainId))
      return;
    let tid;
    try {
      const { factoryAddress, paymentToken, upgradeFee } = globalInfo[chainId];
      const tokenContract: contracts.V1.IERC20Token =
        contracts.V1.IERC20Token__factory.connect(
          paymentToken.address,
          provider.getSigner(),
        );
      const tokenAllowance = await tokenContract.allowance(
        address,
        factoryAddress,
      );
      if (tokenAllowance.toNumber() >= upgradeFee) setIsApproved(true);
      else {
        tid = toast.loading('Approving spending of tokens, please wait...');
        const approval = await tokenContract.approve(
          factoryAddress,
          upgradeFee,
        );
        await approval.wait();
        setIsApproved(true);
        toast.dismiss(tid);
        toast.success('Approved');
      }
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    }
  };

  const onPublishQuestChain = useCallback(
    async (
      quests: { name: string; description: string }[],
      startAsDisabled: boolean,
    ) => {
      if (!address || !chainId || !provider || !isSupportedNetwork(chainId))
        return;

      let tid;
      let questsDetails: string[] = [];
      if (quests.length) {
        tid = toast.loading('Uploading Quests, please wait...');
        const metadata: Metadata[] = quests;
        const hashes = await Promise.all(
          metadata.map(quest => uploadMetadata(quest)),
        );
        questsDetails = hashes.map(hash => `ipfs://${hash}`);
        toast.dismiss(tid);
      }

      try {
        const { factoryAddress } = globalInfo[chainId];

        const info: QuestChainCommons.QuestChainInfoStruct = {
          details: chainUri,
          tokenURI: nftUri,
          owners: ownerAddresses.filter(address => address !== ''),
          admins: adminAddresses.filter(address => address !== ''),
          editors: editorAddresses.filter(address => address !== ''),
          reviewers: reviewerAddresses.filter(address => address !== ''),
          quests: questsDetails,
          paused: startAsDisabled,
        };
        const factoryContract: contracts.V1.QuestChainFactory =
          contracts.V1.QuestChainFactory__factory.connect(
            factoryAddress,
            provider.getSigner(),
          );

        let tx;

        if (isPremium) {
          tid = toast.loading(
            'Waiting for Confirmation - Confirm the transaction in your Wallet',
          );
          tx = await factoryContract.createAndUpgrade(info, randomBytes(32));
        } else {
          tid = toast.loading(
            'Waiting for Confirmation - Confirm the transaction in your Wallet',
          );
          tx = await factoryContract.create(info, randomBytes(32));
        }
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash, chainId);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);

        const questChainAddress = await awaitQuestChainAddress(receipt);
        toast.dismiss(tid);
        toast.success('Successfully created a new Quest Chain! Redirecting...');
        if (questChainAddress) {
          router.push(`/chain/${chainId}/${questChainAddress}`);
        }
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }
    },
    [
      address,
      chainId,
      provider,
      chainUri,
      nftUri,
      ownerAddresses,
      adminAddresses,
      editorAddresses,
      reviewerAddresses,
      globalInfo,
      isPremium,
      router,
    ],
  );

  const goBackToNFTSelection = () => {
    setStep(2);
    setNFTUri('');
    setIsPremium(false);
    setNFTUrl('');
  };

  return (
    <Flex
      w="full"
      align="stretch"
      px={{ base: 0, md: 12, lg: 40 }}
      gap={8}
      flexDir="column"
    >
      <Box
        bgImage={ipfsUriToHttp(imageUrl)}
        position="fixed"
        height="100vh"
        width="100vw"
        top="0"
        left="0"
        opacity="0.05"
        bgPos="center"
        bgSize="cover"
        zIndex={-1}
      />
      <Head>
        <title>Create</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {step === 0 && (
        <Flex w="full" flexDir="column" gap={8}>
          <Step0 />
          <Flex w="full" justifyContent="center">
            <SubmitButton onClick={() => setStep(1)} px={32}>
              GET STARTED
            </SubmitButton>
          </Flex>
        </Flex>
      )}
      {step !== 0 && (
        <Box fontFamily="heading" color="white" fontSize={32}>
          New Quest Chain
        </Box>
      )}

      <Flex
        w="full"
        display={step === 1 ? 'flex' : 'none'}
        flexDir="column"
        gap={8}
      >
        <MetadataForm onSubmit={onSubmitChainMeta} />
        <Step2 />
        <Step3 />
        <Step4 />
      </Flex>

      {step >= 2 && (
        <Flex gap={8} justifyContent="space-between">
          <Flex flexDir="column" gap={8}>
            <Text
              fontSize="5xl"
              fontWeight="bold"
              lineHeight="3.5rem"
              fontFamily="heading"
            >
              {chainName}
            </Text>
            <Box>{chainId && <NetworkDisplay chainId={chainId} />}</Box>
            <MarkdownViewer markdown={chainDescription} />
          </Flex>
          {nftUrl && (
            <Image
              maxW={373}
              src={ipfsUriToHttp(nftUrl)}
              alt="Quest Chain NFT badge"
            />
          )}
        </Flex>
      )}

      <Flex
        w="full"
        display={step === 2 ? 'flex' : 'none'}
        flexDir="column"
        gap={8}
      >
        <NFTForm
          onSubmit={onSubmitNFTMeta}
          chainName={chainName}
          globalInfo={globalInfo}
        />
        <Step3 />
        <Step4 />
      </Flex>

      <Flex
        w="full"
        display={step === 3 ? 'flex' : 'none'}
        flexDir="column"
        gap={8}
      >
        <RolesForm onSubmit={onSubmitRoles} address={address} />
        <Step4 />
      </Flex>

      <Flex
        w="full"
        display={step === 4 ? 'flex' : 'none'}
        flexDir={{ base: 'column', md: 'row' }}
        gap={8}
      >
        <Flex flexGrow={1} flexDir="column" gap={8}>
          <QuestsForm
            onPublishQuestChain={onPublishQuestChain}
            isPremium={isPremium}
            isApproved={isApproved}
            approveTokens={approveTokens}
            goBackToNFTSelection={goBackToNFTSelection}
            globalInfo={globalInfo}
          />
        </Flex>
        <Flex w={373}>
          {address && (
            <Members
              owners={ownerAddresses}
              admins={adminAddresses}
              editors={editorAddresses}
              reviewers={reviewerAddresses}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const Step: React.FC<{
  number: number;
  title: string;
}> = ({ number, title }) => (
  <Flex
    w="full"
    boxShadow="inset 0px 0px 0px 1px #718096"
    borderRadius={10}
    px={{ base: 4, md: 12 }}
    py={8}
    alignItems="center"
  >
    <Box
      py={1}
      px={3}
      borderWidth={1}
      borderColor="gray.500"
      color="gray.500"
      borderRadius={4}
      mr={6}
    >
      STEP {number}
    </Box>
    <Text fontWeight="bold" fontSize={16} color="gray.400">
      {title}
    </Text>
  </Flex>
);
const Step2 = () => <Step number={2} title="Chain completion NFT" />;
const Step3 = () => <Step number={3} title="Members" />;
const Step4 = () => <Step number={4} title="Quests" />;

export const getStaticProps = async () => {
  return {
    props: {
      globalInfo: await graphql.getGlobalInfo(),
    },
  };
};

export default Create;
