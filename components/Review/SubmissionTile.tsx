import { AttachmentIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';

import { ipfsUriToHttp } from '@/utils/uriHelpers';

import { MarkdownViewer } from '../MarkdownViewer';
import { UserDisplay } from '../UserDisplay';
import { PopoverButton, SubmissionType } from './PopoverButton';

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
  } = submission;

  const date = new Date(submissionTimestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const imageUrl = ipfsUriToHttp(imageUri);
  const externalUrl = ipfsUriToHttp(externalUri);

  return (
    <AccordionItem
      borderRadius={10}
      mb={3}
      border={0}
      bgColor="#1E2025"
      pl={8}
      role="group"
      pb={6}
    >
      {({ isExpanded }) => (
        <>
          <Flex alignItems="center" justifyContent="space-between" h={20}>
            <Flex gap={4}>
              {onCheck && (
                <Checkbox isChecked={checked} onChange={onCheck}></Checkbox>
              )}
              <Text fontWeight="bold">{`${1 + Number(questId)}. ${name}`}</Text>
              {externalUrl && <AttachmentIcon />}
            </Flex>

            <Flex alignItems="center" gap={6}>
              <UserDisplay address={userId} />
              <Text>
                {year}-{month}-{day}
              </Text>
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
          <Flex w="full" gap={2} pr={8} position="relative">
            {imageUrl && (
              <Link isExternal href={imageUrl} _hover={{}} minW="fit-content">
                <Image
                  src={imageUrl}
                  alt="submission pic"
                  w="full"
                  h={isExpanded ? '12rem' : 12}
                  minW="fit-content"
                  pr={4}
                />
              </Link>
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
                  {submissionDescription}
                </Text>
              )}
            </Box>

            {submission.success !== undefined && (
              <Flex
                position="absolute"
                right={6}
                top={1}
                height={12}
                pl={14}
                gap={2}
                bgGradient="linear(to-r, transparent 0%, #1E2025 20%)"
              >
                {submission.success ? (
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
                {showButtons && (
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
                        {submission.success && (
                          <PopoverButton
                            toReview={[submission]}
                            onReview={onReview}
                            isDisabled={isDisabled}
                            success={false}
                          />
                        )}
                        {!submission.success && (
                          <PopoverButton
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

            {submission.success === undefined && showButtons && (
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
                <PopoverButton
                  toReview={[submission]}
                  onReview={onReview}
                  isDisabled={isDisabled}
                  success={false}
                />

                <PopoverButton
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
              <Link isExternal color="main" href={externalUrl}>
                <AttachmentIcon mr={2} />
                {'View attachments'}
              </Link>
            </Flex>
          )}
        </>
      )}
    </AccordionItem>
  );
};
