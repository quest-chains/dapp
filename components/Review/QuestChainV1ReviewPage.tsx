import {
  Accordion,
  Box,
  Flex,
  Spinner,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { EmptyView } from '@/components/Review/EmptyView';
import {
  removeSelectedFromReviewed,
  sort,
  statusToSubmission,
} from '@/components/Review/helpers';
import { ReviewCommentModal } from '@/components/Review/ReviewCommentModal';
import { ReviewTabsList } from '@/components/Review/ReviewTabsList';
import {
  DisplaySubmissionType,
  ReviewToolbar,
  SORT,
} from '@/components/Review/ReviewToolbar';
import {
  SubmissionTile,
  SubmissionType,
} from '@/components/Review/SubmissionTile';
import { SubmitButton } from '@/components/SubmitButton';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

type Props = {
  questChain: graphql.QuestChainInfoFragment;
  questStatuses: graphql.QuestStatusInfoFragment[];
  fetching: boolean;
  refresh: () => void;
};

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
  const [displayAwaitingReview, setDisplayAwaitingReview] = useState<
    DisplaySubmissionType[]
  >([]);

  const [tabIndex, setTabIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [reviewed, setReviewed] = useState<SubmissionType[]>([]);
  const [displayReviewed, setDisplayReviewed] = useState<
    DisplaySubmissionType[]
  >([]);

  const [filterReviewed, setFilterReviewed] = useState<string>('');
  const [filterAwaitingReview, setFilterAwaitingReview] = useState<string>('');

  const [sortReviewed, setSortReviewed] = useState<SORT>(SORT.DateDesc);
  const [sortAwaitingReview, setSortAwaitingReview] = useState<SORT>(
    SORT.DateDesc,
  );

  const setCheckedItemAwaitingReview = useCallback((index: number) => {
    setDisplayAwaitingReview(oldDisplayAwaitingReview => {
      oldDisplayAwaitingReview[index].checked =
        !oldDisplayAwaitingReview[index].checked;
      return oldDisplayAwaitingReview.slice();
    });
  }, []);

  const setCheckedItemReviewed = useCallback((index: number) => {
    setDisplayReviewed(oldDisplayReviewed => {
      oldDisplayReviewed[index].checked = !oldDisplayReviewed[index].checked;
      return oldDisplayReviewed.slice();
    });
  }, []);

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
        previous.filter(q => reviewed.every(r => r.id !== q.id)),
      );
    }
  }, [reviewed]);

  useEffect(() => {
    setDisplayAwaitingReview(oldDisplayAwaitingReview => {
      const filteredAwaitingReview = awaitingReview
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
        );

      return filteredAwaitingReview.map(submission => {
        const displaySubmission = oldDisplayAwaitingReview.find(
          d => d.submission.id === submission.id,
        );
        if (displaySubmission) return displaySubmission;
        return { submission, expanded: false, checked: false };
      });
    });
  }, [awaitingReview, filterAwaitingReview, sortAwaitingReview]);

  useEffect(() => {
    setDisplayReviewed(oldDisplayReviewed => {
      const filteredReviewed = reviewed
        .filter(
          submission =>
            filterReviewed === '' || filterReviewed === submission.questId,
        )
        .sort((a, b) =>
          sort(a.submissionTimestamp, b.submissionTimestamp, sortReviewed),
        );

      return filteredReviewed.map(submission => {
        const displaySubmission = oldDisplayReviewed.find(
          d => d.submission.id === submission.id,
        );
        if (displaySubmission) return { ...displaySubmission, submission };
        return { submission, expanded: false, checked: false };
      });
    });
  }, [reviewed, filterReviewed, sortReviewed]);

  const [reviewing, setReviewing] = useState<SubmissionType[]>([]);

  const onModalClose = useCallback(() => {
    setReviewing([]);
    onCloseModal();
  }, [onCloseModal]);

  const clearChecked = useCallback(() => {
    setDisplayAwaitingReview(old =>
      old.map(old => {
        old.checked = false;
        return old;
      }),
    );
    setDisplayReviewed(old =>
      old.map(old => {
        old.checked = false;
        return old;
      }),
    );
  }, []);

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
            <ReviewTabsList
              awaitingReviewLength={awaitingReview.length}
              reviewedLength={reviewed.length}
              submittedLength={submitted.length}
              allSubmissionsLength={allSubmissions.length}
            />

            {/* ReviewToolbar Awaiting Review */}
            {tabIndex === 0 && awaitingReview.length != 0 && (
              <ReviewToolbar
                allQuestIds={[
                  ...new Set(awaitingReview.map(({ questId }) => questId)),
                ]}
                onReview={onReview}
                isDisabled={isDisabled}
                setFilter={setFilterAwaitingReview}
                filterValue={filterAwaitingReview}
                setSort={setSortAwaitingReview}
                sortValue={sortAwaitingReview}
                displaySubmissions={displayAwaitingReview}
                setDisplaySubmissions={setDisplayAwaitingReview}
              />
            )}

            {/* ReviewToolbar Reviewed */}
            {tabIndex === 1 && reviewed.length != 0 && (
              <ReviewToolbar
                allQuestIds={[
                  ...new Set(reviewed.map(({ questId }) => questId)),
                ]}
                onReview={onReview}
                isDisabled={isDisabled}
                clearReview={clearReview}
                setFilter={setFilterReviewed}
                filterValue={filterReviewed}
                setSort={setSortReviewed}
                sortValue={sortReviewed}
                displaySubmissions={displayReviewed}
                setDisplaySubmissions={setDisplayReviewed}
              />
            )}

            <TabPanels>
              {/* awaiting review */}
              <TabPanel p={0}>
                {!displayAwaitingReview.length && (
                  <EmptyView text="There are currently no submissions awaiting review." />
                )}
                {!!displayAwaitingReview.length && (
                  <Accordion
                    allowMultiple
                    index={displayAwaitingReview
                      .map((d, i) => (d.expanded ? i : -1))
                      .filter(d => d != -1)}
                    onChange={(idxs: number[]) =>
                      setDisplayAwaitingReview(v =>
                        v.map((d, i) => ({
                          ...d,
                          expanded: idxs.includes(i) ? true : false,
                        })),
                      )
                    }
                  >
                    {displayAwaitingReview.map(
                      ({ submission, checked }, index) => (
                        <SubmissionTile
                          submission={submission}
                          onReview={onReview}
                          key={submission.id}
                          isDisabled={isDisabled}
                          checked={checked}
                          onCheck={() => setCheckedItemAwaitingReview(index)}
                        />
                      ),
                    )}
                  </Accordion>
                )}
              </TabPanel>

              {/* reviewed */}
              <TabPanel p={0}>
                {!displayReviewed.length && (
                  <EmptyView text="There are currently no reviewed submissions." />
                )}
                {!!displayReviewed.length && (
                  <Accordion
                    allowMultiple
                    index={displayReviewed
                      .map((d, i) => (d.expanded ? i : -1))
                      .filter(d => d != -1)}
                    onChange={(idxs: number[]) =>
                      setDisplayReviewed(v =>
                        v.map((d, i) => ({
                          ...d,
                          expanded: idxs.includes(i) ? true : false,
                        })),
                      )
                    }
                  >
                    {displayReviewed.map(({ submission, checked }, index) => (
                      <SubmissionTile
                        submission={submission}
                        onReview={onReview}
                        key={submission.id}
                        isDisabled={isDisabled}
                        checked={checked}
                        clearReview={(selected: SubmissionType[]) =>
                          clearReview(selected)
                        }
                        onCheck={() => setCheckedItemReviewed(index)}
                      />
                    ))}
                  </Accordion>
                )}
              </TabPanel>

              {/* submitted */}
              <TabPanel p={0}>
                {!submitted.length && (
                  <EmptyView text="There are currently no submitted reviews." />
                )}
                {!!submitted.length && (
                  <Accordion allowMultiple defaultIndex={[]} mt={4}>
                    {submitted.map(submission => (
                      <SubmissionTile
                        submission={submission}
                        onReview={() => undefined}
                        key={submission.id}
                        isDisabled={isDisabled}
                        showButtons={false}
                      />
                    ))}
                  </Accordion>
                )}
              </TabPanel>

              {/* allSubmissions */}
              <TabPanel p={0}>
                {!allSubmissions.length && (
                  <EmptyView text="There are currently no submissions." />
                )}
                {!!allSubmissions.length && (
                  <Accordion allowMultiple defaultIndex={[]} mt={4}>
                    {allSubmissions.map(submission => (
                      <SubmissionTile
                        submission={submission}
                        onReview={() => undefined}
                        key={submission.id}
                        isDisabled={isDisabled}
                        showButtons={false}
                      />
                    ))}
                  </Accordion>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>
      <ReviewCommentModal
        {...{ reviewing, isModalOpen, onModalClose, onSelectSubmissions }}
      />
    </VStack>
  );
};
