import { Tab, TabList, Text } from '@chakra-ui/react';

export const ReviewTabsList: React.FC<{
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
