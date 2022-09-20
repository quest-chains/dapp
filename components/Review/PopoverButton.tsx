import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
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
  submissionUrl?: string;
  submissionTimestamp: number;
};

export const PopoverButton: React.FC<{
  review: SubmissionType[];
  onReview: (quest: any) => void;
  isDisabled: boolean;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  onCloseOther: () => void;
  success: boolean;
}> = ({
  review,
  onReview,
  isDisabled,
  onOpen,
  onClose,
  isOpen,
  onCloseOther,
  success,
}) => {
  return (
    <Popover
      isOpen={isOpen}
      onOpen={() => {
        onCloseOther();
        onOpen();
      }}
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
                review.map(r => ({
                  ...r,
                  success,
                })),
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
                review.map(r => ({
                  ...r,
                  success,
                })),
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
