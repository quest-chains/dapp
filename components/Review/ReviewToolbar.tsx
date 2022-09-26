import { Box, Button, Checkbox, Flex, Select } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import { ReviewPopoverButton } from '@/components/Review/ReviewPopoverButton';
import { SubmissionType } from '@/components/Review/SubmissionTile';

export type DisplaySubmissionType = {
  expanded: boolean;
  checked: boolean;
  submission: SubmissionType;
};

export enum SORT {
  DateAsc = 'date-asc',
  DateDesc = 'date-desc',
}

export const ReviewToolbar: React.FC<{
  allQuestIds: string[];
  onReview: (selected: SubmissionType[], withComment: boolean) => void;
  isDisabled: boolean;
  clearReview?: (selected: SubmissionType[]) => void;
  setFilter: (filter: string) => void;
  filterValue: string;
  setSort: (sort: SORT) => void;
  sortValue: SORT;
  displaySubmissions: DisplaySubmissionType[];
  setDisplaySubmissions: React.Dispatch<
    React.SetStateAction<DisplaySubmissionType[]>
  >;
}> = ({
  allQuestIds,
  onReview,
  isDisabled,
  clearReview,
  setFilter,
  filterValue,
  setSort,
  sortValue,
  displaySubmissions,
  setDisplaySubmissions,
}) => {
  const checkAll = useCallback(
    (check: boolean) =>
      setDisplaySubmissions(old =>
        old.map(d => {
          d.checked = check;
          return d;
        }),
      ),
    [setDisplaySubmissions],
  );

  const submissions = useMemo(
    () => displaySubmissions.map(d => d.submission),
    [displaySubmissions],
  );
  const expanded = useMemo(
    () => displaySubmissions.every(d => d.expanded),
    [displaySubmissions],
  );

  const onToggleExpand = useCallback(() => {
    setDisplaySubmissions((v: DisplaySubmissionType[]) =>
      v.map(d => ({
        ...d,
        expanded: !expanded,
      })),
    );
  }, [expanded, setDisplaySubmissions]);

  const checkedSubmissions = useMemo(
    () => displaySubmissions.map(d => d.checked),
    [displaySubmissions],
  );

  const allChecked = useMemo(
    () =>
      displaySubmissions.length !== 0 &&
      displaySubmissions.every(d => d.checked),
    [displaySubmissions],
  );

  const isIndeterminate = useMemo(
    () => checkedSubmissions.some(Boolean) && !allChecked,
    [checkedSubmissions, allChecked],
  );

  return (
    <>
      <Flex py={4} w="full" justifyContent="space-between">
        <Flex gap={4}>
          <Box borderRadius={24} bgColor="rgba(255, 255, 255, 0.06)" px={8}>
            <Checkbox
              py={3}
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={e => checkAll(e.target.checked)}
            />
          </Box>

          {checkedSubmissions.some(item => item) && (
            <>
              <ReviewPopoverButton
                toReview={submissions.filter((_, i) => checkedSubmissions[i])}
                onReview={onReview}
                isDisabled={isDisabled}
                success={false}
              />
              <ReviewPopoverButton
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
            fontSize={14}
            fontWeight="bold"
            bgColor="whiteAlpha.100"
            borderRadius={24}
            borderColor="transparent"
            onChange={e => setSort(e.target.value as SORT)}
            value={sortValue}
          >
            <option value={SORT.DateAsc}>Date Asc</option>
            <option value={SORT.DateDesc}>Date Desc</option>
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
            {allQuestIds.map((value: string) => (
              <option key={value} value={value}>
                Quest {Number(value) + 1}
              </option>
            ))}
          </Select>
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
        </Flex>
      </Flex>
    </>
  );
};
