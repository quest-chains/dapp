import 'react-medium-image-zoom/dist/styles.css';

import { AttachmentIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Zoom from 'react-medium-image-zoom';
import removeMd from 'remove-markdown';

import { CommentIcon } from '@/components/icons/CommentIcon';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import {
  ReviewPopoverButton,
  SubmissionType,
} from '@/components/Review/ReviewPopoverButton';
import { UserDisplay } from '@/components/UserDisplay';
import { useInputText } from '@/hooks/useInputText';
import { formatDate } from '@/utils/dateHelpers';
import { handleError } from '@/utils/helpers';
import { Metadata, uploadMetadata } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';

export type { SubmissionType };

export const SubmissionTile: React.FC<{
  submission: SubmissionType;
  onReview: (quest: SubmissionType[], withComment: boolean) => void;
  showButtons?: boolean;
  isDisabled: boolean;
  checked?: boolean;
  onCheck?: () => void;
  clearReview?: (selected: SubmissionType[]) => void;
}> = ({
  submission,
  onReview,
  isDisabled,
  checked,
  onCheck,
  clearReview,
  showButtons = true,
}) => {
  const {
    userId,
    questId,
    name,
    submissionDescription,
    imageUri,
    externalUri,
    submissionTimestamp,
    reviewComment,
    success,
  } = submission;

  const date = new Date(submissionTimestamp * 1000);

  const imageUrl = ipfsUriToHttp(imageUri);
  const externalUrl = ipfsUriToHttp(externalUri);
  const [isEditing, setEditing] = useState(false);

  return (
    <AccordionItem borderRadius={10} mb={3} border={0} bgColor="#1E2025">
      {({ isExpanded }) => (
        <>
          <VStack
            w="100%"
            pl={8}
            pb={6}
            spacing={0}
            align="stretch"
            role="group"
          >
            <Flex alignItems="center" justifyContent="space-between" h={20}>
              <Flex gap={4}>
                {onCheck && (
                  <Checkbox isChecked={checked} onChange={onCheck}></Checkbox>
                )}
                <Text fontWeight="bold">{`${
                  1 + Number(questId)
                }. ${name}`}</Text>
                {externalUrl && <AttachmentIcon />}
              </Flex>

              <Flex alignItems="center" gap={6}>
                <UserDisplay address={userId} />
                <Text>{formatDate(date)}</Text>
                <AccordionButton
                  py={6}
                  w="auto"
                  pr={8}
                  _focus-visible={{
                    boxShadow: 'none',
                  }}
                >
                  <AccordionIcon />
                </AccordionButton>
              </Flex>
            </Flex>
            <Flex w="full" h="full" gap={4} pr={8} position="relative">
              {imageUrl && (
                <Zoom>
                  <Image
                    src={imageUrl}
                    alt="submission pic"
                    w={isExpanded ? '18rem' : '6rem'}
                    minH="fit-content"
                  />
                </Zoom>
              )}

              <Box flexGrow={1}>
                {isExpanded && (
                  <MarkdownViewer markdown={submissionDescription ?? ''} />
                )}
                {!isExpanded && (
                  <Text
                    overflow="hidden"
                    textOverflow="ellipsis"
                    css={{
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                    }}
                    h={12}
                  >
                    {removeMd(submissionDescription ?? '')}
                  </Text>
                )}
              </Box>

              {success !== undefined && (
                <Flex
                  position="absolute"
                  right={6}
                  top={1}
                  height={12}
                  pl={14}
                  gap={2}
                  bgGradient="linear(to-r, transparent 0%, #1E2025 20%)"
                >
                  {success ? (
                    <Flex
                      bg="#171923"
                      justifyContent="center"
                      alignItems="center"
                      h={10}
                      w={10}
                      borderRadius="full"
                      border="1px solid #10B981"
                    >
                      <CheckIcon color="#10B981" />
                    </Flex>
                  ) : (
                    <Flex
                      bg="#171923"
                      justifyContent="center"
                      alignItems="center"
                      h={10}
                      w={10}
                      borderRadius="full"
                      border="1px solid #F43F5E"
                    >
                      <CloseIcon color="#F43F5E" />
                    </Flex>
                  )}
                  {showButtons && !isEditing && (
                    <Flex
                      opacity={0}
                      _groupHover={{
                        opacity: 1,
                      }}
                      transition="opacity 0.25s"
                      position="absolute"
                      right={0}
                      top={0}
                      height={12}
                      pl={14}
                      gap={2}
                      bgGradient="linear(to-r, transparent 0%, #1E2025 20%)"
                    >
                      {clearReview && (
                        <>
                          {!reviewComment && (
                            <IconButton
                              bg="gray.900"
                              justifyContent="center"
                              alignItems="center"
                              h={10}
                              w={10}
                              borderRadius="full"
                              borderStyle="solid"
                              borderWidth={1}
                              borderColor="gray.600"
                              color="white"
                              aria-label="add-comment"
                              _hover={{ borderColor: 'white' }}
                              icon={<CommentIcon />}
                              onClick={() => setEditing(true)}
                            />
                          )}
                          {success && (
                            <ReviewPopoverButton
                              toReview={[submission]}
                              onReview={onReview}
                              isDisabled={isDisabled}
                              success={false}
                            />
                          )}
                          {!success && (
                            <ReviewPopoverButton
                              toReview={[submission]}
                              onReview={onReview}
                              isDisabled={isDisabled}
                              success={true}
                            />
                          )}
                          <Button
                            borderRadius={24}
                            bgColor="gray.900"
                            px={6}
                            borderColor="gray.600"
                            borderWidth={1}
                            isDisabled={isDisabled}
                            _hover={{ borderColor: 'white' }}
                            onClick={() => {
                              clearReview([submission]);
                            }}
                          >
                            Clear Review
                          </Button>
                        </>
                      )}
                    </Flex>
                  )}
                </Flex>
              )}

              {success === undefined && showButtons && (
                <Flex
                  opacity={0}
                  _groupHover={{
                    opacity: 1,
                  }}
                  transition="opacity 0.25s"
                  position="absolute"
                  right={6}
                  top={1}
                  height={12}
                  pl={14}
                  gap={2}
                  bgGradient="linear(to-r, transparent 0%, #1E2025 20%)"
                >
                  <ReviewPopoverButton
                    toReview={[submission]}
                    onReview={onReview}
                    isDisabled={isDisabled}
                    success={false}
                  />

                  <ReviewPopoverButton
                    toReview={[submission]}
                    onReview={onReview}
                    isDisabled={isDisabled}
                    success={true}
                  />
                </Flex>
              )}
            </Flex>
            {isExpanded && externalUrl && (
              <Flex w="100%" mt={4}>
                <Link isExternal color="#10B981" href={externalUrl}>
                  <AttachmentIcon mr={2} />
                  {'View attachments'}
                </Link>
              </Flex>
            )}
          </VStack>
          <ReviewComment
            {...{
              submission,
              onReview,
              showButtons,
              isDisabled,
              isExpanded,
              isEditing,
              setEditing,
            }}
          />
        </>
      )}
    </AccordionItem>
  );
};

const ReviewComment: React.FC<{
  isExpanded: boolean;
  submission: SubmissionType;
  onReview: (quest: SubmissionType[], withComment: boolean) => void;
  showButtons?: boolean;
  isDisabled: boolean;
  isEditing: boolean;
  setEditing: (e: boolean) => void;
}> = ({
  isExpanded,
  submission,
  onReview,
  showButtons,
  setEditing,
  isEditing,
}) => {
  const { reviewComment, success } = submission;

  const [commenting, setCommenting] = useState(false);
  const [newCommentRef, setNewComment] = useInputText(reviewComment);

  const onSubmitComment = useCallback(async () => {
    let tid;
    try {
      if (!newCommentRef.current || newCommentRef.current === reviewComment) {
        toast.error('No change in comment');
        return;
      }
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      const metadata: Metadata = {
        name: `Reviewing 1 submission`,
        description: newCommentRef.current,
      };

      const hash = await uploadMetadata(metadata);
      const details = `ipfs://${hash}`;
      onReview(
        [
          {
            ...submission,
            reviewCommentUri: details,
            reviewComment: newCommentRef.current,
          },
        ],
        false,
      );
      toast.dismiss(tid);
      setEditing(false);
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setCommenting(false);
    }
  }, [submission, onReview, setEditing, newCommentRef, reviewComment]);

  useEffect(() => {
    setNewComment(reviewComment ?? '');
  }, [isEditing, reviewComment, setNewComment]);

  const [isRemoving, setRemoving] = useState(false);

  const onRemoveComment = useCallback(() => {
    onReview(
      [
        {
          ...submission,
          reviewCommentUri: '',
          reviewComment: '',
        },
      ],
      false,
    );
    setEditing(false);
    setRemoving(false);
    toast.success(`Successfully removed comment`);
  }, [submission, onReview, setEditing]);

  if ((!reviewComment && !isEditing) || typeof success !== 'boolean')
    return null;

  return (
    <Flex
      w="100%"
      p={6}
      pb={isEditing ? 4 : 6}
      background="linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #1A202C"
      role="group"
      position="relative"
      flexDirection="column"
      gap="4"
    >
      {isEditing ? (
        <MarkdownEditor
          value={newCommentRef.current}
          onChange={setNewComment}
          height="8rem"
        />
      ) : (
        <>
          {isExpanded && <MarkdownViewer markdown={reviewComment ?? ''} />}
          {!isExpanded && (
            <Text
              overflow="hidden"
              textOverflow="ellipsis"
              css={{
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
              maxH={12}
            >
              {removeMd(reviewComment ?? '')}
            </Text>
          )}
        </>
      )}
      {showButtons && !isEditing && (
        <Flex
          opacity={0}
          _groupHover={{
            opacity: 1,
          }}
          transition="opacity 0.25s"
          position="absolute"
          background="linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 20%), linear-gradient(to right, transparent 0%, #1A202C 20%)"
          right={4}
          top="50%"
          transform="translateY(-50%)"
          gap={2}
        >
          <Button
            variant="ghost"
            size="sm"
            textTransform="uppercase"
            borderRadius={24}
            bgColor="none"
            borderColor="none"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </Flex>
      )}
      {showButtons && isEditing && !isRemoving && (
        <Flex justify="space-between" align="center" w="100%">
          {reviewComment ? (
            <Button
              variant="ghost"
              onClick={() => setRemoving(true)}
              borderRadius="full"
              textTransform="uppercase"
              size="sm"
              color="#F43F5E"
            >
              REMOVE COMMENT
            </Button>
          ) : (
            <Flex />
          )}
          <HStack spacing={2}>
            <Button
              variant="ghost"
              onClick={() => setEditing(false)}
              borderRadius="full"
              textTransform="uppercase"
              size="sm"
            >
              {reviewComment ? 'Cancel editing' : 'Cancel'}
            </Button>
            <Button
              size="sm"
              isLoading={commenting}
              variant="ghost"
              borderRadius="full"
              onClick={() => {
                setCommenting(true);
                onSubmitComment();
              }}
              textTransform="uppercase"
              color="#10B981"
            >
              {reviewComment ? 'Save Changes' : 'Add comment'}
            </Button>
          </HStack>
        </Flex>
      )}
      {showButtons && isEditing && isRemoving && (
        <HStack spacing={2}>
          <Text color="gray.400">Remove comment? </Text>
          <Button
            variant="ghost"
            onClick={() => {
              setEditing(false);
              setRemoving(false);
            }}
            borderRadius="full"
            textTransform="uppercase"
            size="sm"
          >
            No, Keep it
          </Button>
          <Button
            size="sm"
            variant="ghost"
            borderRadius="full"
            onClick={onRemoveComment}
            textTransform="uppercase"
            color="#F43F5E"
          >
            Yes, Remove it
          </Button>
        </HStack>
      )}
    </Flex>
  );
};
