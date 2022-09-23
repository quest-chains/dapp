import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useBoolean,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { SubmitButton } from '@/components/SubmitButton';
import { UploadFilesForm } from '@/components/UploadFilesForm';
import { UserDisplay } from '@/components/UserDisplay';
import { useDropFiles } from '@/hooks/useDropFiles';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { formatAddress, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

const CollapsableText: React.FC<{
  title: string | null | undefined;
  children: unknown;
}> = ({ title, children }) => {
  const [isOpen, { toggle }] = useBoolean(false);
  return (
    <Flex flexDir="column" w="full">
      <Flex
        onClick={toggle}
        cursor="pointer"
        w={isOpen ? 'full' : 'initial'}
        justifyContent="space-between"
      >
        <Text fontWeight={700}>{title}</Text>
        {isOpen && <ChevronUpIcon height={6} width={6} />}
        {!isOpen && <ChevronDownIcon height={6} width={6} />}
      </Flex>
      <>{isOpen && children}</>
    </Flex>
  );
};

const StatusDisplay: React.FC<{
  review: graphql.QuestStatusInfoFragment;
  onSelect: (quest: ModalQuestType) => void;
  isDisabled: boolean;
}> = ({ review, onSelect, isDisabled }) => {
  const { quest, submissions, user } = review;

  const { description, externalUrl } = submissions[submissions.length - 1];

  const url = ipfsUriToHttp(externalUrl);

  const isSmallerScreen = useBreakpointValue({ base: true, md: false });

  return (
    <VStack
      w="100%"
      boxShadow="inset 0px 0px 0px 1px #AD90FF"
      p={8}
      spacing={2}
      borderRadius={20}
      align="stretch"
    >
      <HStack align="flex-start" justify="space-between" w="100%">
        <CollapsableText title={quest.name}>
          <Box mt={2} color="white">
            <MarkdownViewer markdown={description ?? ''} />
          </Box>
        </CollapsableText>
        <UserDisplay address={user.id} />
      </HStack>
      <Flex w="100%" fontSize="lg">
        <MarkdownViewer markdown={description ?? ''} />
      </Flex>
      <HStack justify="space-between" w="100%" pt={4}>
        {url ? (
          <Link isExternal href={url} _hover={{}}>
            <SubmitButton color="white" rightIcon={<ExternalLinkIcon />}>
              {isSmallerScreen ? 'Attachments' : 'View Attachments'}
            </SubmitButton>
          </Link>
        ) : (
          <Box />
        )}
        <SubmitButton
          borderColor="rejected"
          // color="rejected"
          isDisabled={isDisabled}
          onClick={() =>
            onSelect({
              userId: user.id,
              questId: quest.questId,
              name: quest.name,
              description: quest.description,
            })
          }
        >
          {isSmallerScreen ? 'Review' : 'Review Submission'}
        </SubmitButton>
      </HStack>
    </VStack>
  );
};

type ModalQuestType = {
  userId: string;
  questId: string;
  name: string | null | undefined;
  description: string | null | undefined;
};

type Props = {
  questChain: graphql.QuestChainInfoFragment;
  questStatuses: graphql.QuestStatusInfoFragment[];
  fetching: boolean;
  refresh: () => void;
};

export const QuestChainV0ReviewPage: React.FC<Props> = ({
  questStatuses,
  questChain,
  fetching,
  refresh,
}) => {
  const [quest, setQuest] = useState<ModalQuestType | null>(null);

  const [rejecting, setRejecting] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const { provider, address, chainId } = useWallet();

  const reviews = useMemo(() => {
    if (questStatuses) return questStatuses.filter(q => q.status === 'review');
    return [];
  }, [questStatuses]);

  const [reviewDescription, setReviewDescription] = useState('');

  const dropFilesProps = useDropFiles();

  const { files, onResetFiles } = dropFilesProps;

  const { onOpen, onClose, isOpen } = useDisclosure();

  const onModalClose = useCallback(() => {
    setReviewDescription('');
    onResetFiles();
    setQuest(null);
    onClose();
  }, [onClose, onResetFiles]);

  const onSelect = useCallback(
    (selected: ModalQuestType) => {
      setQuest(selected);
      onOpen();
    },
    [onOpen],
  );

  const onSubmit = useCallback(
    async (success: boolean) => {
      if (
        !chainId ||
        !questChain ||
        !provider ||
        chainId !== questChain.chainId
      )
        return;
      if (quest && reviewDescription) {
        setRejecting(!success);
        setAccepting(success);

        let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
        try {
          const metadata: Metadata = {
            name: `Review - Quest - ${quest.name} - User - ${quest.userId} - Reviewer - ${address}`,
            description: reviewDescription,
          };
          if (files.length > 0) {
            const filesHash = await uploadFiles(files);
            metadata.external_url = `ipfs://${filesHash}`;
          }

          const hash = await uploadMetadata(metadata);
          const details = `ipfs://${hash}`;
          toast.dismiss(tid);
          tid = toast.loading(
            'Waiting for Confirmation - Confirm the transaction in your Wallet',
          );

          const contract = getQuestChainContract(
            questChain.address,
            questChain.version,
            provider.getSigner(),
          );
          const tx = await (contract as contracts.V0.QuestChain).reviewProof(
            quest.userId,
            quest.questId,
            success,
            details,
          );
          toast.dismiss(tid);
          tid = handleTxLoading(tx.hash, chainId);
          const receipt = await tx.wait(1);
          toast.dismiss(tid);
          tid = toast.loading(
            'Transaction confirmed. Waiting for The Graph to index the transaction data.',
          );
          await waitUntilBlock(chainId, receipt.blockNumber);
          toast.dismiss(tid);
          toast.success(
            `Successfully ${success ? 'Accepted' : 'Rejected'} the Submission!`,
          );
          refresh();
          onModalClose();
        } catch (error) {
          toast.dismiss(tid);
          handleError(error);
        }

        setRejecting(false);
        setAccepting(false);
      }
    },
    [
      refresh,
      quest,
      reviewDescription,
      files,
      onModalClose,
      address,
      chainId,
      questChain,
      provider,
    ],
  );

  return (
    <VStack w="100%" px={{ base: 0, md: 12, lg: 40 }} spacing={8}>
      <VStack w="100%" align="flex-start" color="main">
        <Text fontSize="2xl" fontWeight="bold">
          {questChain.name}
        </Text>
      </VStack>
      <VStack w="100%" spacing={6}>
        {fetching ? (
          <Spinner color="main" />
        ) : (
          <>
            <Text
              fontSize={20}
              textTransform="uppercase"
              color="white"
              w="100%"
            >
              {`${reviews.length} Quest Submission${
                reviews.length === 1 ? '' : 's'
              } found`}
            </Text>
            {reviews.map(review => (
              <StatusDisplay
                review={review}
                onSelect={onSelect}
                key={review.id}
                isDisabled={chainId !== questChain?.chainId}
              />
            ))}
          </>
        )}
      </VStack>
      <Modal isOpen={!!quest && isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="40rem">
          <ModalHeader>
            Review Proof - {quest?.name} -{' '}
            {formatAddress(quest?.userId).toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel color="main" htmlFor="reviewDescription">
                Description
              </FormLabel>
              <Flex pb={4} w="100%">
                <MarkdownEditor
                  value={reviewDescription}
                  onChange={v => setReviewDescription(v)}
                />
              </Flex>
            </FormControl>
            <UploadFilesForm {...dropFilesProps} />
          </ModalBody>

          <ModalFooter alignItems="baseline">
            <HStack justify="space-between" spacing={4}>
              <Button
                variant="ghost"
                mr={3}
                onClick={onModalClose}
                borderRadius="full"
              >
                Close
              </Button>
              <SubmitButton
                borderColor="rejected"
                // color="rejected"
                isLoading={rejecting}
                isDisabled={!reviewDescription}
                onClick={() => onSubmit(false)}
              >
                Reject
              </SubmitButton>
              <SubmitButton
                borderColor="main"
                // color="main"
                isLoading={accepting}
                isDisabled={!reviewDescription}
                onClick={() => onSubmit(true)}
              >
                Accept
              </SubmitButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
