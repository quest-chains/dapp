import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { SortBy } from './QuestChains';

const SortDropdown: React.FC<{
  sortBy: Record<SortBy, boolean>;
  setSortBy: (value: Record<SortBy, boolean>) => void;
  label: string;
}> = ({ sortBy, setSortBy, label }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover
      placement="bottom-end"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          gap={3}
          fontSize={14}
          fontWeight="bold"
          bgColor="whiteAlpha.100"
          borderRadius={24}
          // borderColor="transparent"
        >
          <Text>{label}</Text>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </PopoverTrigger>
      <PopoverContent bgColor="#0F172A" maxW={200}>
        {/* <PopoverArrow /> */}
        <PopoverBody gap={2}>
          <Flex direction="column" gap={3}>
            {Object.keys(sortBy).map((item, index) => {
              return (
                <Flex justifyContent="space-between" key={index}>
                  <Text fontSize="sm">{item}</Text>
                  <Checkbox
                    isChecked={sortBy[item as SortBy]}
                    variant="circular"
                    fontSize="xs"
                    onChange={() =>
                      setSortBy({
                        ...sortBy,
                        // set the item that was previously true to false
                        [Object.keys(sortBy).find(
                          key => sortBy[key as SortBy],
                        ) as SortBy]: false,
                        // set the item that was clicked to true
                        [item as SortBy]: !sortBy[item as SortBy],
                      })
                    }
                  />
                </Flex>
              );
            })}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SortDropdown;
