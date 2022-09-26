import {
  Accordion,
  Box,
  Button,
  Checkbox,
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
  Select,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { PopoverButton } from '@/components/Review/PopoverButton';
import {
  SubmissionTile,
  SubmissionType,
} from '@/components/Review/SubmissionTile';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { uploadMetadata } from '@/utils/metadata';
import { Metadata } from '@/utils/validate';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

type Props = {
  questChain: graphql.QuestChainInfoFragment;
  questStatuses: graphql.QuestStatusInfoFragment[];
  fetching: boolean;
  refresh: () => void;
};

const removeSelectedFromReviewed = (
  r: SubmissionType[],
  selected: SubmissionType[],
) => r.filter(r => !selected.map(s => s.id).includes(r.id));

const statusToSubmission = (
  q: graphql.QuestStatusInfoFragment,
): SubmissionType => ({
  id: q.id,
  userId: q.user.id,
  questId: q.quest.questId,
  name: q.quest.name,
  description: q.quest.description,
  submissionDescription:
    q.submissions[q.submissions.length - 1].description ?? '',
  imageUri: q.submissions[q.submissions.length - 1]?.imageUrl || undefined,
  externalUri:
    q.submissions[q.submissions.length - 1]?.externalUrl || undefined,
  submissionTimestamp: Number(
    q.submissions[q.submissions.length - 1].timestamp,
  ),
  reviewComment: q.reviews.length
    ? q.reviews[q.reviews.length - 1].description ?? ''
    : '',
  success:
    q.status === graphql.Status.Pass
      ? true
      : q.status === graphql.Status.Fail
      ? false
      : undefined,
});

export const QuestChainV1ReviewPage: React.FC<Props> = ({
  questStatuses,
  questChain,
  fetching,
  refresh,
}) => {
  const { provider, chainId } = useWallet();
  const isDisabled = chainId !== questChain?.chainId;
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onCloseModal,
  } = useDisclosure();

  const [allSubmissions, setAllSubmissions] = useState<SubmissionType[]>([]);
  const [submitted, setSubmitted] = useState<SubmissionType[]>([]);

  const [awaitingReview, setAwaitingReview] = useState<SubmissionType[]>([]);
  const [awaitingReviewIndex, setAwaitingReviewIndex] = useState<number[]>([]);

  const [reviewed, setReviewed] = useState<SubmissionType[]>([]);
  const [reviewedIndex, setReviewedIndex] = useState<number[]>([]);

  const [tabIndex, setTabIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [filterReviewed, setFilterReviewed] = useState<string>('');
  const [filterAwaitingReview, setFilterAwaitingReview] = useState<string>('');
  const [checkedReviewed, setCheckedReviewed] = useState<boolean[]>([]);
  const [checkedAwaitingReview, setCheckedAwaitingReview] = useState<boolean[]>(
    [],
  );

  const [sortReviewed, setSortReviewed] = useState<string>('');
  const [sortAwaitingReview, setSortAwaitingReview] = useState<string>('');

  const [isAwaitingReviewIndeterminate, setIsAwaitingReviewIndeterminate] =
    useState<boolean>(false);
  const [isReviewedIndeterminate, setIsReviewedIndeterminate] =
    useState<boolean>(false);

  const allAwaitingReviewChecked =
    checkedAwaitingReview.length !== 0 &&
    checkedAwaitingReview.length === awaitingReview.length &&
    checkedAwaitingReview.every(item => item);
  const allReviewedChecked =
    checkedReviewed.length !== 0 &&
    checkedReviewed.length === reviewed.length &&
    checkedReviewed.every(item => item);

  useEffect(() => {
    setIsAwaitingReviewIndeterminate(
      checkedAwaitingReview.some(Boolean) && !allAwaitingReviewChecked,
    );
    setIsReviewedIndeterminate(
      checkedReviewed.some(Boolean) && !allReviewedChecked,
    );
  }, [
    allAwaitingReviewChecked,
    allReviewedChecked,
    checkedAwaitingReview,
    checkedReviewed,
  ]);

  const setCheckedItemAwaitingReview = (index: number) => {
    checkedAwaitingReview[index] = !checkedAwaitingReview[index];
    setCheckedAwaitingReview([...checkedAwaitingReview]);
  };
  const setCheckedItemReviewed = (index: number) => {
    checkedReviewed[index] = !checkedReviewed[index];
    setCheckedReviewed([...checkedReviewed]);
  };

  useEffect(() => {
    setAllSubmissions(questStatuses.map(statusToSubmission));
    setSubmitted(
      questStatuses
        .filter(
          q =>
            q.status === graphql.Status.Pass ||
            q.status === graphql.Status.Fail,
        )
        .map(statusToSubmission),
    );
    setAwaitingReview(
      questStatuses
        .filter(q => q.status === graphql.Status.Review)
        .map(statusToSubmission),
    );
    setReviewed([]);
  }, [questStatuses]);

  useEffect(() => {
    if (reviewed.length > 0) {
      setAwaitingReview(previous =>
        previous
          .filter(q => reviewed.every(r => r.id !== q.id))
          .sort((a, b) =>
            sort(
              a.submissionTimestamp,
              b.submissionTimestamp,
              sortAwaitingReview,
            ),
          ),
      );
    }
  }, [reviewed, sortAwaitingReview]);

  useEffect(() => {
    if (reviewed.length) {
      setReviewed(
        reviewed.sort((a, b) =>
          sort(a.submissionTimestamp, b.submissionTimestamp, sortReviewed),
        ),
      );
    }
  }, [reviewed, sortReviewed]);

  const [commenting, setCommenting] = useState(false);

  const [reviewCommentRef, setReviewComment] = useInputText();

  const [reviewing, setReviewing] = useState<SubmissionType[]>([]);

  const onModalClose = useCallback(() => {
    setReviewing([]);
    setReviewComment('');
    onCloseModal();
    setCommenting(false);
  }, [onCloseModal, setReviewComment]);

  const clearChecked = useCallback(() => {
    setCheckedAwaitingReview(awaitingReview.map(() => false));
    setCheckedReviewed(reviewed.map(() => false));
  }, [awaitingReview, reviewed]);

  const onSelectSubmissions = useCallback(
    (selected: SubmissionType[]) => {
      setReviewed(reviewed => [
        // first clear all of the reviewed items, then set the new reviews
        ...removeSelectedFromReviewed(reviewed, selected),
        ...selected,
      ]);
      if (selected[0]?.reviewComment) {
        toast.success(
          `Successfully added comment and ${
            selected[0]?.success ? 'approved' : 'rejected'
          } ${selected.length} submission${selected.length > 1 ? 's' : ''}!`,
        );
      } else {
        toast.success(
          `Successfully ${selected[0]?.success ? 'approved' : 'rejected'} ${
            selected.length
          } submission${selected.length > 1 ? 's' : ''}!`,
        );
      }
      // clear current checked items
      clearChecked();
    },
    [clearChecked],
  );

  const onReview = useCallback(
    (selected: SubmissionType[], withComment: boolean) => {
      if (selected.length === 0) return;
      if (withComment) {
        setReviewing(selected);
        onModalOpen();
      } else {
        onSelectSubmissions(selected);
      }
    },
    [onModalOpen, onSelectSubmissions],
  );

  const addAwaitingReview = useCallback((selected: SubmissionType[]) => {
    setAwaitingReview(previous =>
      previous.concat(
        selected.map(r => ({
          ...r,
          success: undefined,
          reviewComment: undefined,
          reviewCommentUri: undefined,
        })),
      ),
    );
  }, []);

  const clearReview = useCallback(
    (selected: SubmissionType[]) => {
      setReviewed(r => [...removeSelectedFromReviewed(r, selected)]);
      clearChecked();
      addAwaitingReview(selected);
    },
    [addAwaitingReview, clearChecked],
  );

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

  const onSubmit = useCallback(async () => {
    if (
      !chainId ||
      !questChain ||
      !provider ||
      chainId !== questChain.chainId ||
      reviewed.length == 0
    )
      return;

    let tid;
    try {
      setSubmitting(true);
      tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );

      const contract = getQuestChainContract(
        questChain.address,
        questChain.version,
        provider.getSigner(),
      );
      const tx = await (contract as contracts.V1.QuestChain).reviewProofs(
        reviewed.map(q => q.userId),
        reviewed.map(q => q.questId),
        reviewed.map(q => !!q.success),
        reviewed.map(q => q.reviewCommentUri ?? ''),
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
      toast.success(`Successfully Reviewed the Submissions!`);
      refresh();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }, [refresh, chainId, questChain, provider, reviewed]);

  const sort = (a: number, b: number, sort: string) => {
    switch (sort) {
      case '':
        return 0;
      case 'date-asc':
        return a - b;
      default:
        return b - a;
    }
  };

  return (
    <VStack w="100%" spacing={8}>
      <Flex w="100%" justifyContent="space-between">
        <Flex flexDirection="column" mb={8}>
          <Text
            fontSize="5xl"
            fontWeight="bold"
            lineHeight="3.5rem"
            fontFamily="heading"
            mb={3}
          >
            {questChain.name}
          </Text>
          <Box>
            <NetworkDisplay chainId={questChain.chainId} />
          </Box>
        </Flex>
        {reviewed.length != 0 && (
          <Flex
            bgColor="whiteAlpha.100"
            borderRadius="full"
            borderColor="transparent"
            height={16}
            alignItems="center"
            pr={2}
            pl={16}
          >
            <Text mr={12}>
              {reviewed.length} review{reviewed.length > 1 ? 's' : ''} ready
            </Text>
            <SubmitButton isLoading={submitting} onClick={onSubmit}>
              Submit
            </SubmitButton>
          </Flex>
        )}
      </Flex>
      <VStack w="100%" spacing={6}>
        {fetching ? (
          <Spinner color="main" />
        ) : (
          <Tabs w="full" p={0} onChange={index => setTabIndex(index)}>
            <TabsList
              awaitingReviewLength={awaitingReview.length}
              reviewedLength={reviewed.length}
              submittedLength={submitted.length}
              allSubmissionsLength={allSubmissions.length}
            />

            {/* Toolbar */}
            {tabIndex === 0 && awaitingReview.length != 0 && (
              <Toolbar
                allChecked={allAwaitingReviewChecked}
                isIndeterminate={isAwaitingReviewIndeterminate}
                submissions={awaitingReview}
                setChecked={setCheckedAwaitingReview}
                checkedSubmissions={checkedAwaitingReview}
                onReview={onReview}
                isDisabled={isDisabled}
                setFilter={setFilterAwaitingReview}
                filterValue={filterAwaitingReview}
                setSort={setSortAwaitingReview}
                sortValue={sortAwaitingReview}
                index={awaitingReviewIndex}
                setIndex={setAwaitingReviewIndex}
              />
            )}

            {tabIndex === 1 && reviewed.length != 0 && (
              <Toolbar
                checkedSubmissions={checkedReviewed}
                allChecked={allReviewedChecked}
                isIndeterminate={isReviewedIndeterminate}
                setChecked={setCheckedReviewed}
                submissions={reviewed}
                onReview={onReview}
                isDisabled={isDisabled}
                clearReview={(selected: SubmissionType[]) =>
                  clearReview(selected)
                }
                setFilter={setFilterReviewed}
                filterValue={filterReviewed}
                setSort={setSortReviewed}
                sortValue={sortReviewed}
                index={reviewedIndex}
                setIndex={setReviewedIndex}
              />
            )}

            <TabPanels>
              {/* awaiting review */}
              <TabPanel p={0}>
                <Accordion
                  allowMultiple
                  index={awaitingReviewIndex}
                  onChange={idx =>
                    setAwaitingReviewIndex(
                      typeof idx === 'number' ? [idx] : idx,
                    )
                  }
                >
                  {awaitingReview
                    .filter(
                      submission =>
                        filterAwaitingReview === '' ||
                        filterAwaitingReview === submission.questId,
                    )
                    .sort((a, b) =>
                      sort(
                        a.submissionTimestamp,
                        b.submissionTimestamp,
                        sortAwaitingReview,
                      ),
                    )
                    .map((submission, index) => (
                      <SubmissionTile
                        submission={submission}
                        onReview={onReview}
                        key={submission.id}
                        isDisabled={isDisabled}
                        checked={checkedAwaitingReview[index]}
                        onCheck={() => setCheckedItemAwaitingReview(index)}
                      />
                    ))}
                </Accordion>
              </TabPanel>
              {/* reviewed */}
              <TabPanel p={0}>
                <Accordion
                  allowMultiple
                  index={reviewedIndex}
                  onChange={idx =>
                    setReviewedIndex(typeof idx === 'number' ? [idx] : idx)
                  }
                >
                  {reviewed
                    .filter(
                      submission =>
                        filterReviewed === '' ||
                        filterReviewed === submission.questId,
                    )
                    .sort((a, b) =>
                      sort(
                        a.submissionTimestamp,
                        b.submissionTimestamp,
                        sortReviewed,
                      ),
                    )
                    .map((submission, index) => (
                      <SubmissionTile
                        submission={submission}
                        onReview={onReview}
                        key={submission.id}
                        isDisabled={isDisabled}
                        checked={checkedReviewed[index]}
                        clearReview={(selected: SubmissionType[]) =>
                          clearReview(selected)
                        }
                        onCheck={() => setCheckedItemReviewed(index)}
                      />
                    ))}
                </Accordion>
              </TabPanel>
              {/* submitted */}
              <TabPanel p={0}>
                <Accordion allowMultiple defaultIndex={[]} mt={4}>
                  {submitted.map((submission, index) => (
                    <SubmissionTile
                      submission={submission}
                      onReview={() => undefined}
                      key={submission.id}
                      isDisabled={isDisabled}
                      checked={checkedReviewed[index]}
                      showButtons={false}
                    />
                  ))}
                </Accordion>
              </TabPanel>
              {/* allSubmissions */}
              <TabPanel p={0}>
                <Accordion allowMultiple defaultIndex={[]} mt={4}>
                  {allSubmissions.map((submission, index) => (
                    <SubmissionTile
                      submission={submission}
                      onReview={() => undefined}
                      key={submission.id}
                      isDisabled={isDisabled}
                      checked={checkedReviewed[index]}
                      showButtons={false}
                    />
                  ))}
                </Accordion>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent
          maxW="40rem"
          background="linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #1A202C"
          boxShadow="0 0.25rem 0.25rem rgba(0, 0, 0, 0.25)"
          borderRadius="0.5rem"
        >
          <ModalHeader textTransform={'uppercase'} fontSize="md">
            You are about to {reviewing[0]?.success ? 'approve' : 'reject'}{' '}
            {reviewing.length} submission{reviewing.length > 1 ? 's' : ''} with
            a comment
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
    </VStack>
  );
};

const TabsList: React.FC<{
  awaitingReviewLength: number;
  reviewedLength: number;
  submittedLength: number;
  allSubmissionsLength: number;
}> = ({
  awaitingReviewLength,
  reviewedLength,
  submittedLength,
  allSubmissionsLength,
}) => {
  return (
    <TabList>
      <Tab
        color="gray.500"
        _selected={{
          color: 'blue.50',
          borderBottom: 'solid 2px white',
        }}
      >
        Awaiting review{' '}
        <Text
          bgColor="whiteAlpha.300"
          borderRadius={10}
          py="2px"
          px={1.5}
          ml={2}
          fontSize={11}
        >
          {awaitingReviewLength}
        </Text>
      </Tab>
      <Tab
        color="gray.500"
        _selected={{
          color: 'blue.50',
          borderBottom: 'solid 2px white',
        }}
      >
        Reviewed
        <Text
          bgColor="whiteAlpha.300"
          borderRadius={10}
          py="2px"
          px={1.5}
          ml={2}
          fontSize={11}
        >
          {reviewedLength}
        </Text>
      </Tab>
      <Tab
        color="gray.500"
        _selected={{
          color: 'blue.50',
          borderBottom: 'solid 2px white',
        }}
      >
        Submitted
        <Text
          bgColor="whiteAlpha.300"
          borderRadius={10}
          py="2px"
          px={1.5}
          ml={2}
          fontSize={11}
        >
          {submittedLength}
        </Text>
      </Tab>
      <Tab
        color="gray.500"
        _selected={{
          color: 'blue.50',
          borderBottom: 'solid 2px white',
        }}
      >
        All
        <Text
          bgColor="whiteAlpha.300"
          borderRadius={10}
          py="2px"
          px={1.5}
          ml={2}
          fontSize={11}
        >
          {allSubmissionsLength}
        </Text>
      </Tab>
    </TabList>
  );
};

const Toolbar: React.FC<{
  allChecked: boolean;
  isIndeterminate: boolean;
  setChecked: (submission: boolean[]) => void;
  submissions: SubmissionType[];
  checkedSubmissions: boolean[];
  onReview: (selected: SubmissionType[], withComment: boolean) => void;
  isDisabled: boolean;
  clearReview?: (selected: SubmissionType[]) => void;
  setFilter: (filter: string) => void;
  filterValue: string;
  setSort: (sort: string) => void;
  sortValue: string;
  index?: number[];
  setIndex?: (idx: number[]) => void;
}> = ({
  allChecked,
  isIndeterminate,
  setChecked,
  submissions,
  checkedSubmissions,
  onReview,
  isDisabled,
  clearReview,
  setFilter,
  filterValue,
  setSort,
  sortValue,
  index,
  setIndex,
}) => {
  const expanded = useMemo(
    () => submissions.length === index?.length,
    [index, submissions],
  );
  const selectOptions = [...new Set(submissions.map(({ questId }) => questId))];

  const onToggleExpand = useCallback(() => {
    if (expanded) {
      setIndex?.([]);
    } else {
      setIndex?.(submissions.map((_, i) => i));
    }
  }, [setIndex, submissions, expanded]);
  return (
    <>
      <Flex py={4} w="full" justifyContent="space-between">
        <Flex gap={4}>
          <Box borderRadius={24} bgColor="rgba(255, 255, 255, 0.06)" px={8}>
            <Checkbox
              py={3}
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={e =>
                setChecked(
                  submissions.map((submission, index) => {
                    // if the filter is not on, apply the checked to all
                    if (filterValue === '') return e.target.checked;

                    // if the filter is on, apply the checked boolean only to the submissions
                    // with the same questId
                    if (
                      filterValue !== '' &&
                      submission.questId === filterValue
                    )
                      return e.target.checked;

                    // otherwise return the boolean of the value of this submission in the
                    // checkedsubmission s array (need Boolean, because the value might be undefined)
                    return Boolean(checkedSubmissions[index]);
                  }),
                )
              }
            ></Checkbox>
          </Box>

          {checkedSubmissions.some(item => item) && (
            <>
              <PopoverButton
                toReview={submissions.filter((_, i) => checkedSubmissions[i])}
                onReview={onReview}
                isDisabled={isDisabled}
                success={false}
              />
              <PopoverButton
                toReview={submissions.filter((_, i) => checkedSubmissions[i])}
                onReview={onReview}
                isDisabled={isDisabled}
                success={true}
              />
              {clearReview && (
                <Button
                  borderRadius={24}
                  bgColor="gray.900"
                  px={6}
                  borderColor="gray.600"
                  borderWidth={1}
                  isDisabled={isDisabled}
                  _hover={{ borderColor: 'white' }}
                  onClick={() => {
                    clearReview(
                      submissions.filter((_, i) => checkedSubmissions[i]),
                    );
                  }}
                >
                  Clear Review
                </Button>
              )}
            </>
          )}
        </Flex>
        <Flex gap={4}>
          <Select
            placeholder="Sort"
            fontSize={14}
            fontWeight="bold"
            bgColor="whiteAlpha.100"
            borderRadius={24}
            borderColor="transparent"
            onChange={e => setSort(e.target.value)}
            value={sortValue}
          >
            <option value="date-asc">Date Asc</option>
            <option value="date-desc">Date Desc</option>
          </Select>
          <Select
            placeholder="Filter"
            fontSize={14}
            fontWeight="bold"
            bgColor="whiteAlpha.100"
            borderRadius={24}
            borderColor="transparent"
            onChange={e => setFilter(e.target.value)}
            value={filterValue}
          >
            {selectOptions.map((value: string) => (
              <option key={value} value={value}>
                Quest {Number(value) + 1}
              </option>
            ))}
          </Select>
          {setIndex && (
            <Button
              px={12}
              color="gray.200"
              fontSize={14}
              fontWeight="bold"
              bgColor="whiteAlpha.100"
              borderRadius={24}
              borderWidth={'1px'}
              borderStyle={'solid'}
              borderColor={'transparent'}
              _hover={{
                borderColor: 'whiteAlpha.400',
              }}
              _active={{
                borderColor: 'whiteAlpha.400',
              }}
              _focus={{
                zIndex: 1,
                borderColor: '#63b3ed',
                boxShadow: '0 0 0 1px #63b3ed',
              }}
              _focusVisible={{
                zIndex: 1,
                borderColor: '#63b3ed',
                boxShadow: '0 0 0 1px #63b3ed',
              }}
              onClick={onToggleExpand}
            >
              {expanded ? 'Close all' : 'Expand all'}
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
};
