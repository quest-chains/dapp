import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import CommentCheck from '@/assets/CommentCheck.svg';
import CommentClose from '@/assets/CommentClose.svg';

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
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      isLazy
      lazyBehavior="keepMounted"
    >
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
            isDisabled={isDisabled}
          >
            {success ? <CheckIcon w={4} mr={2} /> : <CloseIcon w={4} mr={2} />}
            {success ? 'Accept' : 'Reject'}
          </Button>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent
        background="gray.900"
        borderColor="transparent"
        position="absolute"
        top="-57px"
        left="-74px"
        w="xxs"
      >
        <PopoverBody background="transparent" borderColor="transparent">
          <Button
            borderRadius={24}
            bgColor="gray.900"
            px={6}
            onClick={() => {
              onReview(
                toReview.map(r => ({
                  ...r,
                  success,
                })),
                false,
              );
              onClose();
            }}
          >
            {success ? <CheckIcon w={4} mr={2} /> : <CloseIcon w={4} mr={2} />}
            {success ? 'Accept' : 'Reject'}
          </Button>

          <Button
            borderRadius={24}
            bgColor="gray.900"
            px={6}
            onClick={() => {
              onReview(
                toReview.map(r => ({
                  ...r,
                  success,
                })),
                true,
              );
              onClose();
            }}
          >
            <Image
              src={success ? CommentCheck.src : CommentClose.src}
              alt="comment check"
              mr={2}
              w={4}
            />
            {success ? 'Accept and comment' : 'Reject and comment'}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
