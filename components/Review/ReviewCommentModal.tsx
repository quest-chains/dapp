import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmissionType } from '@/components/Review/SubmissionTile';
import { useInputText } from '@/hooks/useInputText';
import { handleError } from '@/utils/helpers';
import { uploadMetadata } from '@/utils/metadata';
import { Metadata } from '@/utils/validate';

export const ReviewCommentModal: React.FC<{
  isModalOpen: boolean;
  onModalClose: () => void;
  reviewing: SubmissionType[];
  onSelectSubmissions: (selected: SubmissionType[]) => void;
}> = ({ isModalOpen, onModalClose, reviewing, onSelectSubmissions }) => {
  const [commenting, setCommenting] = useState(false);

  const [reviewCommentRef, setReviewComment] = useInputText();

  const onClose = useCallback(() => {
    onModalClose();
    setReviewComment('');
    setCommenting(false);
  }, [onModalClose, setReviewComment]);

  const onSubmitComment = useCallback(async () => {
    if (reviewCommentRef.current === '') {
      toast.error('Empty comment');
      return;
    }
    let tid;
    try {
      setCommenting(true);
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      const metadata: Metadata = {
        name: `Reviewing ${reviewing.length} submission${
          reviewing.length > 1 ? 's' : ''
        }`,
        description: reviewCommentRef.current,
      };

      const hash = await uploadMetadata(metadata);
      const details = `ipfs://${hash}`;
      onSelectSubmissions(
        reviewing.map(q => ({
          ...q,
          reviewCommentUri: details,
          reviewComment: metadata.description,
        })),
      );
      toast.dismiss(tid);
      onModalClose();
      setReviewComment('');
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setCommenting(false);
    }
  }, [
    reviewCommentRef,
    reviewing,
    onSelectSubmissions,
    onModalClose,
    setReviewComment,
  ]);

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        maxW="40rem"
        background="linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #1A202C"
        boxShadow="0 0.25rem 0.25rem rgba(0, 0, 0, 0.25)"
        borderRadius="0.5rem"
      >
        <ModalHeader textTransform={'uppercase'} fontSize="md">
          You are about to {reviewing[0]?.success ? 'approve' : 'reject'}{' '}
          {reviewing.length} submission{reviewing.length > 1 ? 's' : ''} with a
          comment
        </ModalHeader>
        <ModalCloseButton borderRadius="full" />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel
              color="gray.500"
              htmlFor="reviewComment"
              fontWeight="bold"
            >
              Comment
            </FormLabel>
            <Flex pb={4} w="100%">
              <MarkdownEditor
                value={reviewCommentRef.current}
                placeholder="Write what you liked about the submissions..."
                onChange={setReviewComment}
                height="12rem"
              />
            </Flex>
          </FormControl>
        </ModalBody>

        <ModalFooter alignItems="baseline">
          <HStack justify="space-between" spacing={2}>
            <Button
              variant="ghost"
              onClick={onModalClose}
              borderRadius="full"
              textTransform="uppercase"
              size="sm"
            >
              CANCEL
            </Button>
            <Button
              size="sm"
              isLoading={commenting}
              variant="ghost"
              borderRadius="full"
              onClick={onSubmitComment}
              textTransform="uppercase"
              color={reviewing[0]?.success ? 'main' : 'rejected'}
            >
              Add comment and {reviewing[0]?.success ? 'approve' : 'reject'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
