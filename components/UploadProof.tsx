import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDropFiles } from '@/hooks/useDropFiles';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { MarkdownEditor } from './MarkdownEditor';
import { SubmitButton } from './SubmitButton';

export const UploadProof: React.FC<{
  refresh: () => void;
  questId: string;
  name: string;
  questChain: graphql.QuestChainInfoFragment;
  profile?: boolean;
}> = ({ refresh, questId, name, questChain, profile }) => {
  const { chainId, provider, address } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSubmitting, setSubmitting] = useState(false);

  const [proofDescription, setProofDescription] = useState('');

  const {
    files,
    onRemoveFile,
    inputProps,
    dropzoneProps,
    onResetFiles,
    onOpenFiles,
  } = useDropFiles();

  const onModalClose = useCallback(() => {
    setProofDescription('');
    onResetFiles;
    onClose();
  }, [onClose, onResetFiles]);

  const onSubmit = useCallback(async () => {
    if (!chainId || chainId !== questChain.chainId || !provider) return;
    if (proofDescription) {
      setSubmitting(true);
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
        let hash = files.length ? await uploadFiles(files) : '';
        const metadata: Metadata = {
          name: `Submission - QuestChain - ${questChain.name} - Quest - ${questId}. ${name} User - ${address}`,
          description: proofDescription,
          external_url: hash ? `ipfs://${hash}` : undefined,
        };

        hash = await uploadMetadata(metadata);
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

        const tx = await (questChain.version === '1'
          ? (contract as contracts.V1.QuestChain).submitProofs(
              [questId],
              [details],
            )
          : (contract as contracts.V0.QuestChain).submitProof(
              questId,
              details,
            ));
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash, chainId);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully submitted proof');
        onModalClose();
        refresh();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setSubmitting(false);
    }
  }, [
    chainId,
    questChain,
    proofDescription,
    files,
    questId,
    name,
    onModalClose,
    refresh,
    address,
    provider,
  ]);

  return (
    <Box>
      <Tooltip
        shouldWrapChildren
        label="Please connect or switch to the correct chain"
        isDisabled={chainId === questChain.chainId}
      >
        {!profile && (
          <Button
            onClick={onOpen}
            isDisabled={chainId !== questChain.chainId || !address}
            borderWidth={1}
            borderColor="white"
            px={5}
            py={2}
            borderRadius="full"
          >
            Submit Proof
          </Button>
        )}
        {profile && (
          <Button
            w="full"
            onClick={onOpen}
            isDisabled={chainId !== questChain.chainId || !address}
            variant="outline"
          >
            Re-submit Proof
          </Button>
        )}
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="40rem">
          <ModalHeader>Upload Proof - {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel color="main" htmlFor="proofDescription">
                Description
              </FormLabel>
              <Flex w="100%" pb={4}>
                <MarkdownEditor
                  value={proofDescription}
                  onChange={value => setProofDescription(value)}
                />
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel color="main" htmlFor="file">
                Upload file
              </FormLabel>
              <Flex
                {...dropzoneProps}
                flexDir="column"
                borderWidth={1}
                borderStyle="dashed"
                borderRadius={20}
                p={10}
                mb={4}
                onClick={onOpenFiles}
              >
                <input {...inputProps} color="white" />
                <Box alignSelf="center">{`Drag 'n' drop some files here`}</Box>
              </Flex>
            </FormControl>
            <Text mb={1}>Files:</Text>
            {files.map((file: File) => (
              <Flex key={file.name} w="100%" mb={1}>
                <IconButton
                  size="xs"
                  borderRadius="full"
                  onClick={() => onRemoveFile(file)}
                  icon={<SmallCloseIcon boxSize="1rem" />}
                  aria-label={''}
                />
                <Text ml={1} alignSelf="center">
                  {file.name} - {file.size} bytes
                </Text>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter alignItems="baseline">
            <Button
              variant="ghost"
              mr={3}
              onClick={onModalClose}
              borderRadius="full"
            >
              Close
            </Button>
            <SubmitButton
              mt={4}
              type="submit"
              onClick={onSubmit}
              isDisabled={!proofDescription}
              isLoading={isSubmitting}
            >
              Submit
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
