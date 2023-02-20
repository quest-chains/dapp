import { HStack, Select, Text } from '@chakra-ui/react';

enum SortBy {
  'Popularity' = 'Popularity',
  'Newest' = 'Newest',
  'Oldest' = 'Oldest',
}

const Sort: React.FC<{
  sortBy: string;
  setSortBy: (value: string) => void;
}> = ({ sortBy, setSortBy }) => {
  return (
    <HStack>
      <Text fontSize="sm">Sort by</Text>
      <Select
        onChange={e => setSortBy(e.target.value)}
        value={sortBy}
        w="auto"
        fontSize={14}
        fontWeight="bold"
        bgColor="whiteAlpha.100"
        borderRadius={24}
        borderColor="transparent"
        cursor="pointer"
      >
        <option value={SortBy.Newest}>Newest</option>
        <option value={SortBy.Oldest}>Oldest</option>
        <option value={SortBy.Popularity}>Popularity</option>
      </Select>
    </HStack>
  );
};

export default Sort;
