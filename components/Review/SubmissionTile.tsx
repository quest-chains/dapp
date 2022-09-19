import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Flex,
  Image,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import CommentCheck from '@/assets/CommentCheck.svg';
import CommentClose from '@/assets/CommentClose.svg';
import { ipfsUriToHttp } from '@/utils/uriHelpers';

import { MarkdownViewer } from '../MarkdownViewer';
import { UserDisplay } from '../UserDisplay';

type ModalQuestType = {
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

export const SubmissionTile: React.FC<{
  review: ModalQuestType;
  onReview: (quest: any) => void;
  isDisabled: boolean;
}> = ({ review, onReview, isDisabled }) => {
  const {
    userId,
    questId,
    name,
    description,
    submissionDescription,
    submissionUrl,
    submissionTimestamp,
  } = review;

  const date = new Date(submissionTimestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const url = ipfsUriToHttp(submissionUrl);

  const {
    onOpen: onOpenAccept,
    onClose: onCloseAccept,
    isOpen: isOpenAccept,
  } = useDisclosure();
  const {
    onOpen: onOpenReject,
    onClose: onCloseReject,
    isOpen: isOpenReject,
  } = useDisclosure();

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
            <Flex>
              <Checkbox pr={4}></Checkbox>
              <Text fontWeight="bold">{`${1 + Number(questId)}. ${name}`}</Text>
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
          {!isExpanded && (
            <Flex w="full" position="relative" h={12}>
              {url && (
                <Link isExternal href={url} _hover={{}}>
                  <Image src={url} alt="submission pic" maxH={12} pr={5} />
                </Link>
              )}
              <Text
                overflow="hidden"
                textOverflow="ellipsis"
                display="-webkit-box"
                css={{
                  WebkitLineClamp: '2',
                  '-webkit-box-orient': 'vertical',
                }}
                mr={10}
                h={12}
              >
                {submissionDescription}
              </Text>
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
                <Popover
                  isOpen={isOpenReject}
                  onOpen={() => {
                    onOpenReject();
                    onCloseAccept();
                  }}
                  onClose={onCloseReject}
                  isLazy
                  lazyBehavior="keepMounted"
                >
                  <PopoverTrigger>
                    <Tooltip
                      shouldWrapChildren
                      label="Please switch to the correct chain"
                      isDisabled={!isDisabled}
                      color="black"
                    >
                      <Button
                        borderRadius={24}
                        bgColor="gray.900"
                        px={6}
                        borderColor="gray.600"
                        borderWidth={1}
                        isDisabled={isDisabled}
                      >
                        <CloseIcon w={4} mr={2} />
                        Reject
                      </Button>
                    </Tooltip>
                  </PopoverTrigger>

                  <PopoverContent
                    background="gray.900"
                    borderColor="transparent"
                    position="absolute"
                    top="-57px"
                    left="-74px"
                    w="xxs"
                  >
                    <PopoverBody
                      background="transparent"
                      borderColor="transparent"
                    >
                      <Button
                        borderRadius={24}
                        bgColor="gray.900"
                        px={6}
                        onClick={() => {
                          onReview({
                            ...review,
                            success: false,
                          });
                          onCloseReject();
                        }}
                      >
                        <CloseIcon w={4} mr={2} />
                        Reject
                      </Button>
                      <Button
                        borderRadius={24}
                        bgColor="gray.900"
                        px={6}
                        onClick={() => {
                          onReview({
                            ...review,
                            success: false,
                          });
                          onCloseReject();
                        }}
                      >
                        <Image
                          src={CommentClose.src}
                          alt="comment check"
                          mr={2}
                          w={4}
                        />
                        Reject and comment
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>

                <Popover
                  isOpen={isOpenAccept}
                  onOpen={() => {
                    onCloseReject();
                    onOpenAccept();
                  }}
                  onClose={onCloseAccept}
                  isLazy
                  lazyBehavior="keepMounted"
                >
                  <PopoverTrigger>
                    <Tooltip
                      shouldWrapChildren
                      label="Please switch to the correct chain"
                      isDisabled={!isDisabled}
                      color="black"
                    >
                      <Button
                        borderRadius={24}
                        bgColor="gray.900"
                        px={6}
                        borderColor="gray.600"
                        borderWidth={1}
                        isDisabled={isDisabled}
                      >
                        <CheckIcon w={4} mr={2} />
                        Accept
                      </Button>
                    </Tooltip>
                  </PopoverTrigger>

                  <PopoverContent
                    background="gray.900"
                    borderColor="transparent"
                    position="absolute"
                    top="-57px"
                    left="-74px"
                    w="xxs"
                  >
                    <PopoverBody
                      background="transparent"
                      borderColor="transparent"
                    >
                      <Button
                        borderRadius={24}
                        bgColor="gray.900"
                        px={6}
                        onClick={() => {
                          onReview({
                            ...review,
                            success: true,
                          });
                          onCloseAccept();
                        }}
                      >
                        <CheckIcon w={4} mr={2} />
                        Accept
                      </Button>

                      <Button
                        borderRadius={24}
                        bgColor="gray.900"
                        px={6}
                        onClick={() => {
                          onReview({
                            ...review,
                            success: true,
                          });
                          onCloseAccept();
                        }}
                      >
                        <Image
                          src={CommentCheck.src}
                          alt="comment check"
                          mr={2}
                          w={4}
                        />
                        Accept and comment
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            </Flex>
          )}

          {isExpanded && (
            <AccordionPanel pr={8} pl={0}>
              <Flex w="full" fontSize="lg">
                <MarkdownViewer markdown={description ?? ''} />
              </Flex>
            </AccordionPanel>
          )}
        </>
      )}
    </AccordionItem>
  );
};
