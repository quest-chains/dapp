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
  Textarea,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Signer } from 'ethers';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

import { QuestChain, QuestChain__factory } from '@/types';
import { ZERO_ADDRESS } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import {
  Metadata,
  uploadFilesViaAPI,
  uploadMetadataViaAPI,
} from '@/utils/metadata';
import { useWallet } from '@/web3';

import { SubmitButton } from './SubmitButton';

export const UploadProof: React.FC<{
  address: string | null | undefined;
  refresh: () => void;
  questId: string;
  questChainId: string;
  questChainAddress: string;
  name: string | null | undefined;
}> = ({ address, refresh, questId, questChainId, questChainAddress, name }) => {
  const { chainId, provider } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSubmitting, setSubmitting] = useState(false);

  const onModalClose = useCallback(() => {
    setProofDescription('');
    setMyFiles([]);
    onClose();
  }, [onClose]);
  const [proofDescription, setProofDescription] = useState('');
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const removeFile = (file: File) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const contract: QuestChain = QuestChain__factory.connect(
    questChainAddress ?? ZERO_ADDRESS,
    provider?.getSigner() as Signer,
  );

  const onSubmit = useCallback(async () => {
    if (!chainId || chainId !== questChainId) return;
    if (proofDescription && myFiles.length > 0) {
      setSubmitting(true);
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
        let hash = await uploadFilesViaAPI(myFiles);
        const metadata: Metadata = {
          name: `Submission - Quest - ${name} - User - ${address}`,
          description: proofDescription,
          external_url: `ipfs://${hash}`,
        };

        hash = await uploadMetadataViaAPI(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm the transaction in your Wallet',
        );
        const tx = await contract.submitProof(questId, details);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash);
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
    questChainId,
    proofDescription,
    myFiles,
    name,
    address,
    contract,
    questId,
    onModalClose,
    refresh,
  ]);

  return (
    <Box>
      <Tooltip
        shouldWrapChildren
        label="Please connect or switch to the correct chain"
        isDisabled={chainId === questChainId}
      >
        <Button
          onClick={onOpen}
          isDisabled={chainId !== questChainId || !address}
        >
          Upload Proof
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Proof - {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel color="main" htmlFor="proofDescription">
                Description
              </FormLabel>
              <Textarea
                id="proofDescription"
                value={proofDescription}
                onChange={e => setProofDescription(e.target.value)}
                mb={4}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="main" htmlFor="file">
                Upload file
              </FormLabel>
              <Flex
                {...getRootProps({ className: 'dropzone' })}
                flexDir="column"
                borderWidth={1}
                borderStyle="dashed"
                borderRadius={20}
                p={10}
                mb={4}
                onClick={open}
              >
                <input {...getInputProps()} color="white" />
                <Box alignSelf="center">{`Drag 'n' drop some files here`}</Box>
              </Flex>
            </FormControl>
            <Text mb={1}>Files:</Text>
            {myFiles.map((file: File) => (
              <Flex key={file.name} w="100%" mb={1}>
                <IconButton
                  size="xs"
                  borderRadius="full"
                  onClick={removeFile(file)}
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
              isDisabled={!myFiles.length || !proofDescription}
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
