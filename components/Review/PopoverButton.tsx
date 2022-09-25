import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import { CommentCheckIcon } from '../icons/CommentCheckIcon';
import { CommentCloseIcon } from '../icons/CommentCloseIcon';

export type SubmissionType = {
  id: string;
  userId: string;
  questId: string;
  name: string | null | undefined;
  description: string | null | undefined;
  success?: boolean;
  submissionDescription: string;
  imageUri?: string;
  externalUri?: string;
  submissionTimestamp: number;
  reviewCommentUri?: string;
  reviewComment?: string;
};

export const PopoverButton: React.FC<{
  toReview: SubmissionType[];
  onReview: (quest: SubmissionType[], withComment: boolean) => void;
  isDisabled: boolean;
  success: boolean;
}> = ({ toReview, onReview, isDisabled, success }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <Tooltip
        shouldWrapChildren
        label="Please switch to the correct chain"
        isDisabled={!isDisabled}
        color="black"
      >
        <PopoverTrigger>
          <Button
            borderRadius={24}
            bgColor="gray.900"
            px={6}
            borderColor="gray.600"
            borderWidth={1}
            _hover={{
              borderColor: success ? '#10B981' : '#F43F5E',
              color: success ? '#10B981' : '#F43F5E',
            }}
            isDisabled={isDisabled}
            leftIcon={success ? <CheckIcon w={4} /> : <CloseIcon w={4} />}
          >
            {success ? 'Accept' : 'Reject'}
          </Button>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent
        background="gray.900"
        borderColor="gray.600"
        position="absolute"
        top="-57px"
        left="-74px"
        w="xxs"
      >
        <PopoverBody>
          <Button
            bgColor="gray.900"
            size="sm"
            p={4}
            _hover={{
              borderColor: success ? '#10B981' : '#F43F5E',
              color: success ? '#10B981' : '#F43F5E',
            }}
            onClick={() => {
              onReview(
                toReview.map(r => ({
                  ...r,
                  success,
                  reviewComment: '',
                  reviewCommentUri: '',
                })),
                false,
              );
              onClose();
            }}
            leftIcon={success ? <CheckIcon w={4} /> : <CloseIcon w={4} />}
          >
            {success ? 'Accept' : 'Reject'}
          </Button>

          <Button
            bgColor="gray.900"
            _hover={{
              borderColor: success ? '#10B981' : '#F43F5E',
              color: success ? '#10B981' : '#F43F5E',
            }}
            p={4}
            size="sm"
            onClick={() => {
              onReview(
                toReview.map(r => ({
                  ...r,
                  success,
                  reviewComment: '',
                  reviewCommentUri: '',
                })),
                true,
              );
              onClose();
            }}
            leftIcon={
              success ? <CommentCheckIcon w={4} /> : <CommentCloseIcon w={4} />
            }
          >
            {success ? 'Accept with comment' : 'Reject with comment'}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
